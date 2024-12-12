import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalMotion = ({ isOpen, onClose, children }: ModalProps) => {
  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: {
      scale: 1.2,
      opacity: 0,
    },
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.div
        className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-96 relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          delay: 0.1,
        }}
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-0 -right-8"
        >
          <X />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ModalMotion;
