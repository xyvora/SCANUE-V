/* import { ResponsiveNetwork } from '@nivo/network';

interface NetworkGraphProps {
  data: {
    agent: string;
    value: number;
  }[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ data }) => {
  const networkData = {
    nodes: data.map((item, index) => ({
      id: item.agent,
      height: item.value,
      size: item.value,
    })),
    links: data.flatMap((item, index) =>
      data.slice(index + 1).map(otherItem => ({
        source: item.agent,
        target: otherItem.agent,
        distance: Math.abs(item.value - otherItem.value),
      }))
    ),
  };

  return (
    <div style={{ height: '300px' }}>
      <ResponsiveNetwork
        data={networkData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={(e) => e.distance}
        centeringStrength={0.3}
        repulsivity={6}
        nodeSize={(n) => n.size}
        activeNodeSize={(n) => 1.1 * n.size}
        nodeColor={(e) => `hsl(${e.height * 3}, 70%, 50%)`}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
        linkThickness={(n) => 2 + 2 * n.target.data.height}
        linkBlendMode="multiply"
        motionConfig="wobbly"
      />
    </div>
  );
}; */
