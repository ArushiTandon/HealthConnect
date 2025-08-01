import React, { useState } from "react";
import { aiApi } from "../../services/adminApi";

const ChatBotModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const askBot = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    const currentQuestion = question;
    
    // Add user question to conversation
    setConversationHistory(prev => [...prev, { type: 'user', message: currentQuestion }]);
    setQuestion(""); // Clear input immediately

    try {
      const data = await aiApi.askBot(currentQuestion);
      const botResponse = data.answer || "Bot did not return a response.";
      
      // Add bot response to conversation
      setConversationHistory(prev => [...prev, { type: 'bot', message: botResponse }]);
      setResponse(botResponse);
    } catch (err) {
      const errorMessage = "Error: Failed to reach the AI bot.";
      setConversationHistory(prev => [...prev, { type: 'bot', message: errorMessage }]);
      setResponse(errorMessage);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askBot();
    }
  };

  const clearChat = () => {
    setConversationHistory([]);
    setResponse("");
    setQuestion("");
  };

  const handleClose = () => {
    onClose();
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-in fade-in duration-300">
          
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl p-6 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Hospital AI Assistant</h2>
                  <p className="text-blue-100 text-sm">Get instant answers about hospital services and facilities</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {conversationHistory.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    Clear Chat
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Chat Container - Scrollable */}
          <div className="bg-gray-50 flex-1 overflow-hidden">
            {/* Conversation History */}
            {conversationHistory.length > 0 ? (
              <div className="p-4 space-y-4 h-full overflow-y-auto">
                {conversationHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        item.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-8">
                <div className="max-w-md">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Hospital AI Assistant</h3>
                  <p className="text-gray-600 mb-4">Ask me anything about hospital services, departments, facilities, or general medical information.</p>
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <p className="text-sm text-gray-700 font-medium mb-2">Try asking:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• "Which hospitals have ICU facilities?"</li>
                      <li>• "What are the visiting hours?"</li>
                      <li>• "How do I book an appointment?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="bg-white border-t border-gray-200 rounded-b-2xl p-4 shadow-sm flex-shrink-0">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about hospital services, departments, or facilities..."
                    rows={2}
                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-gray-800 placeholder-gray-500"
                    disabled={loading}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    Enter to send
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <button
                  onClick={askBot}
                  disabled={loading || !question.trim()}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    loading || !question.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Asking...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Ask</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
            
            {/* Quick Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 font-medium">Quick questions:</span>
              {[
                "Hospital departments",
                "Emergency services",
                "Appointment booking",
                "Visiting hours"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(suggestion)}
                  className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                  disabled={loading}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                💡 This AI assistant provides general information. For medical emergencies, please contact emergency services immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Trigger Button Component (optional - you can use this to open the modal)
const ChatBotTrigger = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-30 group"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <div className="absolute -top-12 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Ask AI Assistant
      </div>
    </button>
  );
};

// Main Component that manages modal state
const ChatBot = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ChatBotTrigger onClick={() => setIsModalOpen(true)} />
      <ChatBotModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ChatBot;