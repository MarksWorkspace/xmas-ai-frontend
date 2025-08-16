import React, { createContext, useContext, useState, useEffect } from 'react';
import { makeRequest, API_ROUTES } from '../config/api';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch all active jobs
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest(API_ROUTES.jobs, 'GET');
      //console.log('All jobs response:', response);
      
      // Fetch initial status for each job
      const jobsWithStatus = await Promise.all(
        response.map(async (job) => {
          try {
            const statusResponse = await makeRequest(API_ROUTES.jobStatus(job.id), 'GET');
            console.log(`Initial status for job ${job.id}:`, statusResponse);
            return { 
              ...job, 
              ...statusResponse,
              status: statusResponse.status // Make sure we explicitly set the status field
            };
          } catch (err) {
            console.error(`Error fetching status for job ${job.id}:`, err);
            return job;
          }
        })
      );
      
      setActiveJobs(jobsWithStatus);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  // Get a specific job's status
  const fetchJobStatus = async (jobId) => {
    try {
      const statusResponse = await makeRequest(API_ROUTES.jobStatus(jobId), 'GET');
      //console.log(`Job ${jobId} status response:`, statusResponse);
      
      setActiveJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          const updatedJob = { 
            ...job,
            ...statusResponse,
            status: statusResponse.status // Use the exact status from the response
          };
          console.log('Updated job:', updatedJob);
          return updatedJob;
        }
        return job;
      }));
    } catch (err) {
      console.error(`Error fetching status for job ${jobId}:`, err);
      
      // If we get a 401 error, the token might be invalid
      if (err.message.includes('Not authenticated')) {
        // Clear the invalid token
        localStorage.removeItem('auth_token');
        // Set error state to notify user
        setError('Your session has expired. Please log in again.');
        // Stop polling
        setActiveJobs([]);
      }
    }
  };

  // Poll for updates
  useEffect(() => {
    let pollInterval;
    
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Immediate fetch
      const doInitialFetch = async () => {
        try {
          await fetchJobs();
        } catch (err) {
          console.error('Initial fetch failed:', err);
        }
      };
      doInitialFetch();

      // Set up polling
      pollInterval = setInterval(async () => {
        const currentToken = localStorage.getItem('auth_token');
        if (!currentToken) {
          clearInterval(pollInterval);
          return;
        }

        try {
          const currentJobs = activeJobs;
          for (const job of currentJobs) {
            if (job.status !== 'completed' && job.status !== 'failed') {
              await fetchJobStatus(job.id);
            }
          }
        } catch (err) {
          console.error('Poll update failed:', err);
        }
      }, 5000);
    } else {
      setError('Please log in to view jobs');
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [user]); // Only depend on user state

  // Format job for display
  const formatJobForDisplay = (job) => {
    // Calculate progress percentage for processing jobs
    const calculateProgress = () => {
      if (!job.total_addresses || job.total_addresses === 0) return 0;
      return Math.round((job.completed_addresses / job.total_addresses) * 100);
    };

    // Log job data for debugging
    console.log('Formatting job:', job);

    return {
      id: job.id,
      title: job.description || 'Untitled Campaign',
      homes: job.total_addresses || '0',
      startTime: job.created_at ? `Started ${new Date(job.created_at).toLocaleString()}` : 'Starting soon',
      progress: calculateProgress(),
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
      setError('Failed to delete job');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <JobContext.Provider value={{ 
      activeJobs: activeJobs.map(formatJobForDisplay),
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