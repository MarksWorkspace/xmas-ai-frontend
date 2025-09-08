import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { makeRequest, API_ROUTES, API_BASE_URL } from '../config/api';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedFlyers, setCompletedFlyers] = useState({});
  const [sortedJobIds, setSortedJobIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, freeUsage } = useAuth();

  // Helper to extract street name from full address
  const getStreetName = useCallback((fullAddress) => {
    const match = fullAddress.match(/(.*?)\s*\d+\s*$/);
    return match ? match[1].trim() : fullAddress;
  }, []);

  // Error handling
  const handleError = useCallback((err) => {
    if (err.message.includes('Not authenticated')) {
      setError('Please log in to view jobs');
      setActiveJobs([]);
      setCompletedFlyers({});
    }
  }, []);

  // Delete a job
  const deleteJob = useCallback(async (jobId) => {
    try {
      setIsLoading(true);
      await makeRequest(`${API_ROUTES.jobs}${jobId}`, 'DELETE');
      setActiveJobs(prev => prev.filter(job => job.id !== jobId));
      setError(null);
    } catch (err) {
      console.error('Error deleting job:', err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Check if job exceeds free image limit
  const checkFreeImageLimit = useCallback(async (job) => {
    if (!freeUsage || !job) return false;

    try {
      // Get job status to check total_addresses
      const jobStatus = await makeRequest(API_ROUTES.jobStatus(job.id), 'GET');
      
      // Only proceed if total_addresses is available and greater than 0
      if (jobStatus.total_addresses && jobStatus.total_addresses > 0) {
        // If total addresses exceeds free images remaining
        if (jobStatus.total_addresses > freeUsage.free_images_remaining) {
          // Delete the job
          await deleteJob(job.id);
          // Set error message
          setError(`This job requires ${jobStatus.total_addresses} images, but you only have ${freeUsage.free_images_remaining} free images remaining. Please upgrade your account to process more images.`);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Error checking free image limit:', err);
      return false;
    }
  }, [freeUsage, deleteJob]);

  // Handle job completion and organize flyers by street
  const handleJobCompletion = useCallback(async (job) => {
    try {
      const addresses = await makeRequest(API_ROUTES.jobAddresses(job.id), 'GET');
      
      if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
        return;
      }

      job.total_addresses = addresses.length;
      job.completed_addresses = addresses.length;
      
      const flyersByStreet = {};
      
      for (const address of addresses) {
        try {
          const imageUrl = `${API_BASE_URL}/jobs/${job.id}/addresses/${address.id}/output-image`;
          const streetName = address.street || getStreetName(address.full_address || `${address.house_number} ${address.city}, ${address.state}`);
        
          const flyer = {
            id: `${job.id}-${address.id}`,
            image: imageUrl,
            fullAddress: address.full_address || `${address.house_number} ${address.street}`,
            houseNumber: address.house_number,
            city: address.city,
            state: address.state,
            latitude: address.latitude,
            longitude: address.longitude,
            jobId: job.id,
            createdAt: address.created_at
          };

          if (!flyersByStreet[streetName]) {
            flyersByStreet[streetName] = [];
          }
          flyersByStreet[streetName].push(flyer);
        } catch (error) {
          console.error('Error processing address:', error);
        }
      }

      setCompletedFlyers(prev => {
        const newState = { ...prev };
        const completionDate = job.completed_at;
        
        if (!newState[job.id]) {
          newState[job.id] = {
            title: job.description || 'Untitled Campaign',
            createdAt: job.created_at,
            completedAt: completionDate,
            streets: flyersByStreet
          };
        } else {
          newState[job.id] = {
            ...newState[job.id],
            completedAt: completionDate,
            streets: flyersByStreet
          };
        }
        
        return newState;
      });

      setSortedJobIds(prev => {
        const allIds = new Set([...prev, job.id]);
        return Array.from(allIds).sort((a, b) => {
          const dateA = new Date(completedFlyers[a]?.completedAt || 0).getTime();
          const dateB = new Date(completedFlyers[b]?.completedAt || 0).getTime();
          return dateB - dateA;
        });
      });
    } catch (error) {
      console.error('Error processing completed job:', error);
    }
  }, [getStreetName]);

  // Fetch all active jobs
  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest(API_ROUTES.jobs, 'GET');
      
      // Process any completed jobs immediately
      for (const job of response) {
        if (job.status === 'completed') {
          await handleJobCompletion(job);
        }
      }

      // Check free image limits for all non-completed jobs
      for (const job of response) {
        if (job.status !== 'completed') {
          const exceededLimit = await checkFreeImageLimit(job);
          if (exceededLimit) {
            // Job was deleted, update the response
            response = response.filter(j => j.id !== job.id);
          }
        }
      }

      setActiveJobs(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleJobCompletion, handleError, checkFreeImageLimit]);

  // Reset state when user changes
  useEffect(() => {
    if (!user) {
      setActiveJobs([]);
      setCompletedFlyers({});
      setError('Please log in to view jobs');
    } else {
      setError(null);
      fetchJobs();
    }
  }, [user, fetchJobs]);

  // Poll for updates
  useEffect(() => {
    let pollInterval;
    
    if (user) {
      pollInterval = setInterval(async () => {
        try {
          const response = await makeRequest(API_ROUTES.jobs, 'GET');
          let updatedResponse = [...response];
          
          // Check all non-completed jobs for free image limit
          for (const job of response) {
            if (job.status !== 'completed') {
              const exceededLimit = await checkFreeImageLimit(job);
              if (exceededLimit) {
                // Remove the job from response if limit exceeded
                updatedResponse = updatedResponse.filter(j => j.id !== job.id);
              }
            } else {
              await handleJobCompletion(job);
            }
          }
          
          setActiveJobs(updatedResponse);
        } catch (err) {
          handleError(err);
        }
      }, 5000);

      return () => {
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      };
    }
  }, [user, handleJobCompletion, handleError, checkFreeImageLimit]);

  return (
    <JobContext.Provider value={{ 
      activeJobs: activeJobs.filter(job => job.status !== 'completed').map(job => {
        const campaignName = job.metadata?.campaign_name || 
                           job.campaign_name || 
                           (job.description && job.description.split('-')[0].trim()) ||
                           'Untitled Campaign';
        
        const streets = job.addresses?.map(addr => {
          const street = addr.street || (addr.full_address?.match(/^(.+?)(?=\s+\d+|$)/)?.[1]?.trim());
          return street || '';
        }).filter(Boolean) || [];

        const uniqueStreets = [...new Set(streets)].sort();

        return {
          id: job.id,
          title: campaignName,
          streets: uniqueStreets,
          startTime: job.created_at || null,
          progress: Math.round((job.completed_addresses / (job.total_addresses || 1)) * 100),
          status: job.status || 'pending',
          thumbnail: job.thumbnail || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=200&h=150'
        };
      }),
      completedFlyers,
      sortedJobIds,
      isLoading,
      error,
      fetchJobs,
      fetchJobStatus: fetchJobs,
      deleteJob
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);