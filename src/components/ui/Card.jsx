const Card = ({ children, className = "", header = null, footer = null, ...props }) => {
  const baseClasses = "bg-white rounded-lg shadow-sm border border-gray-200";
  const classes = `${baseClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {header && <div className="px-6 py-4 border-b border-gray-200">{header}</div>}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-gray-200">{footer}</div>}
    </div>
  );
};

export default Card;
