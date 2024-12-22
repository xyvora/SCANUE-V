import React, { useState } from 'react';
import { AgentRadarChart } from './AgentRadarChart';
import { AgentBarChart } from './AgentBarChart';
import { AgentPolarChart } from './AgentPolarChart';

interface AgentVisualizationProps {
  data: {
    agent: string;
    value: number;
  }[];
}

export const AgentVisualization: React.FC<AgentVisualizationProps> = ({ data }) => {
  const [visualizationType, setVisualizationType] = useState<'radar' | 'bar' | 'polar'>('radar');

  const renderVisualization = () => {
    switch (visualizationType) {
      case 'radar':
        return <AgentRadarChart data={data} />;
      case 'bar':
        return <AgentBarChart data={data} />;
      case 'polar':
        return <AgentPolarChart data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setVisualizationType('radar')}
          className={`px-4 py-2 rounded-full ${
            visualizationType === 'radar'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Radar
        </button>
        <button
          onClick={() => setVisualizationType('bar')}
          className={`px-4 py-2 rounded-full ${
            visualizationType === 'bar'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Bar
        </button>
        <button
          onClick={() => setVisualizationType('polar')}
          className={`px-4 py-2 rounded-full ${
            visualizationType === 'polar'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          Polar
        </button>
      </div>
      {renderVisualization()}
    </div>
  );
};
