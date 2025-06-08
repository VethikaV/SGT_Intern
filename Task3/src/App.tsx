import React, { useState } from 'react';
import { FileText, Bot, Globe, Brain, ArrowRight } from 'lucide-react';
import DocumentUpload from './components/DocumentUpload';
import OCRProcessor from './components/OCRProcessor';
import TranslationPanel from './components/TranslationPanel';
import RAGChatbot from './components/RAGChatbot';

interface OCRResult {
  extractedText: string;
  detectedLanguage: string;
  confidence: number;
  processingTime: number;
}

function App() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'results' | 'chat'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ocrResult, setOCRResult] = useState<OCRResult | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = (result: OCRResult) => {
    setOCRResult(result);
    setCurrentStep('results');
  };

  const resetToUpload = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setOCRResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  AI OCR & Translation System
                </h1>
                <p className="text-sm text-gray-600">Advanced handwriting recognition with LLM integration</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentStep('upload')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === 'upload' || currentStep === 'processing' || currentStep === 'results'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>OCR</span>
              </button>
              
              <button
                onClick={() => setCurrentStep('chat')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === 'chat'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>RAG Chat</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        {currentStep === 'upload' && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4" />
              <span>Supporting Tamil, English, Hindi & More</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Historical Documents with AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload handwritten documents in regional scripts like Tamil, extract text with advanced OCR, 
              and get context-aware translations powered by state-of-the-art language models.
            </p>
          </div>
        )}

        {/* Progress Steps */}
        {(currentStep === 'upload' || currentStep === 'processing' || currentStep === 'results') && (
          <div className="flex items-center justify-center space-x-8 mb-12">
            {[
              { key: 'upload', title: 'Upload', icon: FileText, desc: 'Document Upload' },
              { key: 'processing', title: 'Process', icon: Brain, desc: 'AI Analysis' },
              { key: 'results', title: 'Results', icon: Globe, desc: 'Translation' }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.key;
              const isCompleted = ['processing', 'results'].includes(currentStep) && 
                                ['upload'].includes(step.key) ||
                                currentStep === 'results' && step.key === 'processing';
              
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-4 rounded-full transition-all ${
                      isActive ? 'bg-blue-600 text-white shadow-lg scale-110' :
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">{step.desc}</div>
                    </div>
                  </div>
                  
                  {index < 2 && (
                    <ArrowRight className={`w-5 h-5 ${
                      isCompleted ? 'text-green-500' : 'text-gray-300'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Content Based on Current Step */}
        {currentStep === 'upload' && (
          <DocumentUpload onFileUpload={handleFileUpload} />
        )}

        {currentStep === 'processing' && uploadedFile && (
          <OCRProcessor 
            file={uploadedFile} 
            onProcessingComplete={handleProcessingComplete}
          />
        )}

        {currentStep === 'results' && ocrResult && (
          <div className="space-y-8">
            <TranslationPanel
              originalText={ocrResult.extractedText}
              sourceLanguage={ocrResult.detectedLanguage}
            />
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetToUpload}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Process Another Document
              </button>
              <button
                onClick={() => setCurrentStep('chat')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Bot className="w-4 h-4" />
                <span>Query Documents with AI</span>
              </button>
            </div>
          </div>
        )}

        {currentStep === 'chat' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                RAG-Powered Document Assistant
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Query processed documents using natural language. Our AI assistant uses retrieval-augmented 
                generation to provide accurate, context-aware responses from your document database.
              </p>
            </div>
            <RAGChatbot />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-md border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Powered by advanced deep learning models for OCR, language detection, and neural machine translation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;