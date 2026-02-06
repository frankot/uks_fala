export default function WaveDivider({
  color = "var(--color-sand-50)",
  flip = false,
}: {
  color?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}
      style={{ marginTop: "-1px" }}
    >
      <svg
        className="relative block w-[200%] h-[60px] md:h-[80px] wave-line"
        viewBox="0 0 2400 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 C1350,80 1550,0 1800,40 C2050,80 2250,0 2400,40 L2400,80 L0,80 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
