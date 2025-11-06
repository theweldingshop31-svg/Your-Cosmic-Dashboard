import React, { useState } from 'react';
import { generateBirthBlueprint } from '../services/geminiService';
import { BirthBlueprint } from '../types';
import { LoadingSpinner } from './icons/AstrologyIcons';

interface OnboardingWizardProps {
  onOnboardingComplete: (blueprint: BirthBlueprint) => void;
}

const InputField: React.FC<{
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}> = ({ label, id, type, value, onChange, placeholder }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-indigo-200 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-900/50 border border-indigo-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
      required
    />
  </div>
);

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onOnboardingComplete }) => {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const blueprint = await generateBirthBlueprint(fullName, dateOfBirth, timeOfBirth, placeOfBirth);
      onOnboardingComplete(blueprint);
    } catch (err) {
      setError('Could not generate your Birth Blueprint. Please check your details and try again. The cosmic energies might be misaligned!');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-indigo-900/50 text-white">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 space-y-8 transform transition-all duration-500 hover:scale-105">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
            SynchroMap
          </h1>
          <p className="mt-2 text-indigo-200">Unlock Your Personal Cosmic Blueprint</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Full Name at Birth"
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g., Jane Doe"
          />
          <InputField
            label="Date of Birth"
            id="dob"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            placeholder=""
          />
          <InputField
            label="Exact Time of Birth"
            id="tob"
            type="time"
            value={timeOfBirth}
            onChange={(e) => setTimeOfBirth(e.target.value)}
            placeholder=""
          />
          <InputField
            label="City & Country of Birth"
            id="pob"
            type="text"
            value={placeOfBirth}
            onChange={(e) => setPlaceOfBirth(e.target.value)}
            placeholder="e.g., London, UK"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
          >
            {isLoading ? <LoadingSpinner /> : 'Generate My Blueprint'}
          </button>
        </form>
      </div>
    </div>
  );
};