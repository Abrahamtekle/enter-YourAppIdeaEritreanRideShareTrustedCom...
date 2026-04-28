interface AppLogoProps {
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

/**
 * HabeshaRide logo: maple leaf + simplified Canada map silhouette
 */
export function AppLogo({ size = 40, showText = false, textClassName = "" }: AppLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="HabeshaRide logo"
      >
        {/* Background */}
        <rect width="48" height="48" rx="10" fill="#0A2E19" />

        {/* Gold border ring */}
        <rect x="1" y="1" width="46" height="46" rx="9.5" stroke="#C9920A" strokeWidth="1.5" fill="none" />

        {/* Canada map silhouette — simplified but recognizable shape */}
        {/* Mainland Canada with Hudson Bay notch */}
        <path
          d={[
            "M 3,41",      // bottom left (BC)
            "L 3,28",      // west coast up
            "L 5,17",      // BC heading north
            "L 8,10",      // Yukon
            "L 14,6",      // NWT
            "L 22,4",      // top middle (Nunavut top)
            "L 32,5",      // top east
            "L 38,9",      // Labrador/Quebec corner
            "L 44,18",     // east coast coming down
            "L 45,28",     // Maritime coast
            "L 42,35",     // lower east
            // Hudson Bay southern tip notch
            "L 38,34",
            "L 35,28",     // Hudson Bay right wall
            "L 32,24",     // Hudson Bay deep
            "L 28,26",     // Hudson Bay western wall
            "L 25,32",     // southwest of Hudson Bay
            // Great Lakes / Ontario border
            "L 22,38",
            "L 17,41",
            "L 10,42",
            "Z",
          ].join(" ")}
          fill="rgba(201,146,10,0.18)"
          stroke="rgba(201,146,10,0.45)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Maple Leaf — centered, red */}
        {/*
          Maple leaf path (48x48 viewbox), positioned center at ~(24, 22)
          Width: ~20px, Height: ~30px (with stem)
        */}
        <path
          d={[
            "M 24,7",         // top point
            "L 25.6,13",      // upper right shoulder
            "L 30.5,11.5",    // far right upper
            "L 28.5,17",      // right mid
            "L 34,18.5",      // far right
            "L 29.5,23",      // right mid-lower
            "L 32,29",        // lower right
            "L 25.5,27.5",    // stem area right
            "L 25.5,38",      // stem right
            "L 22.5,38",      // stem left
            "L 22.5,27.5",    // stem area left
            "L 16,29",        // lower left
            "L 18.5,23",      // left mid-lower
            "L 14,18.5",      // far left
            "L 19.5,17",      // left mid
            "L 17.5,11.5",    // far left upper
            "L 22.4,13",      // upper left shoulder
            "Z",
          ].join(" ")}
          fill="#D94040"
          stroke="#B52B2B"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span className={textClassName || "font-bold text-xl tracking-tight"}>
          HabeshaRide
        </span>
      )}
    </div>
  );
}
