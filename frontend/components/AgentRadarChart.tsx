/* import { ResponsiveRadar } from '@nivo/radar';

interface AgentRadarChartProps {
  data: {
    agent: string;
    value: number;
  }[];
}

export const AgentRadarChart: React.FC<AgentRadarChartProps> = ({ data }) => {
  const chartData = [
    data.reduce((acc, { agent, value }) => ({ ...acc, [agent]: value }), {})
  ];

  return (
    <div style={{ height: '400px' }}>
      <ResponsiveRadar
        data={chartData}
        keys={data.map(d => d.agent)}
        indexBy="agent"
        maxValue={100}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={36}
        enableDots={true}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={true}
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={{ scheme: 'category10' }}
        fillOpacity={0.25}
        blendMode="multiply"
        animate={true}
        motionConfig="wobbly"
        isInteractive={true}
        legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: '#999',
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
      />
    </div>
  );
};*/
