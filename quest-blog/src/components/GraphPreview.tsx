import { wiki, noteColors } from "@/lib/wiki";
const positions = new Map(wiki.nodes.map((n) => [n.id, n]));
export function GraphPreview() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="garden-art"
      fill="none"
      aria-hidden="true"
    >
      {wiki.edges.map((e, i) => (
        <line
          key={i}
          x1={positions.get(e.source)!.x}
          y1={positions.get(e.source)!.y}
          x2={positions.get(e.target)!.x}
          y2={positions.get(e.target)!.y}
          stroke="#a19cb9"
          strokeOpacity=".22"
          strokeWidth="1.8"
        />
      ))}
      {wiki.nodes.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={n.type === "map" ? 11 : 6}
          fill={noteColors[n.type]}
        />
      ))}
    </svg>
  );
}
