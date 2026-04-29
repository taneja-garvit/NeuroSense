import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import { MessageSquare, ArrowRight, AlertCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  description: string;
  scale: {
    min: number;
    max: number;
    labels: { [key: number]: string };
  };
}

const InputPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await assessmentAPI.getQuestions();
      if (response.success) {
        setQuestions(response.data);
        // Initialize answers
        const initialAnswers: { [key: string]: number } = {};
        response.data.forEach((q: Question) => {
          initialAnswers[q.id] = 3; // Default to middle value
        });
        setAnswers(initialAnswers);
      }
    } catch (err: any) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const response = await assessmentAPI.submitAssessment(answers, textInput);
      if (response.success) {
        // Store the assessment result in sessionStorage for the results page
        sessionStorage.setItem('currentAssessment', JSON.stringify(response.data));
        navigate('/results');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading questionnaire...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Social Anxiety Assessment</h1>
        <p className="text-lg text-gray-600">
          Please answer the following questions honestly. Your responses will help us assess your anxiety levels.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Questionnaire */}
      <div className="space-y-8 mb-8">
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100">
            <div className="mb-6">
              <div className="flex items-start space-x-3 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-sm">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {question.question}
                  </h3>
                  <p className="text-sm text-gray-600">{question.description}</p>
                </div>
              </div>
            </div>

            {/* Scale */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswerChange(question.id, value)}
                    className={`flex-1 mx-1 py-3 px-2 rounded-xl font-medium transition-all duration-300 ${answers[question.id] === value
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-2">
                <span>{question.scale.labels[1]}</span>
                <span>{question.scale.labels[5]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Optional Text Input */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-100 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Additional Comments (Optional)</h3>
        </div>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Share any additional thoughts or describe a recent situation that made you feel anxious..."
          className="w-full h-32 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
          maxLength={1000}
        />
        <div className="mt-2 text-sm text-gray-500 text-right">
          {textInput.length}/1000 characters
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Submit Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Your responses are confidential and will be used to generate personalized recommendations
        </p>
      </div>
    </div>
  );
};

export default InputPage;