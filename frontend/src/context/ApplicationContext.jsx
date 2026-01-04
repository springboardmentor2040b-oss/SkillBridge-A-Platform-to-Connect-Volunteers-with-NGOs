import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Add this import

// Create the context
const ApplicationContext = createContext();

// Provider component
export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Use environment variable for API base
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // ================= HELPERS =================
  const getToken = () => localStorage.getItem('token');

  const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const calculateStats = (apps = []) => ({
    total: apps.length,
    pending: apps.filter(app => app.status === 'pending').length,
    accepted: apps.filter(app => app.status === 'accepted').length,
    rejected: apps.filter(app => app.status === 'rejected').length
  });

  // ================= LOAD APPLICATIONS =================
  const loadApplications = useCallback(async () => {
    try {
      const token = getToken();
      const user = getUser();

      if (!token || !user) {
        setError('Please log in to view applications');
        return;
      }

      setLoading(true);
      setError(null);

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let appsResponse;

      if (user.role === 'volunteer') {
        appsResponse = await axios.get(
          `${API_BASE}/api/applications/my-applications`,
          { headers }
        );
      } else if (user.role === 'ngo') {
        appsResponse = await axios.get(
          `${API_BASE}/api/applications/ngo-applications`,
          { headers }
        );
      } else {
        setApplications([]);
        setStats(calculateStats([]));
        return;
      }

      const apps = appsResponse.data || [];
      setApplications(apps);

      // ===== Load stats only if endpoint exists =====
      try {
        if (user.role === 'ngo') {
          const statsResponse = await axios.get(
            `${API_BASE}/api/applications/stats`,
            { headers }
          );
          setStats(statsResponse.data);
        } else {
          setStats(calculateStats(apps));
        }
      } catch {
        setStats(calculateStats(apps));
      }

    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to load applications'
        );
      }
      setApplications([]);
      setStats(calculateStats([]));
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // ================= APPLY FOR OPPORTUNITY =================
  const applyForOpportunity = async (opportunityId, coverLetter = '') => {
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'Please log in to apply' };
      }

      const response = await axios.post(
        `${API_BASE}/api/applications/apply`,
        { opportunityId, coverLetter },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await loadApplications();

      return {
        success: true,
        data: response.data,
        message: 'Application submitted successfully!'
      };
    } catch (err) {
      let errorMessage = 'Failed to apply';

      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response?.data?.message ||
          'You may have already applied';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  // ================= CHECK IF APPLIED =================
  const checkIfApplied = async (opportunityId) => {
    try {
      const token = getToken();
      if (!token) return false;

      const response = await axios.get(
        `${API_BASE}/api/applications/applied/${opportunityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.applied || false;
    } catch {
      return false;
    }
  };

  // ================= UPDATE APPLICATION STATUS =================
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = getToken();
      if (!token) {
        return { success: false, error: 'Please log in again' };
      }

      const response = await axios.put(
        `${API_BASE}/api/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      await loadApplications();

      return {
        success: true,
        data: response.data,
        message: 'Status updated successfully!'
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to update status'
      };
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        stats,
        loading,
        error,
        applyForOpportunity,
        checkIfApplied,
        updateApplicationStatus,
        refreshApplications: loadApplications
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

// Export the context itself for direct usage if needed
export { ApplicationContext };