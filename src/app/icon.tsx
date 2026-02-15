import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F1419 0%, #1A1A2E 100%)",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 300,
            color: "white",
            display: "flex",
          }}
        >
          p
        </span>
        <div
          style={{
            position: "absolute",
            right: 5,
            top: 5,
            width: 5,
            height: 5,
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
