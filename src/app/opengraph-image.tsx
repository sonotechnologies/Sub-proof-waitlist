import { ImageResponse } from "next/og";

export const alt =
  "Subproof: stop chasing subs for insurance certificates. COI tracking for general contractors.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#13294b";
const INK = "#0b1526";

const PILLS = [
  { label: "Compliant", fg: "#15703d", bg: "#e3f5ea" },
  { label: "Expiring soon", fg: "#9a5a00", bg: "#fdf1d8" },
  { label: "Non-compliant", fg: "#b42318", bg: "#fde8e6" },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(180deg, #e8edf5 0%, #ffffff 70%)",
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.5 4 5.6v6.1c0 4.9 3.4 8.6 8 9.8 4.6-1.2 8-4.9 8-9.8V5.6L12 2.5Z"
              fill={NAVY}
            />
            <path
              d="m8.4 12.1 2.5 2.5 4.9-5"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 800, color: NAVY }}>
            Subproof
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: NAVY,
              maxWidth: 1000,
            }}
          >
            Stop chasing subs for insurance certificates.
          </div>
          <div style={{ fontSize: 32, color: "#2d3a4f" }}>
            COI tracking for general contractors. Join the waitlist.
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {PILLS.map((p) => (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 20px",
                borderRadius: 999,
                background: p.bg,
                color: p.fg,
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: p.fg,
                }}
              />
              {p.label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
