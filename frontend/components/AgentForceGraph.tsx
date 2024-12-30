/* import { ResponsiveNetwork } from '@nivo/network';

interface AgentForceGraphProps {
  data: {
    agent: string;
    value: number;
  }[];
}

export const AgentForceGraph: React.FC<AgentForceGraphProps> = ({ data }) => {
  const nodes = data.map(({ agent, value }) => ({
    id: agent,
    height: value,
    size: value,
  }));

  const links = data.flatMap((item, i) =>
    data.slice(i + 1).map(other => ({
      source: item.agent,
      target: other.agent,
      distance: Math.abs(item.value - other.value),
    }))
  );

  const graphData = { nodes, links };

  return (
    <div style={{ height: '400px' }}>
      <ResponsiveNetwork
        data={graphData}
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
