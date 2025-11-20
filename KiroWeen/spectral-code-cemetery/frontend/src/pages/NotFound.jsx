import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Ghost } from 'lucide-react';
import GhostParticles from '../components/Effects/GhostParticles';
import GhostButton from '../components/Buttons/GhostButton';

const NotFound = () => {
  const navigate = useNavigate();

  // Floating ghost animation
  const ghostVariants = {
    float: {
      y: [0, -20, 0],
      rotate: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Spooky text animation
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden flex items-center justify-center">
      <GhostParticles />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Animated Ghost */}
        <motion.div
          variants={ghostVariants}
          animate="float"
          className="mb-8"
        >
          <div className="text-9xl mb-4 filter drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            👻
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <motion.h1
            custom={0}
            variants={textVariants}
            className="text-8xl md:text-9xl font-bold text-purple-100 mb-4 tracking-wider"
            style={{
              textShadow: '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)'
            }}
          >
            404
          </motion.h1>
          
          <motion.h2
            custom={1}
            variants={textVariants}
            className="text-3xl md:text-4xl font-bold text-purple-200 mb-4"
          >
            Lost in the Spirit Realm
          </motion.h2>
          
          <motion.p
            custom={2}
            variants={textVariants}
            className="text-xl text-purple-300 mb-8 max-w-md mx-auto"
          >
            The page you're looking for has vanished into the ethereal void...
          </motion.p>
        </motion.div>

        {/* Spooky Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12 space-y-2"
        >
          <p className="text-purple-400 italic">
            "Even ghosts get lost sometimes..."
          </p>
          <p className="text-purple-400/70 text-sm">
            Perhaps this page was buried too deep in the cemetery
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <GhostButton
            onClick={() => navigate('/')}
            className="min-w-[200px]"
          >
            <Home className="mr-2" size={20} />
            Return Home
          </GhostButton>
          
          <GhostButton
            onClick={() => navigate(-1)}
            variant="secondary"
            className="min-w-[200px]"
          >
            <Ghost className="mr-2" size={20} />
            Go Back
          </GhostButton>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex justify-center gap-8 text-4xl"
        >
          {['🕸️', '🦇', '🕷️', '💀', '🌙'].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              className="opacity-50"
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-xs text-purple-500 font-mono"
        >
          ERROR_CODE: GHOST_NOT_FOUND
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ],
              rotate: [0, 360]
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            👻
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;
