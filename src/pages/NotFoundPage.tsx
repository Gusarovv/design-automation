import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 100,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: '-100vh',
    },
  };

  return (
    <motion.div
    className="flex items-center justify-center flex-col min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white"
    variants={pageVariants}
    initial="initial"
    animate="in"
    exit="out"
    transition={{ duration: 0.5 }}
  >
    <h1 className="text-9xl font-bold tracking-wider">404</h1>
    <h2 className="text-4xl font-semibold mb-5">Page Not Found</h2>
    <p className="mb-5 text-lg">We can't seem to find the page you're looking for.</p>
    <Link
      to="/"
      className="inline-block px-6 py-3 border border-white text-white font-bold text-sm uppercase rounded hover:bg-white hover:text-blue-600 transition-colors duration-200"
    >
      Go Back Home
    </Link>
  </motion.div>
  );
};
