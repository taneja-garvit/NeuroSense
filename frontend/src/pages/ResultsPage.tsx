import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  Zap,
  TrendingUp,
  Brain,
  MessageSquare,
  ArrowRight,
  Activity
} from 'lucide-react';

const ResultsPage = () => {
  const [assessment, setAssessment] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get assessment from sessionStorage
    const storedAssessment = sessionStorage.getItem('currentAssessment');
    if (storedAssessment) {
      setAssessment(JSON.parse(storedAssessment));
    } else {
      // If no assessment found, redirect to input page
      navigate('/input');
    }
  }, [navigate]);

  if (!assessment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading results...</p>
      </div>
    );
  }

  const { riskScore, riskLevel, insights, sentimentAnalysis } = assessment;

  const getRiskConfig = (level: string) => {
    if (level === 'High') return { color: 'text-red-600', bgColor: 'bg-red-100', icon: AlertTriangle };
    if (level === 'Medium') return { color: 'text-orange-600', bgColor: 'bg-orange-100', icon: TrendingUp };
    return { color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle };
  };

  const risk = getRiskConfig(riskLevel);
  const RiskIcon = risk.icon;

  const sentimentData = [
    { type: 'Negative', percentage: sentimentAnalysis.negative, color: 'bg-red-500' },
    { type: 'Neutral', percentage: sentimentAnalysis.neutral, color: 'bg-gray-400' },
    { type: 'Positive', percentage: sentimentAnalysis.positive, color: 'bg-green-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Analysis Results</h1>
        <p className="text-lg text-gray-600">
          Comprehensive assessment based on your responses
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Risk Score Section */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Risk Assessment</h2>

            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={riskLevel === 'High' ? '#dc2626' : riskLevel === 'Medium' ? '#ea580c' : '#16a34a'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2.51 * riskScore} 251.2`}
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{riskScore}</div>
                    <div className="text-xs text-gray-500">out of 100</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-center space-x-2 px-4 py-3 ${risk.bgColor} rounded-2xl`}>
              <RiskIcon className={`w-5 h-5 ${risk.color}`} />
              <span className={`font-semibold ${risk.color}`}>{riskLevel} Risk</span>
            </div>
          </div>
        </div>

        {/* Main Results */}
        <div className="lg:col-span-2">
          {/* Sentiment Analysis */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Sentiment Analysis</h3>

            <div className="grid grid-cols-3 gap-6 mb-6">
              {sentimentData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl ${item.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{item.percentage}%</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{item.type}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-100 rounded-2xl p-1">
              <div className="flex h-4 rounded-xl overflow-hidden">
                {sentimentData.map((item, index) => (
                  <div
                    key={index}
                    className={`${item.color} transition-all duration-1000 ease-in-out`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">AI Insights</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {insights.map((insight: any, index: number) => (
                <div key={index} className="bg-white/50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Impact:</span>
                        <span className={`text-xs font-medium ${insight.impact === 'High' ? 'text-red-600' :
                            insight.impact === 'Medium' ? 'text-orange-600' : 'text-green-600'
                          }`}>
                          {insight.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center mt-12">
        <Link
          to="/recommendations"
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span>View Personalized Recommendations</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;