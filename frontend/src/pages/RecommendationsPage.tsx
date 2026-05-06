import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Wind,
  BookOpen,
  Users,
  CheckCircle,
  RefreshCw,
  Quote,
  Lightbulb,
  Target,
  Moon,
  Apple,
  Activity,
  AlertCircle,
  Phone
} from 'lucide-react';
import { recommendationsAPI } from '../services/api';

interface Recommendation {
  _id: string;
  title: string;
  description: string;
  type: 'yoga' | 'meditation' | 'lifestyle' | 'remedy';
  category: string;
  difficulty: string;
  duration: string;
  riskLevels: string[];
  icon: string;
  color: string;
  steps?: string[];
  benefits?: string[];
}

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [source, setSource] = useState<'ai' | 'fallback' | null>(null);
  const [error, setError] = useState('');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const quotes = [
    "You are braver than you believe, stronger than you seem, and smarter than you think.",
    "Every small step forward is progress. Celebrate your courage today.",
    "Your anxiety doesn't define you. Your response to it does.",
    "Healing is not linear. Be patient with yourself.",
    "You have survived 100% of your worst days. You're doing great."
  ];

  const currentQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const storedAssessment = sessionStorage.getItem('currentAssessment');
      let userRiskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
      let assessmentId: string | null = null;

      if (storedAssessment) {
        const assessment = JSON.parse(storedAssessment);
        userRiskLevel = assessment.riskLevel;
        assessmentId = assessment._id;
        setRiskLevel(userRiskLevel);
      }

      // Prefer AI-generated personalized recommendations
      if (assessmentId) {
        try {
          const aiResponse = await recommendationsAPI.getAI(assessmentId);
          if (aiResponse.success) {
            setRecommendations(aiResponse.data);
            setSource(aiResponse.source === 'ai' ? 'ai' : 'fallback');
            return;
          }
        } catch (aiErr: any) {
          console.warn('AI recommendations failed, falling back:', aiErr?.message);
        }
      }

      // Fallback: risk-level filtered DB recommendations
      const response = await recommendationsAPI.getByRiskLevel(userRiskLevel);
      if (response.success) {
        setRecommendations(response.data);
        setSource('fallback');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load recommendations');
      try {
        const response = await recommendationsAPI.getAll();
        if (response.success) {
          setRecommendations(response.data);
          setSource('fallback');
        }
      } catch (fallbackErr) {
        console.error('Failed to load recommendations:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const storedAssessment = sessionStorage.getItem('currentAssessment');
    if (!storedAssessment) return;
    const assessment = JSON.parse(storedAssessment);
    if (!assessment._id) return;

    setRegenerating(true);
    setError('');
    try {
      const aiResponse = await recommendationsAPI.getAI(assessment._id);
      if (aiResponse.success) {
        setRecommendations(aiResponse.data);
        setSource(aiResponse.source === 'ai' ? 'ai' : 'fallback');
        setExpandedCards(new Set());
      }
    } catch (err: any) {
      setError(err.message || 'Failed to regenerate recommendations');
    } finally {
      setRegenerating(false);
    }
  };

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Wind, BookOpen, Users, Target, Heart, Moon, Apple, Activity, AlertCircle, Phone, Lightbulb
    };
    return icons[iconName] || Heart;
  };

  const groupedRecommendations = {
    yoga: recommendations.filter(r => r.type === 'yoga'),
    meditation: recommendations.filter(r => r.type === 'meditation'),
    lifestyle: recommendations.filter(r => r.type === 'lifestyle'),
    remedy: recommendations.filter(r => r.type === 'remedy')
  };

  const renderRecommendationCard = (rec: Recommendation) => {
    const Icon = getIconComponent(rec.icon);
    const isExpanded = expandedCards.has(rec._id);

    return (
      <div
        key={rec._id}
        className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex items-start space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${rec.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{rec.title}</h3>
            <p className="text-sm text-gray-600">{rec.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>{rec.duration}</span>
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded-full">{rec.difficulty}</span>
        </div>

        {rec.steps && rec.steps.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => toggleCard(rec._id)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>{isExpanded ? 'Hide' : 'Show'} Steps</span>
              <CheckCircle className="w-4 h-4" />
            </button>
            {isExpanded && (
              <ol className="mt-3 space-y-2 text-xs text-gray-600">
                {rec.steps.map((step: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-semibold flex-shrink-0">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {rec.benefits && rec.benefits.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Benefits:</h4>
            <ul className="space-y-1">
              {rec.benefits.slice(0, isExpanded ? rec.benefits.length : 2).map((benefit: string, i: number) => (
                <li key={i} className="flex items-center space-x-2 text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your personalized recommendations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 flex-wrap justify-center">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
              riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
            }`}>
            {riskLevel} Risk Level
          </span>
          {source === 'ai' && (
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 inline-flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              AI personalized
            </span>
          )}
          {source === 'fallback' && (
            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
              Curated set
            </span>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Personalized Wellness Plan</h1>
        <p className="text-lg text-gray-600 mb-6">
          {source === 'ai'
            ? 'These suggestions were generated specifically from your conversation.'
            : 'Evidence-based strategies tailored to your assessment results'}
        </p>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
          <span>{regenerating ? 'Regenerating...' : 'Regenerate with AI'}</span>
        </button>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 mb-12 text-center">
        <Quote className="w-10 h-10 text-white/80 mx-auto mb-4" />
        <blockquote className="text-xl md:text-2xl font-medium text-white mb-4 leading-relaxed">
          "{currentQuote}"
        </blockquote>
        <div className="flex items-center justify-center space-x-2 text-white/80">
          <Heart className="w-5 h-5" />
          <span className="text-sm">You've got this!</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700">
          {error}
        </div>
      )}

      {/* Yoga Asanas Section */}
      {groupedRecommendations.yoga.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Yoga Asanas</h2>
          </div>
          <p className="text-gray-600 mb-6">Gentle yoga poses to calm your mind and release physical tension</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedRecommendations.yoga.map(renderRecommendationCard)}
          </div>
        </div>
      )}

      {/* Meditation Practices Section */}
      {groupedRecommendations.meditation.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Meditation Practices</h2>
          </div>
          <p className="text-gray-600 mb-6">Mindfulness techniques to reduce anxiety and increase mental clarity</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedRecommendations.meditation.map(renderRecommendationCard)}
          </div>
        </div>
      )}

      {/* Lifestyle Habits Section */}
      {groupedRecommendations.lifestyle.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Lifestyle Habits</h2>
          </div>
          <p className="text-gray-600 mb-6">
            {riskLevel === 'Low' && 'Basic wellness habits to maintain mental health'}
            {riskLevel === 'Medium' && 'Enhanced lifestyle practices to support anxiety management'}
            {riskLevel === 'High' && 'Comprehensive lifestyle changes for optimal mental health recovery'}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedRecommendations.lifestyle.map(renderRecommendationCard)}
          </div>
        </div>
      )}

      {/* Remedies Section - Only for Medium and High Risk */}
      {(riskLevel === 'Medium' || riskLevel === 'High') && groupedRecommendations.remedy.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${riskLevel === 'High'
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
              }`}>
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {riskLevel === 'High' ? 'Professional Support & Remedies' : 'Therapeutic Remedies'}
            </h2>
          </div>

          {riskLevel === 'High' && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Important: Seek Professional Help</h3>
                  <p className="text-sm text-red-800">
                    Your assessment indicates significant anxiety symptoms. Please consider consulting with a mental health professional.
                    The recommendations below can complement professional treatment but should not replace it.
                  </p>
                </div>
              </div>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            {riskLevel === 'Medium' && 'Evidence-based therapeutic techniques to manage anxiety symptoms'}
            {riskLevel === 'High' && 'Professional interventions and comprehensive treatment options'}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedRecommendations.remedy.map(renderRecommendationCard)}
          </div>
        </div>
      )}

      {/* No Remedies Message for Low Risk */}
      {riskLevel === 'Low' && (
        <div className="mb-12 p-6 bg-green-50 border border-green-200 rounded-3xl">
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">Great News!</h3>
              <p className="text-green-800">
                Your assessment shows low anxiety levels. Continue with the yoga and meditation practices above
                to maintain your mental wellness. No additional remedies are needed at this time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <Link
          to="/input"
          className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Take Another Assessment</span>
        </Link>
      </div>
    </div>
  );
};

export default RecommendationsPage;