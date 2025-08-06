import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

export default App;