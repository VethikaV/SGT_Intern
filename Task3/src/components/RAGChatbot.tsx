import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Search, FileText, Clock } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  documentRef?: string;
}

const RAGChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI assistant specialized in historical document analysis. I can help you query information from processed documents using document numbers or keywords. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mockDocuments = [
    { id: 'DOC-1892-001', title: 'Tamil Land Registry 1892', type: 'Land Record' },
    { id: 'DOC-1889-045', title: 'English Property Deed', type: 'Property Deed' },
    { id: 'DOC-1895-123', title: 'Family Genealogy Record', type: 'Family Record' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('doc-1892-001') || input.includes('tamil')) {
      return 'Based on document DOC-1892-001 (Tamil Land Registry 1892), this record contains information about land ownership in the Thanjavur district. The document mentions boundary descriptions, witness signatures, and legal proceedings. The original text in Tamil discusses property rights transferred between families, with official government seals validating the transaction.';
    } else if (input.includes('doc-1889-045') || input.includes('property deed')) {
      return 'Document DOC-1889-045 is an English Property Deed from 1889. This document outlines the transfer of a 25-acre plot of agricultural land. Key details include the seller\'s family name, buyer information, monetary consideration, and property boundaries marked by natural landmarks like wells and trees.';
    } else if (input.includes('doc-1895-123') || input.includes('family') || input.includes('genealogy')) {
      return 'The Family Genealogy Record (DOC-1895-123) traces three generations of a family lineage. It includes birth dates, marriage records, and inheritance details. This handwritten document is particularly valuable for understanding family structures and property inheritance patterns in late 19th century South India.';
    } else if (input.includes('search') || input.includes('find')) {
      return 'I can search through processed documents using various criteria:\n\n• Document numbers (e.g., DOC-1892-001)\n• Keywords (land, property, family)\n• Date ranges (1880-1900)\n• Document types (deeds, registries, records)\n\nWhat specific information are you looking for?';
    } else {
      return 'I understand you\'re looking for information from historical documents. I can help you with:\n\n• Querying specific document numbers\n• Searching by keywords or themes\n• Finding related documents\n• Extracting specific information\n\nCould you provide a document number or describe what you\'re looking for?';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateResponse(inputValue),
        timestamp: new Date(),
        documentRef: inputValue.toLowerCase().includes('doc-') ? inputValue.match(/doc-\d+-\d+/i)?.[0] : undefined
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">RAG-Powered Document Assistant</h2>
              <p className="text-indigo-100 text-sm">Query historical documents with context-aware AI</p>
            </div>
          </div>
        </div>

        {/* Document References */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Available Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mockDocuments.map((doc) => (
              <div key={doc.id} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer">
                <div className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-indigo-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-mono text-indigo-600">{doc.id}</div>
                    <div className="text-sm font-medium text-gray-800">{doc.title}</div>
                    <div className="text-xs text-gray-500">{doc.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                
                <div className={`p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  
                  {message.documentRef && (
                    <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-200">
                      <Search className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500 font-mono">Referenced: {message.documentRef}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 mt-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-gray-100">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about documents, search by number (e.g., DOC-1892-001), or query specific information..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGChatbot;