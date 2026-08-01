export default function Sparkline({
  points,
  strokeClassName,
  className = 'w-full h-[22px]',
}: {
  points: number[];
  /** A Tailwind stroke-* utility, e.g. "stroke-brand-600". Fill is derived from it at low opacity. */
  strokeClassName: string;
  className?: string;
}) {
  if (points.length < 2) return null;

  const w = 100;
  const h = 22;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / (max - min || 1)) * (h - 4) - 2;
    return [x, y] as const;
  });
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const [lastX, lastY] = coords[coords.length - 1];
  const fillClassName = strokeClassName.replace('stroke-', 'fill-');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className}>
      <path d={area} className={fillClassName} opacity={0.12} />
      <path d={line} fill="none" className={strokeClassName} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
      <circle cx={lastX} cy={lastY} r={2.2} className={fillClassName} />
    </svg>
  );
}
