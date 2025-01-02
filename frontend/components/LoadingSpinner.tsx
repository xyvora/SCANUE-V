'use client'

import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24 }) => (
  <div
    className="spinner"
    style={{ width: size, height: size }}
    role="status"
    aria-label="Loading"
  >
    {/* Spinner SVG or CSS animation */}
  </div>
); 