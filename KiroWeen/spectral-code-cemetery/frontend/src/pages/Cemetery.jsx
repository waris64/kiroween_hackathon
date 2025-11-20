import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, Calendar, FileCode, Users } from 'lucide-react';
import CemeteryLayout from '../components/Cemetery/CemeteryLayout';
import TombstoneCard from '../components/Tombstone/TombstoneCard';
import FileDetailModal from '../components/FileDetail/FileDetailModal';
import GhostParticles from '../components/Effects/GhostParticles';
import LoadingScreen from '../components/Loading/LoadingScreen';
import ErrorMessage from '../components/Error/ErrorMessage';
import { useSpectralData } from '../hooks/useSpectralData';

const Cemetery = () => {
  const { data, isLoading, error } = useSpectralData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('age'); // age, name, commits
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all'); // all, haunted, active, dormant
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewMode, setViewMode] = useState('cemetery'); // cemetery, grid

  // Filter and sort files
  const processedFiles = useMemo(() => {
    if (!data?.files) return [];

    let filtered = [...data.files];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.path.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(file => {
        switch (filterType) {
          case 'haunted':
            return file.isHaunted;
          case 'active':
            return file.commitCount > 10;
          case 'dormant':
            return file.commitCount <= 5;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'age':
          comparison = new Date(a.lastModified) - new Date(b.lastModified);
          break;
        case 'name':
          comparison = a.path.localeCompare(b.path);
          break;
        case 'commits':
          comparison = a.commitCount - b.commitCount;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [data?.files, searchTerm, sortBy, sortOrder, filterType]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) {
    return <LoadingScreen message="Summoning the spirits..." />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      <GhostParticles />
      
      {/* Header */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-purple-100 mb-2">
            🪦 The Cemetery
          </h1>
          <p className="text-purple-300">
            {processedFiles.length} souls rest here
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-500/30"
        >
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
              <input
                type="text"
                placeholder="Search for files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'haunted', 'active', 'dormant'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filterType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700/50 text-purple-300 hover:bg-gray-700'
                  }`}
                >
                  <Filter size={16} className="inline mr-2" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500"
              >
                <option value="age">Last Modified</option>
                <option value="name">File Name</option>
                <option value="commits">Commit Count</option>
              </select>
              
              <button
                onClick={toggleSortOrder}
                className="px-4 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-purple-100 hover:bg-gray-700 transition-colors"
              >
                {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
              </button>

              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode(prev => prev === 'cemetery' ? 'grid' : 'cemetery')}
                className="px-4 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-purple-100 hover:bg-gray-700 transition-colors"
              >
                {viewMode === 'cemetery' ? '📊 Grid' : '🪦 Cemetery'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-6 text-sm text-purple-300">
            <div className="flex items-center gap-2">
              <FileCode size={16} />
              <span>{processedFiles.length} files</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{data?.contributors?.length || 0} contributors</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{data?.totalCommits || 0} commits</span>
            </div>
          </div>
        </motion.div>

        {/* Cemetery View */}
        {viewMode === 'cemetery' ? (
          <CemeteryLayout
            files={processedFiles}
            onFileClick={setSelectedFile}
          />
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedFiles.map((file, index) => (
              <motion.div
                key={file.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <TombstoneCard
                  file={file}
                  onClick={() => setSelectedFile(file)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {processedFiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">👻</div>
            <h3 className="text-2xl font-bold text-purple-100 mb-2">
              No souls found
            </h3>
            <p className="text-purple-300">
              Try adjusting your filters or search terms
            </p>
          </motion.div>
        )}
      </div>

      {/* File Detail Modal */}
      <AnimatePresence>
        {selectedFile && (
          <FileDetailModal
            file={selectedFile}
            isOpen={!!selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cemetery;
