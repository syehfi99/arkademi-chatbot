import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedText = () => {
  const texts = ["Powered by GPT-4 🚀", "For Fun ✨", "Work 💼", "Creativity 🎨"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const bounceVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Arkademi Intelligence</h1>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={bounceVariants}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        key={texts[currentTextIndex]}
        className="text-7xl font-extrabold text-blue-600"
      >
        {texts[currentTextIndex]}
      </motion.div>
    </div>
  );
};

export default AnimatedText;
