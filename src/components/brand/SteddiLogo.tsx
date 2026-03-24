import { SteddiMark } from "./SteddiMark";

type LogoVariant = "light" | "dark";
type LogoSize = "sm" | "md" | "lg";

interface SteddiLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  showDescriptor?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { mark: 24, wordmark: "text-lg", descriptor: "text-[9px]", gap: "gap-2" },
  md: { mark: 32, wordmark: "text-2xl", descriptor: "text-[10px]", gap: "gap-2.5" },
  lg: { mark: 40, wordmark: "text-3xl", descriptor: "text-xs", gap: "gap-3" },
};

export function SteddiLogo({
  variant = "light",
  size = "md",
  showDescriptor = true,
  className,
}: SteddiLogoProps) {
  const cfg = sizeConfig[size];
  const isDark = variant === "dark";

  const markColor = isDark ? "text-white" : "text-[#1E3A5F]";
  const wordmarkColor = isDark ? "text-white" : "text-[#1E3A5F]";
  const descriptorColor = isDark ? "text-[#B8C6DE]" : "text-[#8E8E83]";

  return (
    <div className={`flex items-center ${cfg.gap} ${className ?? ""}`}>
      <SteddiMark size={cfg.mark} className={markColor} />
      <div className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-tight ${cfg.wordmark} ${wordmarkColor}`}
          style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 800 }}
        >
          steddi
        </span>
        {showDescriptor && (
          <span
            className={`font-semibold uppercase tracking-[0.12em] ${cfg.descriptor} ${descriptorColor}`}
            style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 600 }}
          >
            FRANQUIAS
          </span>
        )}
      </div>
    </div>
  );
}
