import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { sampleQueries } from '../data/sampleQueries';
import { fetchAnalytics } from '../services/classifier';

const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [queries, setQueries] = useState(sampleQueries);
  const [analytics, setAnalytics] = useState(null);

  const refreshAnalytics = useCallback(async () => {
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (e) {
    }
  }, []);

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  const addQuery = useCallback((newQuery) => {
    setQueries(prev => [newQuery, ...prev]);
    refreshAnalytics();
  }, [refreshAnalytics]);

  return (
    <GlobalContext.Provider value={{ queries, addQuery, analytics, refreshAnalytics }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useQueries = () => {
  const context = useContext(GlobalContext);
  return { queries: context.queries, addQuery: context.addQuery };
};

export const useAnalytics = () => {
  const context = useContext(GlobalContext);
  return { analytics: context.analytics, refreshAnalytics: context.refreshAnalytics };
};
