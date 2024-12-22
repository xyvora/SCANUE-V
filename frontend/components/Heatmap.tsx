import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';

interface HeatmapProps {
  data: {
    agent: string;
    value: number;
  }[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const heatmapData = [
    {
      id: 'Agents',
      data: data.map(item => ({
        x: item.agent,
        y: item.value
      }))
    }
  ];

  return (
    <div style={{ height: '300px' }}>
      <ResponsiveHeatMap
        data={heatmapData}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        valueFormat=">-.2s"
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -90,
          legend: '',
          legendOffset: 46
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Agent',
          legendPosition: 'middle',
          legendOffset: 70
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Agent',
          legendPosition: 'middle',
          legendOffset: -72
        }}
        colors={{
          type: 'sequential',
          scheme: 'blues'
        }}
        emptyColor="#555555"
        legends={[
          {
            anchor: 'bottom',
            translateX: 0,
            translateY: 30,
            length: 400,
            thickness: 8,
            direction: 'row',
            tickPosition: 'after',
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            tickFormat: '>-.2s',
            title: 'Value →',
            titleAlign: 'start',
            titleOffset: 4
          }
        ]}
      />
    </div>
  );
};
