
import React, { useState } from 'react';
import { BirthBlueprint, SynchronicityLog, Interpretation, DreamLog } from '../types';
import { generateInterpretation, generateDreamInterpretation, generateBlueprintInterpretation, generateLifePathInterpretation, generateExpressionInterpretation, generateSoulUrgeInterpretation, generatePersonalityInterpretation, generateSunSignInterpretation, generateMoonSignInterpretation, generateRisingSignInterpretation, generateChineseZodiacInterpretation } from '../services/geminiService';
import { SunIcon, MoonIcon, RisingIcon, LifePathIcon, ZodiacIcon, SparklesIcon, LoadingSpinner, NameNumerologyIcon } from './icons/AstrologyIcons';
import ReactMarkdown from 'react-markdown';

interface DashboardProps {
  blueprint: BirthBlueprint;
  isPaidPlan: boolean;
  onUpgrade: () => void;
}

const BlueprintCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  onClick?: () => void;
  isClickable?: boolean;
}> = ({ icon, title, value, subtitle, onClick, isClickable }) => (
  <div 
    className={`bg-gray-900/50 p-6 rounded-2xl border border-indigo-500/20 flex flex-col items-center text-center shadow-lg ${isClickable ? 'cursor-pointer transform hover:-translate-y-1 transition-transform duration-300' : ''}`}
    onClick={onClick}
    >
    <div className="mb-3">{icon}</div>
    <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-gray-400">{subtitle}</p>
  </div>
);

