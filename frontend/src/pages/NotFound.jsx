import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-dark-900 px-4 text-center">
    <p className="text-7xl font-extrabold text-primary-500 mb-2">404</p>
    <h1 className="text-2xl font-bold mb-2">Page not found</h1>
    <p className="text-slate-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
