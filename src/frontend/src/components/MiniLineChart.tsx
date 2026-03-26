interface MiniLineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  filled?: boolean;
  label?: string;
}

export function MiniLineChart({
  data,
  width = 120,
  height = 40,
  color = "#A8E6C8",
  filled = false,
  label = "Mini line chart",
}: MiniLineChartProps) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 4;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const first = pts[0];
  const last = pts[pts.length - 1];
  const fillPath = `M ${first} L ${polyline
    .split(" ")
    .slice(1)
    .join(
      " L ",
    )} L ${last.split(",")[0]},${pad + h} L ${first.split(",")[0]},${pad + h} Z`;
  return (
    <svg
      role="img"
      aria-label={label}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      {filled && <path d={fillPath} fill={color} fillOpacity={0.15} />}
      <polyline
        points={polyline}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={last.split(",")[0]}
        cy={last.split(",")[1]}
        r={3}
        fill={color}
      />
    </svg>
  );
}
