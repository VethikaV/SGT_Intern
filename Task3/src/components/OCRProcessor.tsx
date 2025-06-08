import React, { useState, useEffect } from 'react';
import { Eye, Globe, FileText, CheckCircle, Loader2, Languages } from 'lucide-react';

interface OCRResult {
  extractedText: string;
  detectedLanguage: string;
  confidence: number;
  processingTime: number;
}

interface OCRProcessorProps {
  file: File;
  onProcessingComplete: (result: OCRResult) => void;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({ file, onProcessingComplete }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<OCRResult | null>(null);

  const processingSteps = [
    { title: 'Preprocessing Document', icon: Eye, desc: 'Enhancing image quality and removing noise' },
    { title: 'Script Detection', icon: Languages, desc: 'Identifying language script (Tamil, English, etc.)' },
    { title: 'OCR Analysis', icon: FileText, desc: 'Extracting handwritten text using deep learning' },
    { title: 'Post-processing', icon: CheckCircle, desc: 'Cleaning and validating extracted content' }
  ];

  useEffect(() => {
    const processDocument = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate OCR processing result
      const mockResult: OCRResult = {
        extractedText: file.name.includes('tamil') 
          ? 'இந்த ஆவணம் தமிழ் மொழியில் எழுதப்பட்டுள்ளது. வரலாற்று முக்கியத்துவம் வாய்ந்த இந்த பதிவு 1892 ஆம் ஆண்டைச் சேர்ந்தது. குடும்ப வம்சாவளி மற்றும் நில உரிமை பற்றிய விவரங்கள் இங்கே காணப்படுகின்றன.'
          : 'This historical document contains valuable information about land ownership records from the late 19th century. The handwritten text mentions property boundaries, family lineage, and legal proceedings dated around 1892. Several signatures and official seals are visible throughout the document.',
        detectedLanguage: file.name.includes('tamil') ? 'Tamil' : 'English',
        confidence: 0.94,
        processingTime: 6.2
      };

      setResult(mockResult);
      setIsProcessing(false);
      onProcessingComplete(mockResult);
    };

    processDocument();
  }, [file, onProcessingComplete]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered OCR Processing</h2>
          <p className="text-gray-600">Analyzing your document using advanced deep learning models</p>
        </div>

        <div className="space-y-6">
          {processingSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index && isProcessing;
            const isCompleted = currentStep > index || !isProcessing;
            
            return (
              <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 border border-blue-200' : 
                isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}>
                <div className={`p-3 rounded-full ${
                  isActive ? 'bg-blue-100' : 
                  isCompleted ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isActive ? (
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  ) : (
                    <Icon className={`w-6 h-6 ${
                      isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`} />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    isActive ? 'text-blue-800' : 
                    isCompleted ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.desc}
                  </p>
                </div>

                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            );
          })}
        </div>

        {result && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Processing Complete!</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Language:</span>
                <div className="font-semibold text-green-700">{result.detectedLanguage}</div>
              </div>
              <div>
                <span className="text-gray-600">Confidence:</span>
                <div className="font-semibold text-green-700">{(result.confidence * 100).toFixed(1)}%</div>
              </div>
              <div>
                <span className="text-gray-600">Processing Time:</span>
                <div className="font-semibold text-green-700">{result.processingTime}s</div>
              </div>
              <div>
                <span className="text-gray-600">Characters:</span>
                <div className="font-semibold text-green-700">{result.extractedText.length}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRProcessor;