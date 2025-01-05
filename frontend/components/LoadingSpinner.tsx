"use client";

import PropTypes from "prop-types";

// Disable the prop-types rule for this file
// /* eslint-disable react/prop-types */

type LoadingSpinnerProps = {
  size?: number;
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24 }) => (
  <progress className="spinner" style={{ width: size, height: size }} aria-label="Loading">
    {/* Spinner SVG or CSS animation */}
  </progress>
);

LoadingSpinner.propTypes = {
  size: PropTypes.number,
};
