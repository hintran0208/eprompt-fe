import React from "react";
import PropTypes from "prop-types";

const Card = React.forwardRef(({ children, className = "", header = null, footer = null, ...props }, ref) => {
  const baseClasses = "bg-white rounded-lg shadow-sm border border-gray-200";
  const classes = `${baseClasses} ${className}`;

  return (
    <div className={classes} ref={ref} {...props}>
      {header && <div className="px-6 py-4 border-b border-gray-200">{header}</div>}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-gray-200">{footer}</div>}
    </div>
  );
});

Card.displayName = "Card";

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
};

export default Card;
