import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, GitCommit, User, Calendar, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useSpectralData } from '../hooks/useSpectralData';
import LoadingScreen from '../components/Loading/LoadingScreen';
import ErrorMessage from '../components/Error/ErrorMessage';
import GhostParticles from '../components/Effects/GhostParticles';
import { dateFormatter } from '../utils/dateFormatter';

const TimeTravel = () => {
  const { data, isLoading, error } = useSpectralData();
  const [selectedCommitIndex, setSelectedCommitIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms per commit

  // Sort commits by date
  const sortedCommits = useMemo(() => {
    if (!data?.commits) return [];
    return [...data.commits].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  }, [data?.commits]);

  const selectedCommit = sortedCommits[selectedCommitIndex];

  // Auto-play functionality
  React.useEffect(() => {
    if (!isPlaying || selectedCommitIndex >= sortedCommits.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setSelectedCommitIndex(prev => prev + 1);
    }, playbackSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, selectedCommitIndex, sortedCommits.length, playbackSpeed]);

  const handlePrevious = () => {
    setIsPlaying(false);
    setSelectedCommitIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setSelectedCommitIndex(prev => Math.min(sortedCommits.length - 1, prev + 1));
  };

  const handlePlayPause = () => {
    if (selectedCommitIndex >= sortedCommits.length - 1) {
      setSelectedCommitIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimelineClick = (index) => {
    setIsPlaying(false);
    setSelectedCommitIndex(index);
  };

  if (isLoading) {
    return <LoadingScreen message="Rewinding time..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!sortedCommits.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h3 className="text-2xl font-bold text-purple-100 mb-2">
            No history found
          </h3>
          <p className="text-purple-300">
            Analyze a repository first to travel through time
          </p>
        </div>
      </div>
    );
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
            ⏰ Time Travel
          </h1>
          <p className="text-purple-300">
            Journey through {sortedCommits.length} moments in history
          </p>
        </motion.div>

        {/* Timeline Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-500/30"
        >
          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={handlePrevious}
              disabled={selectedCommitIndex === 0}
              className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={handlePlayPause}
              className="p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>

            <button
              onClick={handleNext}
              disabled={selectedCommitIndex === sortedCommits.length - 1}
              className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Speed Control */}
            <div className="ml-4 flex items-center gap-2">
              <Clock size={20} className="text-purple-300" />
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500"
              >
                <option value={2000}>0.5x</option>
                <option value={1000}>1x</option>
                <option value={500}>2x</option>
                <option value={250}>4x</option>
              </select>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max={sortedCommits.length - 1}
              value={selectedCommitIndex}
              onChange={(e) => handleTimelineClick(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between mt-2 text-xs text-purple-300">
              <span>{dateFormatter.formatDate(sortedCommits[0]?.date)}</span>
              <span>
                {selectedCommitIndex + 1} / {sortedCommits.length}
              </span>
              <span>{dateFormatter.formatDate(sortedCommits[sortedCommits.length - 1]?.date)}</span>
            </div>
          </div>
        </motion.div>

        {/* Commit Details */}
        <AnimatePresence mode="wait">
          {selectedCommit && (
            <motion.div
              key={selectedCommitIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-purple-500/30"
            >
              {/* Commit Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <GitCommit className="text-purple-400" size={24} />
                    <h2 className="text-2xl font-bold text-purple-100">
                      {selectedCommit.message}
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-purple-300">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{selectedCommit.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{dateFormatter.formatDateTime(selectedCommit.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-gray-700/50 rounded text-xs">
                        {selectedCommit.hash?.substring(0, 7)}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Changed Files */}
              {selectedCommit.files && selectedCommit.files.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-purple-100 mb-4">
                    Changed Files ({selectedCommit.files.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedCommit.files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-purple-200 font-mono text-sm">
                          {file.path || file}
                        </span>
                        <div className="flex gap-2 text-xs">
                          {file.additions !== undefined && (
                            <span className="text-green-400">
                              +{file.additions}
                            </span>
                          )}
                          {file.deletions !== undefined && (
                            <span className="text-red-400">
                              -{file.deletions}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commit Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    +{selectedCommit.additions || 0}
                  </div>
                  <div className="text-sm text-purple-300">Additions</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">
                    -{selectedCommit.deletions || 0}
                  </div>
                  <div className="text-sm text-purple-300">Deletions</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedCommit.files?.length || 0}
                  </div>
                  <div className="text-sm text-purple-300">Files</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30"
        >
          <h3 className="text-lg font-semibold text-purple-100 mb-4">
            Commit Timeline
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sortedCommits.map((commit, index) => (
              <motion.button
                key={index}
                onClick={() => handleTimelineClick(index)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  index === selectedCommitIndex
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700/30 text-purple-200 hover:bg-gray-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm truncate flex-1">
                    {commit.message}
                  </span>
                  <span className="text-xs ml-4">
                    {dateFormatter.formatDate(commit.date)}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeTravel;
