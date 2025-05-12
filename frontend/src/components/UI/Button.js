import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: `bg-primary-600 text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`,
    secondary: `bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-4 focus:ring-secondary-300 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`,
    outline: `border border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 focus:ring-4 focus:ring-primary-100 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`,
    blush: `bg-blush-500 text-white hover:bg-blush-600 focus:ring-4 focus:ring-blush-300 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`,
    ghost: `text-primary-600 bg-transparent hover:bg-primary-50 focus:ring-4 focus:ring-primary-100 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`,
  };
  
  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
