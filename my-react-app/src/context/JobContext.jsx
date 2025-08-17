import React, { createContext, useContext, useState, useEffect } from 'react';
import { makeRequest, API_ROUTES, API_BASE_URL } from '../config/api';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [formattedJobs, setFormattedJobs] = useState([]);
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
      // Fetch jobs when user logs in
      fetchJobs();
    }
  }, [user]);

  // Helper to extract street name from full address
  const getStreetName = (fullAddress) => {
    // This regex matches everything up to the last number in the address
    const match = fullAddress.match(/(.*?)\s*\d+\s*$/);
    return match ? match[1].trim() : fullAddress;
  };

  // Error handling
  const handleError = (err) => {
    console.error('API error:', err);
    if (err.message.includes('Not authenticated')) {
      setError('Please log in to view jobs');
      setActiveJobs([]);
      setCompletedFlyers({});
    }
  };

  // Handle job completion and organize flyers by street
  const handleJobCompletion = async (job) => {
    try {
      // console.log('Processing completed job:', job);
      
      // If job doesn't have required fields, fetch full job details first
      if (!job.total_addresses || !job.processed_addresses) {
        // console.log('Fetching full job details...');
        const jobDetails = await makeRequest(`${API_ROUTES.jobs}${job.id}`, 'GET');
        job = { ...job, ...jobDetails };
      }
      
      const addresses = await makeRequest(API_ROUTES.jobAddresses(job.id), 'GET');
      console.log('DEBUG - Addresses received:', addresses);
      
      if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
        console.warn('No addresses received for completed job');
        return;
      }

      // Update the job with the correct number of addresses
      job.total_addresses = addresses.length;
      job.completed_addresses = addresses.length;
      
      // Process all addresses and organize by street
      const flyersByStreet = {};
      
      for (const address of addresses) {
        try {
          // Construct the direct image URL using the output-image endpoint
          const imageUrl = `${API_BASE_URL}/jobs/${job.id}/addresses/${address.id}/output-image`;
          console.log('DEBUG - Processing address:', {
            jobId: job.id,
            addressId: address.id,
            fullAddress: address.full_address,
            imageUrl: imageUrl.split('?')[0] // Log URL without token
          });
          
          // Extract street name from address components
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

      // Update state with new flyers and job information
      setCompletedFlyers(prev => {
        const newState = { ...prev };
        Object.entries(flyersByStreet).forEach(([street, flyers]) => {
          // Check if we already have flyers for this job
          const existingJobFlyers = newState[street]?.filter(f => f.jobId === job.id) || [];
          if (existingJobFlyers.length > 0) {
            return;
          }
          
          // Add new flyers for this street
          if (!newState[street]) {
            newState[street] = flyers;
          } else {
            newState[street] = [...flyers, ...newState[street]];
          }
        });
        console.log('DEBUG - Updated flyers:', newState);
        return newState;
      });

      // Update the active jobs with the correct address count
      setActiveJobs(prev => 
        prev.map(j => j.id === job.id 
          ? { ...j, total_addresses: addresses.length, completed_addresses: addresses.length }
          : j
        )
      );
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
          console.log('Found completed job during fetch:', job);
          await handleJobCompletion(job);
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
  };

  // Poll for updates
  useEffect(() => {
    let pollInterval;
    
    if (user) {  // Only start polling if user is logged in
      // Set up polling
      pollInterval = setInterval(async () => {
        try {
          const response = await makeRequest(API_ROUTES.jobs, 'GET');
          
          // Update active jobs and process completed ones
          for (const job of response) {
            if (job.status === 'completed') {
              await handleJobCompletion(job);
            }
          }
          
          setActiveJobs(response);
        } catch (err) {
          console.error('Poll update failed:', err);
          handleError(err);
        }
      }, 5000);

      return () => {
        if (pollInterval) {
          clearInterval(pollInterval);
        }
      };
    }
  }, [user]); // Only depend on user state



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

  // Format jobs with addresses
  const formatJobs = async () => {
    const formattedJobs = [];
    for (const job of activeJobs) {
      try {
        const addresses = await makeRequest(API_ROUTES.jobAddresses(job.id), 'GET');
        const streets = addresses && Array.isArray(addresses) 
          ? [...new Set(addresses.map(addr => 
              addr.street || getStreetName(addr.full_address || `${addr.house_number} ${addr.city}, ${addr.state}`)
            ))]
          : [];
        
        formattedJobs.push({
          id: job.id,
          title: job.description || 'Untitled Campaign',
          addresses: streets,
          startTime: job.created_at ? new Date(job.created_at).toISOString() : null,
          progress: Math.round((job.completed_addresses / (job.total_addresses || 1)) * 100),
          status: job.status || 'pending',
          thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=200&h=150'
        });
      } catch (error) {
        console.error('Error formatting job:', error);
      }
    }
    return formattedJobs;
  };

  // Update formatted jobs when active jobs change
  useEffect(() => {
    const updateFormattedJobs = async () => {
      const formatted = await formatJobs();
      setFormattedJobs(formatted);
    };
    updateFormattedJobs();
  }, [activeJobs]);

  return (
    <JobContext.Provider value={{ 
      activeJobs: formattedJobs,
      completedFlyers,
      isLoading,
      error,
      fetchJobs,
      fetchJobStatus: fetchJobs,  // Simplified to just refetch all jobs
      deleteJob
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);