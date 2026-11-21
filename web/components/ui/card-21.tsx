import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// Define the props for the DestinationCard component
interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  flag?: string;
  stats: string;
  href: string;
  themeColor: string; // e.g., "150 50% 25%" for a deep green, "350 78% 44%" for crimson
  tag?: string;
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ className, imageUrl, location, flag, stats, href, themeColor, tag, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      // The 'group' class enables hover effects on child elements
      <div
        ref={ref}
        style={{
          // @ts-ignore - CSS custom properties are valid
          "--theme-color": themeColor,
        } as React.CSSProperties}
        className={cn("group w-full h-full", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <a
          href={href}
          className="relative block w-full h-full rounded-2xl overflow-hidden shadow-lg 
                     transition-all duration-500 ease-in-out 
                     group-hover:scale-[1.03]"
          aria-label={`Explore details for ${location}`}
          style={{
            boxShadow: isHovered
              ? `0 0 50px -10px hsl(var(--theme-color) / 0.75), 0 20px 25px -5px rgba(0, 0, 0, 0.4)`
              : `0 0 30px -12px hsl(var(--theme-color) / 0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.25)`,
          }}
        >
          {/* Background Image with Parallax Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center 
                       transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Top Pill / Occasion Tag */}
          {tag && (
            <div className="absolute top-4 left-4 z-10">
              <span
                style={{
                  backgroundColor: "rgba(18, 18, 20, 0.65)",
                  borderColor: "hsl(var(--theme-color) / 0.65)",
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-md border shadow-sm"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: "hsl(var(--theme-color))",
                    boxShadow: "0 0 8px hsl(var(--theme-color))",
                  }}
                />
                <span className="tracking-wide">{tag}</span>
              </span>
            </div>
          )}

          {/* Themed Gradient Overlay - vibrant color separation with rich luminance */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: `linear-gradient(to top, 
                hsl(var(--theme-color) / 0.95) 0%, 
                hsl(var(--theme-color) / 0.72) 38%, 
                hsl(var(--theme-color) / 0.2) 70%, 
                transparent 100%)`,
            }}
          />
          
          {/* Content */}
          <div className="relative flex flex-col justify-end h-full p-6 text-white z-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm flex items-center">
              <span>{location}</span>
              {flag && <span className="text-2xl ml-2">{flag}</span>}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium tracking-wide">
              {stats}
            </p>

            {/* Explore Button with vibrant theme glassmorphism */}
            <div
              style={{
                backgroundColor: isHovered
                  ? "hsl(var(--theme-color) / 0.45)"
                  : "hsl(var(--theme-color) / 0.28)",
                borderColor: isHovered
                  ? "hsl(var(--theme-color) / 0.8)"
                  : "hsl(var(--theme-color) / 0.5)",
              }}
              className="mt-6 flex items-center justify-between backdrop-blur-md border 
                         rounded-xl px-4 py-3 
                         transition-all duration-300 shadow-sm"
            >
              <span className="text-sm font-semibold tracking-wide text-white">Explore Now</span>
              <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 text-white" />
            </div>
          </div>
        </a>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };
export type { DestinationCardProps };
