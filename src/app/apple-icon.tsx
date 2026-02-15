import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F1419 0%, #1A1A2E 60%, #252547 100%)",
          borderRadius: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74,159,255,0.25) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <span
          style={{
            fontSize: 64,
            fontWeight: 300,
            color: "white",
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          p
        </span>
        <div
          style={{
            position: "absolute",
            right: 32,
            top: 32,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#4A9FFF",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