const InterpretationModal: React.FC<{ log: SynchronicityLog | DreamLog; onClose: () => void; isPaidPlan: boolean; onUpgrade: () => void; }> = ({ log, onClose, isPaidPlan, onUpgrade }) => {
    if (!log.interpretation) return null;

    const handleUpgradeClick = () => {
      onUpgrade();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 mb-2">Interpretation</h2>
                <p className="text-lg text-white mb-6 italic">For: "{log.description}"</p>
                
                <div className="bg-indigo-900/30 p-4 rounded-lg mb-6 border border-indigo-700">
                    <h3 className="font-bold text-indigo-300 mb-2">Quick Insight</h3>
                    <p className="text-gray-300">{log.interpretation.summary}</p>
                </div>
                
                <h3 className="font-bold text-indigo-300 mb-2 text-lg">Deeper Meaning</h3>
                {isPaidPlan ? (
                    <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-indigo-300">
                        <ReactMarkdown>{log.interpretation.fullInterpretation}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-indigo-300 max-h-24 overflow-hidden relative pointer-events-none">
                            <ReactMarkdown>{log.interpretation.fullInterpretation}</ReactMarkdown>
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 rounded-lg p-4 backdrop-blur-[2px]">
                            <div className="text-center space-y-4">
                                <h3 className="font-bold text-yellow-300 text-2xl">Unlock Your Full Interpretation</h3>
                                <p className="text-white">Upgrade to Pro to reveal the deep, personalized connection between this synchronicity and your unique cosmic blueprint.</p>
                                <button onClick={handleUpgradeClick} className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-8 rounded-lg transition-colors shadow-lg text-lg">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const BlueprintInterpretationModal: React.FC<{ title: string; interpretation: Interpretation; onClose: () => void; isPaidPlan: boolean; onUpgrade: () => void; }> = ({ title, interpretation, onClose, isPaidPlan, onUpgrade }) => {
    
    const handleUpgradeClick = () => {
      onUpgrade();
      // Don't close the modal, so user can see the unlocked content
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 mb-4">{title}</h2>
                
                <div className="bg-indigo-900/30 p-4 rounded-lg mb-6 border border-indigo-700">
                    <h3 className="font-bold text-indigo-300 mb-2">Quick Insight</h3>
                    <p className="text-gray-300">{interpretation.summary}</p>
                </div>
                
                <h3 className="font-bold text-indigo-300 mb-2 text-lg">Deeper Meaning</h3>
                {isPaidPlan ? (
                    <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-indigo-300">
                        <ReactMarkdown>{interpretation.fullInterpretation}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-indigo-300 max-h-24 overflow-hidden relative pointer-events-none">
                            <ReactMarkdown>{interpretation.fullInterpretation}</ReactMarkdown>
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 rounded-lg p-4 backdrop-blur-[2px]">
                            <div className="text-center space-y-4">
                                <h3 className="font-bold text-yellow-300 text-2xl">Unlock Your Full Interpretation</h3>
                                <p className="text-white">Upgrade to Pro to reveal the deep, personalized analysis of your cosmic energies.</p>
                                <button onClick={handleUpgradeClick} className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-8 rounded-lg transition-colors shadow-lg text-lg">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const UpgradePromptModal: React.FC<{
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
  description: string;
}> = ({ onClose, onUpgrade, featureName, description }) => {
    const handleUpgradeClick = () => {
        onUpgrade();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl shadow-2xl max-w-md w-full p-8 relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                <h2 className="text-2xl font-bold text-yellow-300 mb-4">Unlock {featureName}</h2>
                <p className="text-lg text-white mb-6">
                    {description}
                </p>
                <button onClick={handleUpgradeClick} className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg text-lg">
                    Upgrade to Pro
                </button>
            </div>
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ blueprint, isPaidPlan, onUpgrade }) => {
  const [logs, setLogs] = useState<SynchronicityLog[]>([]);
  const [newLog, setNewLog] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SynchronicityLog | null>(null);

  const [dreamLogs, setDreamLogs] = useState<DreamLog[]>([]);
  const [newDreamDescription, setNewDreamDescription] = useState('');
  const [isDreamLoading, setIsDreamLoading] = useState(false);
  const [selectedDreamLog, setSelectedDreamLog] = useState<DreamLog | null>(null);

  const [activeInputTab, setActiveInputTab] = useState<'sync' | 'dream'>('sync');
  const [activeJournalTab, setActiveJournalTab] = useState<'sync' | 'dream'>('sync');

  const [isBlueprintLoading, setIsBlueprintLoading] = useState(false);
  const [blueprintInterpretation, setBlueprintInterpretation] = useState<Interpretation | null>(null);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);
  
  const [isLifePathLoading, setIsLifePathLoading] = useState(false);
  const [lifePathInterpretation, setLifePathInterpretation] = useState<Interpretation | null>(null);
  const [isLifePathModalOpen, setIsLifePathModalOpen] = useState(false);

  const [isExpressionLoading, setIsExpressionLoading] = useState(false);
  const [expressionInterpretation, setExpressionInterpretation] = useState<Interpretation | null>(null);
  const [isExpressionModalOpen, setIsExpressionModalOpen] = useState(false);

  const [isSoulUrgeLoading, setIsSoulUrgeLoading] = useState(false);
  const [soulUrgeInterpretation, setSoulUrgeInterpretation] = useState<Interpretation | null>(null);
  const [isSoulUrgeModalOpen, setIsSoulUrgeModalOpen] = useState(false);

  const [isPersonalityLoading, setIsPersonalityLoading] = useState(false);
  const [personalityInterpretation, setPersonalityInterpretation] = useState<Interpretation | null>(null);
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState(false);

  const [isSunSignLoading, setIsSunSignLoading] = useState(false);
  const [sunSignInterpretation, setSunSignInterpretation] = useState<Interpretation | null>(null);
  const [isSunSignModalOpen, setIsSunSignModalOpen] = useState(false);

  const [isMoonSignLoading, setIsMoonSignLoading] = useState(false);
  const [moonSignInterpretation, setMoonSignInterpretation] = useState<Interpretation | null>(null);
  const [isMoonSignModalOpen, setIsMoonSignModalOpen] = useState(false);

  const [isRisingSignLoading, setIsRisingSignLoading] = useState(false);
  const [risingSignInterpretation, setRisingSignInterpretation] = useState<Interpretation | null>(null);
  const [isRisingSignModalOpen, setIsRisingSignModalOpen] = useState(false);

  const [isChineseZodiacLoading, setIsChineseZodiacLoading] = useState(false);
  const [chineseZodiacInterpretation, setChineseZodiacInterpretation] = useState<Interpretation | null>(null);
  const [isChineseZodiacModalOpen, setIsChineseZodiacModalOpen] = useState(false);

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.trim()) return;

    setIsLoading(true);
    const logEntry: SynchronicityLog = {
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      description: newLog,
    };
    
    try {
        const interpretation = await generateInterpretation(logEntry, blueprint);
        logEntry.interpretation = interpretation;
        setLogs([logEntry, ...logs]);
        setNewLog('');
    } catch (error) {
        console.error("Failed to get interpretation", error);
        logEntry.interpretation = {
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation. Please try again later."
        };
        setLogs([logEntry, ...logs]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleAddDreamLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDreamDescription.trim()) return;

    setIsDreamLoading(true);
    const dreamEntry: DreamLog = {
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      description: newDreamDescription,
    };
    
    try {
        const interpretation = await generateDreamInterpretation(dreamEntry, blueprint);
        dreamEntry.interpretation = interpretation;
        setDreamLogs([dreamEntry, ...dreamLogs]);
        setNewDreamDescription('');
    } catch (error) {
        console.error("Failed to get dream interpretation", error);
        dreamEntry.interpretation = {
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get a dream interpretation. Please try again later."
        };
        setDreamLogs([dreamEntry, ...dreamLogs]);
    } finally {
        setIsDreamLoading(false);
    }
  };

  const handleGetBlueprintMeaning = async () => {
    setIsBlueprintLoading(true);
    try {
        if (!blueprintInterpretation) { // Avoid re-fetching if already present
            const interpretation = await generateBlueprintInterpretation(blueprint);
            setBlueprintInterpretation(interpretation);
        }
    } catch (error) {
        console.error("Failed to get blueprint interpretation", error);
        setBlueprintInterpretation({
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation for your blueprint. Please try again later."
        });
    } finally {
        setIsBlueprintLoading(false);
        setIsBlueprintModalOpen(true);
    }
  };

  const handleBlueprintMeaningClick = () => {
    if (isPaidPlan) {
      handleGetBlueprintMeaning();
    } else {
      setIsUpgradeModalOpen(true);
    }
  };
  
  const handleGetLifePathMeaning = async () => {
    if (isLifePathLoading) return;
    setIsLifePathLoading(true);
    try {
      if (!lifePathInterpretation) { // Avoid re-fetching
        const interpretation = await generateLifePathInterpretation(blueprint.lifePathNumber, blueprint.fullName);
        setLifePathInterpretation(interpretation);
      }
    } catch (error) {
        console.error("Failed to get Life Path interpretation", error);
        setLifePathInterpretation({
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation for your Life Path. Please try again later."
        });
    } finally {
        setIsLifePathLoading(false);
        setIsLifePathModalOpen(true);
    }
  };

  const handleGetExpressionMeaning = async () => {
    if (isExpressionLoading) return;
    setIsExpressionLoading(true);
    try {
      if (!expressionInterpretation) { // Avoid re-fetching
        const interpretation = await generateExpressionInterpretation(blueprint.expressionNumber, blueprint.fullName);
        setExpressionInterpretation(interpretation);
      }
    } catch (error) {
        console.error("Failed to get Expression interpretation", error);
        setExpressionInterpretation({
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation for your Expression number. Please try again later."
        });
    } finally {
        setIsExpressionLoading(false);
        setIsExpressionModalOpen(true);
    }
  };

  const handleGetSoulUrgeMeaning = async () => {
    if (isSoulUrgeLoading) return;
    setIsSoulUrgeLoading(true);
    try {
      if (!soulUrgeInterpretation) { // Avoid re-fetching
        const interpretation = await generateSoulUrgeInterpretation(blueprint.soulUrgeNumber, blueprint.fullName);
        setSoulUrgeInterpretation(interpretation);
      }
    } catch (error) {
        console.error("Failed to get Soul Urge interpretation", error);
        setSoulUrgeInterpretation({
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation for your Soul Urge number. Please try again later."
        });
    } finally {
        setIsSoulUrgeLoading(false);
        setIsSoulUrgeModalOpen(true);
    }
  };

  const handleGetPersonalityMeaning = async () => {
    if (isPersonalityLoading) return;
    setIsPersonalityLoading(true);
    try {
      if (!personalityInterpretation) { // Avoid re-fetching
        const interpretation = await generatePersonalityInterpretation(blueprint.personalityNumber, blueprint.fullName);
        setPersonalityInterpretation(interpretation);
      }
    } catch (error) {
        console.error("Failed to get Personality interpretation", error);
        setPersonalityInterpretation({
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation for your Personality number. Please try again later."
        });
    } finally {
        setIsPersonalityLoading(false);
        setIsPersonalityModalOpen(true);
    }
  };

  const handleGetSunSignMeaning = async () => {
    if (isSunSignLoading) return;
    setIsSunSignLoading(true);
    try {
      if (!sunSignInterpretation) { // Avoid re-fetching
        const interpretation = await generateSunSignInterpretation(blueprint.sunSign, blueprint.fullName);
        setSunSignInterpretation(interpretation);
      }
    } catch (error) {
        console.error("Failed to get Sun Sign interpretation", error);
        setSunSignInterpretation({
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation for your Sun Sign. Please try again later."
        });
    } finally {
        setIsSunSignLoading(false);
        setIsSunSignModalOpen(true);
    }
  };

  const handleGetMoonSignMeaning = async () => {
    if (isMoonSignLoading) return;
    setIsMoonSignLoading(true);
    try {
      if (!moonSignInterpretation) { // Avoid re-fetching
        const interpretation = await generateMoonSignInterpretation(blueprint.moonSign, blueprint.fullName);
        setMoonSignInterpretation(interpretation);
      }
    } catch (error) {
        console.error("Failed to get Moon Sign interpretation", error);
        setMoonSignInterpretation({
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation for your Moon Sign. Please try again later."
        });
    } finally {
        setIsMoonSignLoading(false);
        setIsMoonSignModalOpen(true);
    }
  };

  const handleGetRisingSignMeaning = async () => {
    if (isRisingSignLoading) return;
    setIsRisingSignLoading(true);
    try {
        if (!risingSignInterpretation) {
            const interpretation = await generateRisingSignInterpretation(blueprint.risingSign, blueprint.fullName);
            setRisingSignInterpretation(interpretation);
        }
    } catch (error) {
        console.error("Failed to get Rising Sign interpretation", error);
        setRisingSignInterpretation({
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation for your Rising Sign. Please try again later."
        });
    } finally {
        setIsRisingSignLoading(false);
        setIsRisingSignModalOpen(true);
    }
  };

  const handleGetChineseZodiacMeaning = async () => {
    if (isChineseZodiacLoading) return;
    setIsChineseZodiacLoading(true);
    try {
        if (!chineseZodiacInterpretation) {
            const interpretation = await generateChineseZodiacInterpretation(blueprint.chineseZodiac, blueprint.chineseZodiacElement, blueprint.fullName);
            setChineseZodiacInterpretation(interpretation);
        }
    } catch (error) {
        console.error("Failed to get Chinese Zodiac interpretation", error);
        setChineseZodiacInterpretation({
            summary: "Interpretation unavailable.",
            fullInterpretation: "Sorry, the cosmic energies are a bit fuzzy right now. We couldn't get an interpretation for your Chinese Zodiac. Please try again later."
        });
    } finally {
        setIsChineseZodiacLoading(false);
        setIsChineseZodiacModalOpen(true);
    }
  };

  const tabBaseStyle = "flex-1 text-center font-semibold p-3 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 rounded-t-lg";
  const activeTabStyle = "text-purple-300 bg-gray-900/50 border-b-2 border-purple-400";
  const inactiveTabStyle = "text-gray-400 hover:text-white hover:bg-gray-800/50";


  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Your Cosmic Dashboard
          </h1>
          <p className="mt-2 text-indigo-200">Your unique guide to the universe's whispers.</p>
        </header>

        {!isPaidPlan && (
          <div className="text-center mb-12">
            <button onClick={onUpgrade} className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg text-lg hover:shadow-yellow-400/30">
              Upgrade to Pro
            </button>
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Your Birth Blueprint</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <BlueprintCard icon={isLifePathLoading ? <LoadingSpinner className="w-8 h-8"/> : <LifePathIcon />} title="Life Path" value={blueprint.lifePathNumber} subtitle="From Birth Date" onClick={handleGetLifePathMeaning} isClickable={true} />
            <BlueprintCard icon={isExpressionLoading ? <LoadingSpinner className="w-8 h-8"/> : <NameNumerologyIcon />} title="Expression" value={blueprint.expressionNumber} subtitle="From Name" onClick={handleGetExpressionMeaning} isClickable={true} />
            <BlueprintCard icon={isSoulUrgeLoading ? <LoadingSpinner className="w-8 h-8"/> : <NameNumerologyIcon />} title="Soul Urge" value={blueprint.soulUrgeNumber} subtitle="Your Desire" onClick={handleGetSoulUrgeMeaning} isClickable={true} />
            <BlueprintCard icon={isPersonalityLoading ? <LoadingSpinner className="w-8 h-8"/> : <NameNumerologyIcon />} title="Personality" value={blueprint.personalityNumber} subtitle="Outer Self" onClick={handleGetPersonalityMeaning} isClickable={true} />
            <BlueprintCard icon={isSunSignLoading ? <LoadingSpinner className="w-8 h-8"/> : <SunIcon />} title="Sun Sign" value={blueprint.sunSign} subtitle="Your Essence" onClick={handleGetSunSignMeaning} isClickable={true} />
            <BlueprintCard icon={isMoonSignLoading ? <LoadingSpinner className="w-8 h-8"/> : <MoonIcon />} title="Moon Sign" value={blueprint.moonSign} subtitle="Your Emotions" onClick={handleGetMoonSignMeaning} isClickable={true} />
            <BlueprintCard icon={isRisingSignLoading ? <LoadingSpinner className="w-8 h-8"/> : <RisingIcon />} title="Rising Sign" value={blueprint.risingSign} subtitle="Your Persona" onClick={handleGetRisingSignMeaning} isClickable={true} />
            <BlueprintCard icon={isChineseZodiacLoading ? <LoadingSpinner className="w-8 h-8"/> : <ZodiacIcon />} title="Chinese Zodiac" value={`${blueprint.chineseZodiac} (${blueprint.chineseZodiacElement})`} subtitle="Your Animal Year" onClick={handleGetChineseZodiacMeaning} isClickable={true} />
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={handleBlueprintMeaningClick}
              disabled={isBlueprintLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-600/30 flex items-center justify-center mx-auto disabled:bg-indigo-800 disabled:cursor-wait"
            >
              {isBlueprintLoading ? <LoadingSpinner /> : "Unlock the Meaning of Your Blueprint"}
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-1">
            <div className="flex border-b border-indigo-800">
                <button onClick={() => setActiveInputTab('sync')} className={`${tabBaseStyle} ${activeInputTab === 'sync' ? activeTabStyle : inactiveTabStyle}`}>Log Synchronicity</button>
                <button onClick={() => setActiveInputTab('dream')} className={`${tabBaseStyle} ${activeInputTab === 'dream' ? activeTabStyle : inactiveTabStyle}`}>Log Dream</button>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-b-2xl border-x border-b border-indigo-500/20">
              {activeInputTab === 'sync' ? (
                <form onSubmit={handleAddLog} className="space-y-4">
                  <textarea
                    value={newLog}
                    onChange={(e) => setNewLog(e.target.value)}
                    placeholder="What did you see or experience? e.g., 'Saw 11:11 on the clock', 'A white feather appeared on my path'"
                    className="w-full h-32 bg-gray-900/50 border border-indigo-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
                    required
                  />
                  <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-purple-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500">
                    {isLoading ? <LoadingSpinner /> : 'Interpret Synchronicity'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddDreamLog} className="space-y-4">
                  <textarea
                    value={newDreamDescription}
                    onChange={(e) => setNewDreamDescription(e.target.value)}
                    placeholder="Describe your dream in as much detail as you can remember. Include feelings, symbols, and characters."
                    className="w-full h-32 bg-gray-900/50 border border-indigo-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
                    required
                  />
                  <button type="submit" disabled={isDreamLoading} className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
                    {isDreamLoading ? <LoadingSpinner /> : 'Interpret Dream'}
                  </button>
                </form>
              )}
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="flex border-b border-indigo-800">
                <button onClick={() => setActiveJournalTab('sync')} className={`${tabBaseStyle} ${activeJournalTab === 'sync' ? activeTabStyle : inactiveTabStyle}`}>Synchronicity Journal</button>
                <button onClick={() => setActiveJournalTab('dream')} className={`${tabBaseStyle} ${activeJournalTab === 'dream' ? activeTabStyle : inactiveTabStyle}`}>Dream Journal</button>
            </div>
            <div className="space-y-4 pt-6">
              {activeJournalTab === 'sync' ? (
                logs.length === 0 ? (
                  <div className="text-center text-gray-400 bg-gray-900/50 p-8 rounded-2xl border border-dashed border-gray-700 flex flex-col items-center">
                    <SparklesIcon />
                    <p className="mt-2">Your synchronicity journal is empty.</p>
                  </div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="bg-gray-800/60 p-5 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer" onClick={() => setSelectedLog(log)}>
                      <div className="flex justify-between items-start">
                        <p className="text-lg text-white font-semibold flex-1 pr-4">{log.description}</p>
                        <span className="text-sm text-gray-400 flex-shrink-0">{log.date}</span>
                      </div>
                      {log.interpretation && (
                          <div className="mt-4 bg-gray-700/50 p-3 rounded-md border-l-4 border-indigo-500">
                            <p className="text-sm text-indigo-300 font-semibold">Quick Insight:</p>
                            <p className="text-sm text-gray-300 italic">"{log.interpretation.summary}"</p>
                          </div>
                      )}
                       <p className="text-sm text-purple-300 mt-3 text-right font-semibold">Click to view full interpretation &rarr;</p>
                    </div>
                  ))
                )
              ) : (
                dreamLogs.length === 0 ? (
                  <div className="text-center text-gray-400 bg-gray-900/50 p-8 rounded-2xl border border-dashed border-gray-700 flex flex-col items-center">
                    <MoonIcon />
                    <p className="mt-2">Your dream journal is empty.</p>
                  </div>
                ) : (
                  dreamLogs.map(log => (
                    <div key={log.id} className="bg-gray-800/60 p-5 rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors cursor-pointer" onClick={() => setSelectedDreamLog(log)}>
                      <div className="flex justify-between items-start">
                        <p className="text-lg text-white font-semibold flex-1 pr-4">{log.description}</p>
                        <span className="text-sm text-gray-400 flex-shrink-0">{log.date}</span>
                      </div>
                      {log.interpretation && (
                          <div className="mt-4 bg-gray-700/50 p-3 rounded-md border-l-4 border-purple-500">
                            <p className="text-sm text-purple-300 font-semibold">Quick Insight:</p>
                            <p className="text-sm text-gray-300 italic">"{log.interpretation.summary}"</p>
                          </div>
                      )}
                       <p className="text-sm text-indigo-300 mt-3 text-right font-semibold">Click to view full interpretation &rarr;</p>
                    </div>
                  ))
                )
              )}
            </div>
          </section>
        </div>
      </div>
      {selectedLog && selectedLog.interpretation && (
          <InterpretationModal log={selectedLog} onClose={() => setSelectedLog(null)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
      {selectedDreamLog && selectedDreamLog.interpretation && (
          <InterpretationModal log={selectedDreamLog} onClose={() => setSelectedDreamLog(null)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
       {isBlueprintModalOpen && blueprintInterpretation && (
          <BlueprintInterpretationModal title="Your Blueprint's Meaning" interpretation={blueprintInterpretation} onClose={() => setIsBlueprintModalOpen(false)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
      {isLifePathModalOpen && lifePathInterpretation && (
          <BlueprintInterpretationModal title={`The Meaning of Life Path ${blueprint.lifePathNumber}`} interpretation={lifePathInterpretation} onClose={() => setIsLifePathModalOpen(false)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
      {isExpressionModalOpen && expressionInterpretation && (
          <BlueprintInterpretationModal title={`The Meaning of Expression ${blueprint.expressionNumber}`} interpretation={expressionInterpretation} onClose={() => setIsExpressionModalOpen(false)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
       {isSoulUrgeModalOpen && soulUrgeInterpretation && (
          <BlueprintInterpretationModal title={`The Meaning of Soul Urge ${blueprint.soulUrgeNumber}`} interpretation={soulUrgeInterpretation} onClose={() => setIsSoulUrgeModalOpen(false)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
      {isPersonalityModalOpen && personalityInterpretation && (
          <BlueprintInterpretationModal title={`The Meaning of Personality ${blueprint.personalityNumber}`} interpretation={personalityInterpretation} onClose={() => setIsPersonalityModalOpen(false)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
      {isSunSignModalOpen && sunSignInterpretation && (
          <BlueprintInterpretationModal title={`The Meaning of Sun Sign ${blueprint.sunSign}`} interpretation={sunSignInterpretation} onClose={() => setIsSunSignModalOpen(false)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
      {isMoonSignModalOpen && moonSignInterpretation && (
          <BlueprintInterpretationModal title={`The Meaning of Moon Sign ${blueprint.moonSign}`} interpretation={moonSignInterpretation} onClose={() => setIsMoonSignModalOpen(false)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
      {isRisingSignModalOpen && risingSignInterpretation && (
          <BlueprintInterpretationModal title={`The Meaning of Rising Sign ${blueprint.risingSign}`} interpretation={risingSignInterpretation} onClose={() => setIsRisingSignModalOpen(false)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
      {isChineseZodiacModalOpen && chineseZodiacInterpretation && (
          <BlueprintInterpretationModal title={`The Meaning of ${blueprint.chineseZodiacElement} ${blueprint.chineseZodiac}`} interpretation={chineseZodiacInterpretation} onClose={() => setIsChineseZodiacModalOpen(false)} isPaidPlan={isPaidPlan} onUpgrade={onUpgrade} />
      )}
      {isUpgradeModalOpen && (
        <UpgradePromptModal
            onClose={() => setIsUpgradeModalOpen(false)}
            onUpgrade={onUpgrade}
            featureName="Your Full Blueprint Interpretation"
            description="Gain a holistic understanding of how your numerology, astrology, and Chinese zodiac signs work together to form your unique cosmic identity. This is a Pro feature."
        />
      )}
    </div>
  );
};
