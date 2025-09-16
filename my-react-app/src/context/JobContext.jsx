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

  // Fetch job status with progress
  const fetchJobStatus = useCallback(async (jobId) => {
    try {
      const statusData = await makeRequest(API_ROUTES.jobStatus(jobId), 'GET');
      return statusData;
    } catch (err) {
      console.error('Error fetching job status:', err);
      return null;
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

  // Check if job exceeds free image limit - DISABLED
  const checkFreeImageLimit = useCallback(async (job) => {
    // Free usage limits have been removed - always return false (no limit exceeded)
    return false;
  }, []);

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
        
        newState[job.id] = {
          title: job.description || 'Untitled Campaign',
          createdAt: job.created_at,
          completedAt: completionDate,
          streets: flyersByStreet
        };
        
        return newState;
      });

      setSortedJobIds(prev => {
        // Create a new Set to ensure unique IDs
        const allIds = new Set([...prev, job.id]);
        
        // Convert to array and sort by completion date
        const sortedIds = Array.from(allIds).sort((a, b) => {
          // Get completion dates, defaulting to 0 if not found
          const dateA = new Date(completedFlyers[a]?.completedAt || 0).getTime();
          const dateB = new Date(completedFlyers[b]?.completedAt || 0).getTime();
          
          // Sort in ascending order (oldest to newest)
          return dateA - dateB;
        });
        
        return sortedIds;
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

      // Fetch status for each job to get real-time progress
      const jobsWithStatus = await Promise.all(
        response.map(async (job) => {
          const statusData = await fetchJobStatus(job.id);
          return {
            ...job,
            // Update job with real-time status data
            completed_addresses: statusData?.completed_addresses || job.completed_addresses || 0,
            total_addresses: statusData?.total_addresses || job.total_addresses || 1,
            status: statusData?.status || job.status
          };
        })
      );

      // Process any completed jobs immediately
      for (const job of jobsWithStatus) {
        if (job.status === 'completed') {
          await handleJobCompletion(job);
        }
      }

      // Check free image limits for all non-completed jobs
      for (const job of jobsWithStatus) {
        if (job.status !== 'completed') {
          const exceededLimit = await checkFreeImageLimit(job);
          if (exceededLimit) {
            // Job was deleted, update the response
            jobsWithStatus = jobsWithStatus.filter(j => j.id !== job.id);
          }
        }
      }

      setActiveJobs(jobsWithStatus);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleJobCompletion, handleError, checkFreeImageLimit, fetchJobStatus]);

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

          // Fetch status for each job to get real-time progress
          let jobsWithStatus = await Promise.all(
            response.map(async (job) => {
              const statusData = await fetchJobStatus(job.id);
              return {
                ...job,
                // Update job with real-time status data
                completed_addresses: statusData?.completed_addresses || job.completed_addresses || 0,
                total_addresses: statusData?.total_addresses || job.total_addresses || 1,
                status: statusData?.status || job.status
              };
            })
          );

          // Process all jobs without free usage limit checks
          for (const job of jobsWithStatus) {
            if (job.status === 'completed') {
              await handleJobCompletion(job);
            }
            // Free usage limits have been removed - no need to check or filter jobs
          }
          
          setActiveJobs(jobsWithStatus);
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
  }, [user, handleJobCompletion, handleError, checkFreeImageLimit, fetchJobStatus]);

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

        // Calculate progress percentage using real-time data
        const completedAddresses = job.completed_addresses || 0;
        const totalAddresses = job.total_addresses || 1;
        const progressPercentage = Math.round((completedAddresses / totalAddresses) * 100);

        return {
          id: job.id,
          title: campaignName,
          streets: uniqueStreets,
          startTime: job.created_at || null,
          progress: progressPercentage,
          status: job.status || 'pending',
          thumbnail: job.thumbnail || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=200&h=150',
          completedAddresses,
          totalAddresses
        };
      }),
      completedFlyers,
      sortedJobIds,
      isLoading,
      error,
      fetchJobs,
      fetchJobStatus,
      deleteJob
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);