import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const TypingAnimation = () => {
  const [text, setText] = useState(""); // Holds the progressively typed text
  const fullText = "Weelcome to Arkademi Intelligence"; // Text to animate
  const typingSpeed = 100; // Typing speed in milliseconds

  useEffect(() => {
    let index = 0;

    const typeText = () => {
      if (index < fullText.length) {
        setText((prev) => prev + fullText[index]); // Append the next character
        index++;
      } else {
        clearInterval(interval); // Stop the interval when the full text is typed
      }
    };

    const interval = setInterval(typeText, typingSpeed); // Start typing animation

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [fullText]);

  return (
    <div className="text-4xl font-bold text-zinc-400">
      {text}
      <motion.span
        className="inline-block bg-black w-[2px] h-[1.2em]"
        animate={{ opacity: [0, 1] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default TypingAnimation;
