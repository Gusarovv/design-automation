import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

export const Loading = () => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        loop: Infinity,
        ease: 'linear',
        duration: 1,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 bg-opacity-75 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div variants={spinnerVariants} animate="animate">
        <FaSpinner className="text-white text-6xl animate-spin" />
      </motion.div>
    </motion.div>
  );
};