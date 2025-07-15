import { forwardRef } from "react";
import PropTypes from "prop-types";

const Textarea = forwardRef(
  ({ placeholder = "", label = "", error = "", className = "", rows = 4, ...props }, ref) => {
    const baseClasses =
      "w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical";
    const errorClasses = error ? "border-red-500" : "border-gray-300";
    const classes = `${baseClasses} ${errorClasses} ${className}`;

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <textarea 
          ref={ref} 
          placeholder={placeholder} 
          className={classes} 
          rows={rows}
          {...props} 
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

Textarea.propTypes = {
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  rows: PropTypes.number,
};

export default Textarea;
