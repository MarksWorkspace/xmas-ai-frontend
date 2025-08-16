import React, { createContext, useContext, useState, useEffect } from 'react';
import { makeRequest, API_ROUTES } from '../config/api';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all active jobs
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest(API_ROUTES.jobs, 'GET');
      console.log('All jobs response:', response);
      
      // Fetch initial status for each job
      const jobsWithStatus = await Promise.all(
        response.map(async (job) => {
          try {
            const status = await makeRequest(API_ROUTES.jobStatus(job.id), 'GET');
            return { ...job, ...status };
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
      console.log(`Job ${jobId} status response:`, statusResponse);
      
      setActiveJobs(prev => prev.map(job => {
        if (job.id === jobId) {
          return { 
            ...job,
            ...statusResponse, // This includes progress, total_addresses, etc.
            status: statusResponse.status || 'queued'
          };
        }
        return job;
      }));
    } catch (err) {
      console.error(`Error fetching status for job ${jobId}:`, err);
    }
  };

  // Poll for updates
  useEffect(() => {
    fetchJobs(); // Initial fetch

    const pollInterval = setInterval(() => {
      activeJobs.forEach(job => {
        if (job.status !== 'completed' && job.status !== 'failed') {
          fetchJobStatus(job.id);
        }
      });
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, [activeJobs]); // Add activeJobs as dependency

  // Format job for display
  const formatJobForDisplay = (job) => {
    // Calculate progress display
    let progressDisplay;
    if (typeof job.progress === 'number') {
      progressDisplay = job.progress;
    } else if (job.total_addresses === 0) {
      progressDisplay = 'Queued';
    } else {
      const percent = Math.round((job.completed_addresses / job.total_addresses) * 100);
      progressDisplay = percent;
    }

    return {
      id: job.id,
      title: job.description || 'Untitled Campaign',
      homes: job.total_addresses || '0',
      startTime: job.created_at ? `Started ${new Date(job.created_at).toLocaleString()}` : 'Starting soon',
      progress: progressDisplay,
      status: job.status || 'pending',
      thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=200&h=150'
    };
  };

  return (
    <JobContext.Provider value={{ 
      activeJobs: activeJobs.map(formatJobForDisplay),
      isLoading,
      error,
      fetchJobs,
      fetchJobStatus
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);