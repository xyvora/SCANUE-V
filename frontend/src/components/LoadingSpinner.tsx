"use client";

type LoadingSpinnerProps = {
  size?: number;
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
}) => (
  <progress
    aria-label="Loading"
    className="spinner"
    style={{ width: size, height: size }}
    value={0}
    max={100}
  />
);
