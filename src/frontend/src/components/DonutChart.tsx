interface Segment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  thickness?: number;
}

export function DonutChart({
  segments,
  size = 140,
  thickness = 28,
}: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const slices = segments.map((seg) => {
    const dash = (seg.value / total) * circumference;
    const gap = circumference - dash;
    const rotation = (offset / total) * 360 - 90;
    offset += seg.value;
    return { dash, gap, rotation, ...seg };
  });

  return (
    <svg
      role="img"
      aria-label="Portfolio allocation donut chart"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      {slices.map((s) => (
        <circle
          key={s.label}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={thickness}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeLinecap="butt"
          transform={`rotate(${s.rotation} ${cx} ${cy})`}
        />
      ))}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill="#0F172A"
        fontSize="13"
        fontWeight="700"
      >
        Portfolio
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#64748B" fontSize="10">
        Allocation
      </text>
    </svg>
  );
}
