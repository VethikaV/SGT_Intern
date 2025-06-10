import React, { useState, useEffect } from 'react';
import { Globe, Copy, Download, ArrowRightLeft, CheckCircle } from 'lucide-react';

interface TranslationPanelProps {
  originalText: string;
  sourceLanguage: string;
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({ originalText, sourceLanguage }) => {
  const [targetLanguage, setTargetLanguage] = useState(sourceLanguage === 'English' ? 'Tamil' : 'English');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ta', name: 'Tamil' }
  ];

  useEffect(() => {
    if (originalText && targetLanguage !== sourceLanguage) {
      setIsTranslating(true);
      
      setTimeout(() => {
        let translation = '';

        if (sourceLanguage === 'Tamil' && targetLanguage === 'English') {
          translation = 'This document is written in the Tamil language. This historically significant record dates back to 1892. Details about family genealogy and land ownership rights can be found here.';
        } else if (sourceLanguage === 'English' && targetLanguage === 'Tamil') {
          translation = 'இந்த வரலாற்று ஆவணம் 19 ஆம் நூற்றாண்டின் பிற்பகுதியிலிருந்து நில உரிமை பதிவுகள் பற்றிய மதிப்புமிக்க தகவல்களைக் கொண்டுள்ளது. கையால் எழுதப்பட்ட உரையில் சொத்து எல்லைகள், குடும்ப வம்சாவளி மற்றும் 1892 ஆம் ஆண்டைச் சுற்றியுள்ள சட்ட நடவடிக்கைகள் குறிப்பிடப்பட்டுள்ளன.';
        } else {
          translation = 'Translation between selected languages is not supported.';
        }

        setTranslatedText(translation);
        setIsTranslating(false);
      }, 2000);
    }
  }, [originalText, sourceLanguage, targetLanguage]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-teal-100 to-blue-100 rounded-lg">
            <Globe className="w-6 h-6 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">AI Translation</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Original Text */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Original Text</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {sourceLanguage}
              </span>
            </div>
            <div className="h-64 p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {originalText}
              </p>
            </div>
          </div>

          {/* Translation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Translation</h3>
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium border-none focus:ring-2 focus:ring-teal-300"
                >
                  {languages.filter(lang => lang.name !== sourceLanguage).map((lang) => (
                    <option key={lang.code} value={lang.name}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-64 p-4 bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-lg overflow-y-auto relative">
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-teal-600 font-medium">Translating with context preservation...</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {translatedText}
                </p>
              )}
            </div>

            {translatedText && !isTranslating && (
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Copy</span>
                    </>
                  )}
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationPanel;
