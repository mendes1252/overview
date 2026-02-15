import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const VALID_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeParam } = await params;
  const size = parseInt(sizeParam, 10);

  if (!VALID_SIZES.includes(size)) {
    return new Response("Invalid size", { status: 400 });
  }

  const logoSize = Math.round(size * 0.35);
  const circleR = Math.round(size * 0.12);
  const circleOffset = Math.round(size * 0.18);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F1419 0%, #1A1A2E 60%, #252547 100%)",
          position: "relative",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74,159,255,0.3) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Letter "p" */}
        <span
          style={{
            fontSize: logoSize,
            fontWeight: 300,
            color: "white",
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          p
        </span>
        {/* Pulse dot */}
        <div
          style={{
            position: "absolute",
            right: circleOffset,
            top: circleOffset,
            width: circleR,
            height: circleR,
            borderRadius: "50%",
            background: "#4A9FFF",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}
