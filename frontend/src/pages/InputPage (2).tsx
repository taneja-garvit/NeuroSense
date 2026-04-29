import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mic, Camera, Upload, Play, Pause, RotateCcw } from 'lucide-react';

const InputPage = () => {
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const handleRecordingToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording simulation
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsRecording(false);
      }, 10000); // Auto-stop after 10 seconds for demo
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Multi-Modal Analysis Input</h1>
        <p className="text-lg text-gray-600">
          Provide text, audio, or visual data for comprehensive social anxiety assessment
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Text Input Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Text Analysis</h2>
              <p className="text-sm text-gray-500">Sentiment & linguistic patterns</p>
            </div>
          </div>
          
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Share your thoughts, feelings, or describe a recent social situation that made you feel anxious..."
            className="w-full h-40 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
          />
          
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">{textInput.length}/1000 characters</span>
            <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors duration-300">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload File
            </button>
          </div>
        </div>

        {/* Audio Input Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Voice Analysis</h2>
              <p className="text-sm text-gray-500">Tone, pitch & speech patterns</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'border-red-300 bg-red-50 animate-pulse' 
                : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50'
            }`}>
              <button
                onClick={handleRecordingToggle}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                {isRecording ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>
            </div>
            
            {isRecording && (
              <div className="text-lg font-mono text-red-600 mb-4">
                {formatTime(recordingTime)}
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-4">
              {isRecording ? 'Recording in progress...' : 'Click to start recording'}
            </p>
            
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors duration-300">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Audio File
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-300">
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Reset Recording
              </button>
            </div>
          </div>
        </div>

        {/* Visual Input Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Visual Analysis</h2>
              <p className="text-sm text-gray-500">Facial expressions & emotions</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 hover:border-blue-300 transition-colors duration-300">
              {imageFile ? (
                <div className="text-green-600">
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Image uploaded</p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Upload photo or start video</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors duration-300 text-sm">
                <Upload className="w-4 h-4 inline mr-1" />
                Photo
              </button>
              <button className="px-3 py-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors duration-300 text-sm">
                <Camera className="w-4 h-4 inline mr-1" />
                Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Button */}
      <div className="text-center">
        <Link
          to="/results"
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span>Run Analysis</span>
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin opacity-0 group-hover:opacity-100"></div>
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          Analysis typically takes 15-30 seconds to complete
        </p>
      </div>
    </div>
  );
};

export default InputPage;