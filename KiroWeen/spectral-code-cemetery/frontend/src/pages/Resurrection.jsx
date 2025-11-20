import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Wand2, ArrowRight, Download, Copy, Check } from 'lucide-react';
import { useResurrection } from '../hooks/useResurrection';
import LoadingScreen from '../components/Loading/LoadingScreen';
import ErrorMessage from '../components/Error/ErrorMessage';
import GhostParticles from '../components/Effects/GhostParticles';
import GhostButton from '../components/Buttons/GhostButton';

const Resurrection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [modernizationLevel, setModernizationLevel] = useState('moderate');
  const [copied, setCopied] = useState(false);
  
  const { 
    resurrect, 
    isResurrecting, 
    resurrectedCode, 
    error 
  } = useResurrection();

  const handleResurrect = async () => {
    if (!selectedFile) return;
    
    await resurrect({
      filePath: selectedFile.path,
      originalCode: selectedFile.content,
      level: modernizationLevel
    });
  };

  const handleCopy = async () => {
    if (!resurrectedCode) return;
    
    await navigator.clipboard.writeText(resurrectedCode.modernized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!resurrectedCode || !selectedFile) return;
    
    const blob = new Blob([resurrectedCode.modernized], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modernized_${selectedFile.path.split('/').pop()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Mock file selection for demo - in real app, this would come from cemetery data
  const mockFiles = [
    { path: 'src/legacy/oldComponent.js', content: 'var x = 1;\nfunction test() {\n  return x;\n}' },
    { path: 'src/utils/helpers.js', content: 'function add(a, b) {\n  return a + b;\n}' },
    { path: 'src/models/User.js', content: 'var User = function(name) {\n  this.name = name;\n};' }
  ];

  if (isResurrecting) {
    return <LoadingScreen message="Channeling ancient spirits..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      <GhostParticles />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-purple-100 mb-2">
            ✨ Code Resurrection
          </h1>
          <p className="text-purple-300">
            Breathe new life into ancient code with AI magic
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* File Selection */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
              <h2 className="text-xl font-semibold text-purple-100 mb-4 flex items-center gap-2">
                <Code size={24} />
                Select File to Resurrect
              </h2>
              
              <div className="space-y-2">
                {mockFiles.map((file, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedFile?.path === file.path
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/30 text-purple-200 hover:bg-gray-700/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-mono text-sm">{file.path}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Modernization Level */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
              <h2 className="text-xl font-semibold text-purple-100 mb-4 flex items-center gap-2">
                <Wand2 size={24} />
                Modernization Level
              </h2>
              
              <div className="space-y-3">
                {[
                  { value: 'conservative', label: 'Conservative', desc: 'Minimal changes, focus on syntax' },
                  { value: 'moderate', label: 'Moderate', desc: 'Modern patterns and best practices' },
                  { value: 'aggressive', label: 'Aggressive', desc: 'Complete rewrite with latest features' }
                ].map((level) => (
                  <label
                    key={level.value}
                    className={`block p-4 rounded-lg cursor-pointer transition-all ${
                      modernizationLevel === level.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700/30 text-purple-200 hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={level.value}
                      checked={modernizationLevel === level.value}
                      onChange={(e) => setModernizationLevel(e.target.value)}
                      className="sr-only"
                    />
                    <div className="font-semibold mb-1">{level.label}</div>
                    <div className="text-sm opacity-80">{level.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Resurrect Button */}
            <GhostButton
              onClick={handleResurrect}
              disabled={!selectedFile || isResurrecting}
              className="w-full"
            >
              <Sparkles className="mr-2" size={20} />
              Resurrect Code
            </GhostButton>

            {error && (
              <ErrorMessage error={error} />
            )}
          </motion.div>

          {/* Right Panel - Code Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Original Code */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
              <h2 className="text-xl font-semibold text-purple-100 mb-4">
                👻 Original Code
              </h2>
              
              {selectedFile ? (
                <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-sm text-purple-200 font-mono">
                  <code>{selectedFile.content}</code>
                </pre>
              ) : (
                <div className="text-center py-8 text-purple-300">
                  Select a file to view its code
                </div>
              )}
            </div>

            {/* Modernized Code */}
            <AnimatePresence>
              {resurrectedCode && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-green-500/30"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-green-100 flex items-center gap-2">
                      <Sparkles size={24} />
                      Resurrected Code
                    </h2>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-purple-200"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-purple-200"
                        title="Download file"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-sm text-green-200 font-mono max-h-96">
                    <code>{resurrectedCode.modernized}</code>
                  </pre>

                  {/* Changes Summary */}
                  {resurrectedCode.changes && (
                    <div className="mt-4 p-4 bg-gray-900/30 rounded-lg">
                      <h3 className="text-sm font-semibold text-purple-100 mb-2">
                        Changes Applied:
                      </h3>
                      <ul className="text-sm text-purple-300 space-y-1">
                        {resurrectedCode.changes.map((change, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight size={16} className="mt-0.5 flex-shrink-0" />
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* AI Explanation */}
                  {resurrectedCode.explanation && (
                    <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
                      <h3 className="text-sm font-semibold text-purple-100 mb-2">
                        AI Insights:
                      </h3>
                      <p className="text-sm text-purple-300">
                        {resurrectedCode.explanation}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!resurrectedCode && selectedFile && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
                <div className="text-center py-12">
                  <Wand2 size={48} className="mx-auto mb-4 text-purple-400" />
                  <h3 className="text-xl font-semibold text-purple-100 mb-2">
                    Ready to Resurrect
                  </h3>
                  <p className="text-purple-300">
                    Click the button to modernize your code with AI
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30"
        >
          <h3 className="text-lg font-semibold text-purple-100 mb-3">
            How Code Resurrection Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-300">
            <div>
              <div className="font-semibold text-purple-100 mb-1">1. Analysis</div>
              <p>AI analyzes your legacy code patterns and identifies outdated practices</p>
            </div>
            <div>
              <div className="font-semibold text-purple-100 mb-1">2. Modernization</div>
              <p>Code is rewritten using modern syntax, patterns, and best practices</p>
            </div>
            <div>
              <div className="font-semibold text-purple-100 mb-1">3. Validation</div>
              <p>Changes are explained and validated to ensure functionality is preserved</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resurrection;
