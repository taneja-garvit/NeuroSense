import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../services/api';
import { Send, Sparkles, AlertCircle, Bot, User } from 'lucide-react';

type ChatRole = 'ai' | 'user';

interface ChatMessage {
  role: ChatRole;
  content: string;
  format?: 'mcq' | 'text';
  options?: string[];
}

interface AIQuestion {
  id: string;
  text: string;
  format: 'mcq' | 'text';
  options?: string[];
}

const InputPage = () => {
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [progress, setProgress] = useState({ asked: 0, max: 6 });
  const [loading, setLoading] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, aiThinking]);

  const startConversation = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await assessmentAPI.start();
      if (response.success) {
        const { assessmentId: id, question, progress: p } = response.data;
        setAssessmentId(id);
        setCurrentQuestion(question);
        setProgress(p || { asked: 1, max: 6 });
        setMessages([
          {
            role: 'ai',
            content: question.text,
            format: question.format,
            options: question.options,
          },
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start the assessment');
    } finally {
      setLoading(false);
    }
  };

  const sendAnswer = async (answer: string) => {
    if (!assessmentId || !answer.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: answer.trim() }]);
    setCurrentQuestion(null);
    setTextAnswer('');
    setAiThinking(true);
    setError('');

    try {
      const response = await assessmentAPI.answer(assessmentId, answer);
      if (!response.success) {
        throw new Error(response.message || 'Something went wrong');
      }

      const { done, question, progress: p, assessment } = response.data;

      if (done) {
        sessionStorage.setItem('currentAssessment', JSON.stringify(assessment));
        sessionStorage.setItem('currentAssessmentId', String(assessment._id));
        navigate('/results');
        return;
      }

      setCurrentQuestion(question);
      setProgress(p || progress);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: question.text,
          format: question.format,
          options: question.options,
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to send your answer');
    } finally {
      setAiThinking(false);
    }
  };

  const handleOptionClick = (option: string) => {
    sendAnswer(option);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textAnswer.trim()) {
      sendAnswer(textAnswer);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Starting your AI assessment...</p>
      </div>
    );
  }

  const progressPct = Math.min(100, Math.round((progress.asked / progress.max) * 100));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-purple-700">AI-powered chat assessment</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Social Anxiety Screener</h1>
        <p className="text-gray-600">
          Chat with our AI for a few minutes. It will adapt its questions based on what you share.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-600">
            Question {progress.asked} of ~{progress.max}
          </span>
          <span className="text-gray-500">{progressPct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Chat container */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-blue-100 p-6 mb-6 min-h-[420px] max-h-[60vh] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} />
          ))}
          {aiThinking && <TypingIndicator />}
          <div ref={scrollAnchorRef} />
        </div>
      </div>

      {/* Answer input area */}
      {currentQuestion && !aiThinking && (
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-blue-100 p-6">
          {currentQuestion.format === 'mcq' && currentQuestion.options ? (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">Choose the option that fits you best:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    className="text-left px-4 py-3 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 font-medium text-gray-800"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleTextSubmit}>
              <p className="text-sm font-medium text-gray-600 mb-3">Share in your own words:</p>
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full h-28 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                maxLength={1000}
                autoFocus
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">{textAnswer.length}/1000</span>
                <button
                  type="submit"
                  disabled={!textAnswer.trim()}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <p className="text-center text-xs text-gray-500 mt-6">
        This is a screening tool, not a medical diagnosis. Your responses are confidential.
      </p>
    </div>
  );
};

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isAi = message.role === 'ai';
  return (
    <div className={`flex items-start space-x-3 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}>
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAi
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        {isAi ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isAi
            ? 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-start space-x-3">
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <Bot className="w-5 h-5" />
    </div>
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  </div>
);

export default InputPage;
