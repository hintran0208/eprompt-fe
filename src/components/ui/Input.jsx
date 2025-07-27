import { forwardRef } from "react";
import PropTypes from "prop-types";

const Input = forwardRef(
  ({ type = "text", placeholder = "", label = "", error = "", className = "", ...props }, ref) => {
    const baseClasses =
      "w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const errorClasses = error ? "border-red-500" : "border-gray-300";
    const classes = `${baseClasses} ${errorClasses} ${className}`;

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input autoFocus={true} ref={ref} type={type} placeholder={placeholder} className={classes} {...props} />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
