
import React, { useState, useEffect } from 'react';
import { OnboardingWizard } from './components/OnboardingWizard';
import { Dashboard } from './components/Dashboard';
import { BirthBlueprint } from './types';

const App: React.FC = () => {
  const [blueprint, setBlueprint] = useState<BirthBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaidPlan, setIsPaidPlan] = useState(false);

  useEffect(() => {
    try {
      const savedBlueprint = localStorage.getItem('synchroMapBlueprint');
      if (savedBlueprint) {
        setBlueprint(JSON.parse(savedBlueprint));
      }
      const savedPlan = localStorage.getItem('synchroMapPlan');
      if (savedPlan && JSON.parse(savedPlan) === true) {
        setIsPaidPlan(true);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      localStorage.removeItem('synchroMapBlueprint');
      localStorage.removeItem('synchroMapPlan');
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (newBlueprint: BirthBlueprint) => {
    try {
      localStorage.setItem('synchroMapBlueprint', JSON.stringify(newBlueprint));
      setBlueprint(newBlueprint);
    } catch (error) {
        console.error("Failed to save blueprint to localStorage", error);
    }
  };
  
  const handleUpgrade = () => {
    try {
      localStorage.setItem('synchroMapPlan', JSON.stringify(true));
      setIsPaidPlan(true);
    } catch (error) {
      console.error("Failed to save plan to localStorage", error);
    }
  };

  const backgroundStyle = {
      background: 'radial-gradient(circle, rgba(13,17,35,1) 0%, rgba(10,12,24,1) 100%)'
  };

  if (isLoading) {
    return (
        <div style={backgroundStyle} className="min-h-screen flex items-center justify-center">
            <h1 className="text-white text-2xl">Loading Cosmic Alignments...</h1>
        </div>
    );
  }

  return (
    <div style={backgroundStyle} className="min-h-screen">
      {blueprint ? (
        <Dashboard blueprint={blueprint} isPaidPlan={isPaidPlan} onUpgrade={handleUpgrade} />
      ) : (
        <OnboardingWizard onOnboardingComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};

export default App;
