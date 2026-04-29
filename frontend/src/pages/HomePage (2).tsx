import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Shield, Zap, Heart, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced neural networks analyze multiple data points for comprehensive assessment'
    },
    {
      icon: Shield,
      title: 'Early Detection',
      description: 'Identify potential social anxiety patterns before they become severe'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Get instant results from text, audio, and visual analysis'
    },
    {
      icon: Heart,
      title: 'Personalized Care',
      description: 'Receive tailored recommendations and coping strategies'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-2 mb-8">
          <Brain className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Powered by Advanced AI</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            NeuroSense
          </span>
        </h1>
        
        <p className="text-xl text-blue-600 font-medium mb-8">
          AI-Powered Early Detection of Social Anxiety Disorder
        </p>
        
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Our intelligent framework combines natural language processing, voice analysis, and facial emotion recognition 
          to provide comprehensive risk assessment and early detection of social anxiety patterns. Get personalized insights 
          and evidence-based recommendations to support mental wellness.
        </p>
        
        <Link
          to="/input"
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span>Start Analysis</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* How It Works */}
      <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-12 border border-blue-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How NeuroSense Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Modal Input</h3>
            <p className="text-gray-600">
              Upload text, audio recordings, or images for comprehensive analysis across multiple data streams.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Our neural networks process sentiment, vocal patterns, and facial expressions to assess anxiety indicators.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Results</h3>
            <p className="text-gray-600">
              Receive detailed risk assessment, insights, and tailored recommendations for mental wellness support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;