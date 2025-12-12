import { motion } from "framer-motion";

export default function ChatBubble({ role, text, time }) {
  const isLua = role === "lua";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col max-w-[70%] ${isLua ? "self-start" : "self-end"}`}
    >
      <div
        className={`
          px-4 py-3 rounded-2xl shadow
          backdrop-blur-md
          ${isLua 
            ? "bg-[#DDF5DB] text-[#505e4e]" 
            : "bg-[#E7DBF6] text-[#5a4e6c]"
          }
        `}
      >
        {text}
      </div>
      <span className="text-xs text-gray-500 mt-1 self-end">{time}</span>
    </motion.div>
  );
}
