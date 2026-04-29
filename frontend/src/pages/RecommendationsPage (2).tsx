import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Wind, 
  BookOpen, 
  Users, 
  Phone, 
  Calendar,
  CheckCircle,
  RefreshCw,
  Quote,
  Lightbulb,
  Target
} from 'lucide-react';

const RecommendationsPage = () => {
  const strategies = [
    {
      icon: Wind,
      title: 'Breathing Exercises',
      description: '4-7-8 breathing technique to reduce anxiety in social situations',
      duration: '5-10 minutes',
      difficulty: 'Beginner',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Cognitive Restructuring',
      description: 'Challenge negative thoughts with evidence-based questioning',
      duration: '10-15 minutes',
      difficulty: 'Intermediate',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Users,
      title: 'Gradual Exposure',
      description: 'Start with small social interactions and gradually increase',
      duration: 'Daily practice',
      difficulty: 'Intermediate',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Target,
      title: 'Mindfulness Meditation',
      description: 'Present-moment awareness to reduce anticipatory anxiety',
      duration: '10-20 minutes',
      difficulty: 'Beginner',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const resources = [
    {
      icon: Phone,
      title: 'Crisis Support',
      description: '24/7 mental health hotline',
      action: 'Call 988',
      urgent: true
    },
    {
      icon: Calendar,
      title: 'Professional Help',
      description: 'Find qualified therapists in your area',
      action: 'Find Therapists',
      urgent: false
    },
    {
      icon: Users,
      title: 'Support Groups',
      description: 'Connect with others facing similar challenges',
      action: 'Join Groups',
      urgent: false
    }
  ];

  const quotes = [
    "You are braver than you believe, stronger than you seem, and smarter than you think.",
    "Every small step forward is progress. Celebrate your courage today.",
    "Your anxiety doesn't define you. Your response to it does."
  ];

  const currentQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Personalized Recommendations</h1>
        <p className="text-lg text-gray-600">
          Evidence-based strategies tailored to your analysis results
        </p>
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Coping Strategies */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Recommended Coping Strategies</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {strategies.map((strategy, index) => {
              const Icon = strategy.icon;
              return (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${strategy.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{strategy.title}</h3>
                      <p className="text-sm text-gray-600">{strategy.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Duration: {strategy.duration}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full">{strategy.difficulty}</span>
                  </div>
                  
                  <button className="w-full py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-purple-200 transition-all duration-300 font-medium">
                    Start Exercise
                  </button>
                </div>
              );
            })}
          </div>

          {/* Detailed Exercise Example */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Featured Exercise: 4-7-8 Breathing</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">How to Practice:</h4>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Exhale completely through your mouth</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Close mouth, inhale through nose for 4 counts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Hold your breath for 7 counts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <span>Exhale through mouth for 8 counts</span>
                  </li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Reduces anxiety within minutes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Activates parasympathetic nervous system</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Can be done anywhere, anytime</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Improves focus and clarity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Support Resources */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Support Resources</h3>
            
            <div className="space-y-4">
              {resources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <div key={index} className={`p-4 rounded-2xl border ${resource.urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 mt-1 ${resource.urgent ? 'text-red-600' : 'text-blue-600'}`} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        <button className={`text-sm font-medium px-3 py-1 rounded-lg ${
                          resource.urgent 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        } transition-colors duration-300`}>
                          {resource.action}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Track Your Progress</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                <span className="text-sm text-green-800">Daily mood check-in</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-600">Breathing exercise</span>
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-sm text-gray-600">Social interaction</span>
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
              </div>
            </div>
            
            <button className="w-full mt-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors duration-300 font-medium">
              View Full Progress
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
        <Link
          to="/input"
          className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Try Another Analysis</span>
        </Link>
        
        <button className="inline-flex items-center justify-center space-x-3 bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-300 hover:text-blue-700 transition-all duration-300">
          <BookOpen className="w-5 h-5" />
          <span>Download Report</span>
        </button>
      </div>
    </div>
  );
};

export default RecommendationsPage;