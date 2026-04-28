const LOGO_URL =
  "https://grazia-prod.oss-ap-southeast-1.aliyuncs.com/resources/uid_100040337/c5466c37-5f16-4f.jpg";

interface AppLogoProps {
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

export function AppLogo({ size = 40, showText = false, textClassName = "" }: AppLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src={LOGO_URL}
        alt="HabeshaRide — Canada Maple Leaf Logo"
        crossOrigin="anonymous"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain" }}
        className="rounded-full"
      />
      {showText && (
        <span className={textClassName || "font-bold text-xl tracking-tight"}>
          HabeshaRide
        </span>
      )}
    </div>
  );
}
