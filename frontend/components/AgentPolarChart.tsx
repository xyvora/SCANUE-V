import React from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';

interface AgentPolarChartProps {
  data: {
    agent: string;
    value: number;
  }[];
}

export const AgentPolarChart: React.FC<AgentPolarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="agent" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Agent" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};
