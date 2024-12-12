import { motion } from "framer-motion";

const TextReveal = () => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Delay between each child animation
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.6 } },
  };

  return (
    <motion.div
      className="space-y-2 text-zinc-400"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* <motion.p variants={itemVariants}>Welcome to Arkademi Intelligence</motion.p> */}
      <motion.p variants={itemVariants}>Enjoy unlimited access to GPT-4o.</motion.p>
      <motion.p variants={itemVariants}>Ask AI Questions & get instant answers.</motion.p>
    </motion.div>
  );
};

export default TextReveal;
