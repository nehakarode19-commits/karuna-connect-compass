import { forwardRef } from "react";
import karunaLogo from "@/assets/karuna-logo.png";

interface CertificateTemplateProps {
  schoolName: string;
  kcNo: string;
  activityTitle: string;
  score: number;
  certificateType: "Excellence" | "Merit" | "Participation";
  date: string;
}

const CertificateTemplate = forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ schoolName, kcNo, activityTitle, score, certificateType, date }, ref) => {
    const getBorderColor = () => {
      switch (certificateType) {
        case "Excellence":
          return "#FFD700";
        case "Merit":
          return "#C0C0C0";
        default:
          return "#CD7F32";
      }
    };

    const getGradient = () => {
      switch (certificateType) {
        case "Excellence":
          return "linear-gradient(135deg, #FFF9E6 0%, #FFFEF5 50%, #FFF9E6 100%)";
        case "Merit":
          return "linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)";
        default:
          return "linear-gradient(135deg, #FDF5E6 0%, #FFFEF5 50%, #FDF5E6 100%)";
      }
    };

    return (
      <div
        ref={ref}
        style={{
          width: "800px",
          height: "600px",
          background: getGradient(),
          border: `8px solid ${getBorderColor()}`,
          borderRadius: "12px",
          padding: "40px",
          position: "relative",
          fontFamily: "'Georgia', serif",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        }}
      >
        {/* Corner Decorations */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            width: "60px",
            height: "60px",
            borderTop: `3px solid ${getBorderColor()}`,
            borderLeft: `3px solid ${getBorderColor()}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderTop: `3px solid ${getBorderColor()}`,
            borderRight: `3px solid ${getBorderColor()}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "60px",
            height: "60px",
            borderBottom: `3px solid ${getBorderColor()}`,
            borderLeft: `3px solid ${getBorderColor()}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderBottom: `3px solid ${getBorderColor()}`,
            borderRight: `3px solid ${getBorderColor()}`,
          }}
        />

        {/* Content */}
        <div style={{ textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Header */}
          <div>
            <img
              src={karunaLogo}
              alt="Karuna International"
              style={{ height: "60px", marginBottom: "10px" }}
            />
            <h1
              style={{
                fontSize: "32px",
                color: "#1e3a5f",
                margin: "0",
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              Certificate of {certificateType}
            </h1>
            <div
              style={{
                width: "200px",
                height: "2px",
                background: getBorderColor(),
                margin: "15px auto",
              }}
            />
          </div>

          {/* Body */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: "16px", color: "#555", margin: "0 0 10px 0" }}>
              This is to certify that
            </p>
            <h2
              style={{
                fontSize: "28px",
                color: "#1e3a5f",
                margin: "0 0 10px 0",
                fontWeight: "bold",
              }}
            >
              {schoolName}
            </h2>
            <p style={{ fontSize: "14px", color: "#777", margin: "0 0 20px 0" }}>
              KC No: {kcNo}
            </p>
            <p style={{ fontSize: "16px", color: "#555", margin: "0 0 10px 0" }}>
              has successfully participated in
            </p>
            <h3
              style={{
                fontSize: "22px",
                color: "#2c5282",
                margin: "0 0 15px 0",
                fontStyle: "italic",
              }}
            >
              {activityTitle}
            </h3>
            <p style={{ fontSize: "18px", color: "#1e3a5f", margin: "0", fontWeight: "bold" }}>
              Score: {score}/100
            </p>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "20px" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "150px",
                  borderTop: "2px solid #333",
                  paddingTop: "8px",
                }}
              >
                <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>Date</p>
                <p style={{ fontSize: "14px", color: "#333", margin: 0 }}>{date}</p>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <img
                src={karunaLogo}
                alt="Seal"
                style={{ height: "50px", opacity: 0.3, marginBottom: "5px" }}
              />
              <p style={{ fontSize: "10px", color: "#777", margin: 0 }}>Karuna International</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "150px",
                  borderTop: "2px solid #333",
                  paddingTop: "8px",
                }}
              >
                <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CertificateTemplate.displayName = "CertificateTemplate";

export default CertificateTemplate;
