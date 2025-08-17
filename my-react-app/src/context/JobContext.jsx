import React, { createContext, useContext, useState, useEffect } from 'react';
import { makeRequest, API_ROUTES, API_BASE_URL } from '../config/api';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedFlyers, setCompletedFlyers] = useState({});  // Organized by street
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

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
  }, [user]);

  // Helper to extract street name from full address
  const getStreetName = (fullAddress) => {
    const match = fullAddress.match(/(.*?)\s*\d+\s*$/);
    return match ? match[1].trim() : fullAddress;
  };

  // Error handling
  const handleError = (err) => {
    if (err.message.includes('Not authenticated')) {
      setError('Please log in to view jobs');
      setActiveJobs([]);
      setCompletedFlyers({});
    }
  };

  // Handle job completion and organize flyers by street
  const handleJobCompletion = async (job) => {
    try {
      if (!job.total_addresses || !job.processed_addresses) {
        const jobDetails = await makeRequest(`${API_ROUTES.jobs}${job.id}`, 'GET');
        job = { ...job, ...jobDetails };
      }
      
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
            fullAddress: address.full_address || `${address.house_number} ${address.city}, ${address.state}`,
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
        Object.entries(flyersByStreet).forEach(([street, flyers]) => {
          const existingJobFlyers = newState[street]?.filter(f => f.jobId === job.id) || [];
          if (existingJobFlyers.length > 0) {
            return;
          }
          
          if (!newState[street]) {
            newState[street] = flyers;
          } else {
            newState[street] = [...flyers, ...newState[street]];
          }
        });
        return newState;
      });
    } catch (error) {
      console.error('Error processing completed job:', error);
    }
  };

  // Fetch all active jobs
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest(API_ROUTES.jobs, 'GET');
      
      // Process any completed jobs immediately
      for (const job of response) {
        if (job.status === 'completed') {
          await handleJobCompletion(job);
        }
      }

      // Log active jobs once on page load
      if (response.length > 0) {
        const jobInfo = response.map(job => ({
          jobId: job.id,
          description: job.description,
          campaignName: job.campaign_name,
          name: job.name,
          title: job.title,
          status: job.status,
          addresses: job.addresses?.map(addr => ({
            addressId: addr.id,
            fullAddress: addr.full_address
          })) || []
        }));
        console.log('Job data:', jobInfo);
      }
      
      setActiveJobs(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for updates
  useEffect(() => {
    let pollInterval;
    
    if (user) {
      pollInterval = setInterval(async () => {
        try {
          const response = await makeRequest(API_ROUTES.jobs, 'GET');
          
          for (const job of response) {
            if (job.status === 'completed') {
              await handleJobCompletion(job);
            }
          }
          
          setActiveJobs(response);
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
  }, [user]);

  // Format job for display
  const formatJobForDisplay = async (job) => {
    let streets = [];
    try {
      const addresses = await makeRequest(API_ROUTES.jobAddresses(job.id), 'GET');
      if (addresses && Array.isArray(addresses)) {
        // Extract unique street names
        streets = [...new Set(addresses.map(addr => {
          const match = addr.full_address?.match(/^(.+?)(?=\s+\d+|$)/);
          return match ? match[1].trim() : '';
        }).filter(Boolean))];
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }

    // Extract campaign name from metadata or description
    const campaignName = job.metadata?.campaign_name || 
                       job.campaign_name || 
                       (job.description && job.description.split('-')[0].trim()) ||
                       'Untitled Campaign';

    return {
      id: job.id,
      title: campaignName,
      streets: streets,
      startTime: job.created_at ? new Date(job.created_at).toISOString() : null,
      progress: Math.round((job.completed_addresses / (job.total_addresses || 1)) * 100),
      status: job.status || 'pending',
      thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=200&h=150'
    };
  };

  // Delete a job
  const deleteJob = async (jobId) => {
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
  };

  return (
    <JobContext.Provider value={{ 
      activeJobs: activeJobs.map(job => {
        // Extract campaign name from metadata or description
        const campaignName = job.metadata?.campaign_name || 
                           job.campaign_name || 
                           (job.description && job.description.split('-')[0].trim()) ||
                           'Untitled Campaign';
        
        // Extract street names from addresses if available
        const streets = job.addresses?.map(addr => {
          const street = addr.street || (addr.full_address?.match(/^(.+?)(?=\s+\d+|$)/)?.[1]?.trim());
          return street || '';
        }).filter(Boolean) || [];

        // Remove duplicates and sort
        const uniqueStreets = [...new Set(streets)].sort();

        return {
          id: job.id,
          title: campaignName,
          streets: uniqueStreets,
          startTime: job.created_at ? new Date(job.created_at).toISOString() : null,
          progress: Math.round((job.completed_addresses / (job.total_addresses || 1)) * 100),
          status: job.status || 'pending',
          thumbnail: job.thumbnail || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=200&h=150'
        };
      }),
      completedFlyers,
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