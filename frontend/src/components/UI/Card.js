import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick = null,
  ...props 
}) => {
  const baseClasses = "bg-white rounded-lg shadow-sm p-6";
  const hoverClasses = hover ? "transition-all duration-200 hover:shadow-md" : "";
  
  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
