import React from 'react';
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

/**
 * ErrorView Component
 * Displays an error message when a translation cannot be found
 * Provides a button to return to the home page
 */
const ErrorView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Translation Not Found</h1>
        <p className="mb-4">The translation you're looking for could not be found.</p>
        <button 
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline"
        >
          Return to Home
        </button>
      </Card>
    </div>
  );
};

export default ErrorView;