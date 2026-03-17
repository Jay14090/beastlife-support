import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import QueryAnalyzer from './components/QueryAnalyzer';
import QueryFeed from './components/QueryFeed';
import AutomationPlaybook from './components/AutomationPlaybook';
import SmartAlertFeed from './components/SmartAlertFeed';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col pt-16">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 relative">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyzer" element={<QueryAnalyzer />} />
            <Route path="/feed" element={<QueryFeed />} />
            <Route path="/automation" element={<AutomationPlaybook />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <SmartAlertFeed />
        </main>
      </div>
    </Router>
  );
}

export default App;
