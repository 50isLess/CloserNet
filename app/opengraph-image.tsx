import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CloserNet — Closer to real value. Protected by escrow.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(145deg, #09090b 0%, #18181b 55%, #27272a 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: 700,
              color: "#09090b",
            }}
          >
            C
          </div>
          <div style={{ fontSize: "52px", fontWeight: 600, letterSpacing: "-0.03em" }}>
            CloserNet
          </div>
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            maxWidth: "900px",
            marginBottom: "28px",
          }}
        >
          Closer to real value.
          <br />
          Protected by escrow.
        </div>
        <div style={{ fontSize: "30px", color: "#a1a1aa", maxWidth: "820px", lineHeight: 1.4 }}>
          Peer-to-peer marketplace with ~5% total fees, built-in escrow, and smart shipping.
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          {["~5% fees", "Escrow protected", "USPS · UPS · FedEx"].map((label) => (
            <div
              key={label}
              style={{
                padding: "12px 24px",
                borderRadius: "999px",
                border: "1px solid #3f3f46",
                background: "rgba(9, 9, 11, 0.6)",
                fontSize: "22px",
                color: "#d4d4d8",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}