import React from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onRefresh: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onRefresh}
      className="fixed right-4 top-20 z-20 rounded-full bg-purple-600 p-2 text-white shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      aria-label="Refresh chat"
    >
      <RefreshCw className="h-6 w-6" />
    </motion.button>
  );
};
