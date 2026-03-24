interface SteddiMarkProps {
  size?: number;
  className?: string;
}

export function SteddiMark({ size = 32, className }: SteddiMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="6" width="18" height="6" rx="2" fill="currentColor" />
      <rect x="6" y="17" width="28" height="6" rx="2" fill="currentColor" />
      <rect x="16" y="28" width="18" height="6" rx="2" fill="currentColor" />
    </svg>
  );
}
