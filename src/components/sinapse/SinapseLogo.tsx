import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const SinapseLogo = ({ className, showText = true }: LogoProps) => (
  <div className={cn("flex items-center gap-2", className)}>
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <defs>
        <linearGradient id="sinapseG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(0 0% 95%)" />
          <stop offset="100%" stopColor="hsl(0 0% 55%)" />
        </linearGradient>
      </defs>
      <circle cx="9" cy="9" r="3.2" fill="url(#sinapseG)" />
      <circle cx="23" cy="9" r="2.4" fill="hsl(0 0% 75%)" />
      <circle cx="9" cy="23" r="2.4" fill="hsl(0 0% 75%)" />
      <circle cx="23" cy="23" r="3.2" fill="url(#sinapseG)" />
      <circle cx="16" cy="16" r="1.8" fill="hsl(0 0% 100%)" />
      <path
        d="M9 9 L16 16 L23 23 M23 9 L16 16 L9 23"
        stroke="hsl(0 0% 60%)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
    {showText && (
      <span className="font-display text-xl font-semibold tracking-tight">synapse</span>
    )}
  </div>
);
