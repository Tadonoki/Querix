import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#24126A", // Querix brand primary indigo
          borderRadius: 8,
          position: "relative"
        }}
      >
        {/* Database Icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3 2.1 0 4.02-.27 5.46-.74" />
          <path d="M3 12c0 1.66 4 3 9 3" />
        </svg>
        {/* Zap Overlay */}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="#FBBF24" // Querix brand accent yellow
          stroke="#24126A"
          strokeWidth="1.5"
          style={{
            position: "absolute",
            bottom: "2px",
            right: "2px"
          }}
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
    ),
    {
      ...size
    }
  );
}
