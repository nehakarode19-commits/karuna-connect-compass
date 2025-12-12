import React from "react";

interface CertificateTemplateProps {
  schoolName: string;
  kcNo: string;
  activityTitle: string;
  score: number;
  certificateType: "Excellence" | "Merit" | "Participation";
  date: string;
}

const CertificateTemplate = React.forwardRef<HTMLDivElement, CertificateTemplateProps>(
  function CertificateTemplateComponent(props, ref) {
    const { schoolName, kcNo, activityTitle, score, certificateType, date } = props;
    
    let borderColor = "#CD7F32";
    let bgGradient = "linear-gradient(135deg, #FDF5E6 0%, #FFFEF5 50%, #FDF5E6 100%)";
    
    if (certificateType === "Excellence") {
      borderColor = "#FFD700";
      bgGradient = "linear-gradient(135deg, #FFF9E6 0%, #FFFEF5 50%, #FFF9E6 100%)";
    } else if (certificateType === "Merit") {
      borderColor = "#C0C0C0";
      bgGradient = "linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)";
    }

    return (
      <div
        ref={ref}
        style={{
          width: "800px",
          height: "600px",
          background: bgGradient,
          border: `8px solid ${borderColor}`,
          borderRadius: "12px",
          padding: "40px",
          position: "relative",
          fontFamily: "Georgia, serif",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ position: "absolute", top: 20, left: 20, width: 60, height: 60, borderTop: `3px solid ${borderColor}`, borderLeft: `3px solid ${borderColor}` }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 60, height: 60, borderTop: `3px solid ${borderColor}`, borderRight: `3px solid ${borderColor}` }} />
        <div style={{ position: "absolute", bottom: 20, left: 20, width: 60, height: 60, borderBottom: `3px solid ${borderColor}`, borderLeft: `3px solid ${borderColor}` }} />
        <div style={{ position: "absolute", bottom: 20, right: 20, width: 60, height: 60, borderBottom: `3px solid ${borderColor}`, borderRight: `3px solid ${borderColor}` }} />

        <div style={{ textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 24, color: "#1e3a5f", margin: "0 0 5px 0", letterSpacing: 2 }}>KARUNA INTERNATIONAL</h2>
            <h1 style={{ fontSize: 32, color: "#1e3a5f", margin: 0, letterSpacing: 4, textTransform: "uppercase" }}>
              Certificate of {certificateType}
            </h1>
            <div style={{ width: 200, height: 2, background: borderColor, margin: "15px auto" }} />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: 16, color: "#555", margin: "0 0 10px 0" }}>This is to certify that</p>
            <h2 style={{ fontSize: 28, color: "#1e3a5f", margin: "0 0 10px 0", fontWeight: "bold" }}>{schoolName}</h2>
            <p style={{ fontSize: 14, color: "#777", margin: "0 0 20px 0" }}>KC No: {kcNo}</p>
            <p style={{ fontSize: 16, color: "#555", margin: "0 0 10px 0" }}>has successfully participated in</p>
            <h3 style={{ fontSize: 22, color: "#2c5282", margin: "0 0 15px 0", fontStyle: "italic" }}>{activityTitle}</h3>
            <p style={{ fontSize: 18, color: "#1e3a5f", margin: 0, fontWeight: "bold" }}>Score: {score}/100</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 150, borderTop: "2px solid #333", paddingTop: 8 }}>
                <p style={{ fontSize: 12, color: "#555", margin: 0 }}>Date</p>
                <p style={{ fontSize: 14, color: "#333", margin: 0 }}>{date}</p>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 80, height: 80, border: "2px solid #1e3a5f", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: "#1e3a5f", textAlign: "center" }}>KARUNA SEAL</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 150, borderTop: "2px solid #333", paddingTop: 8 }}>
                <p style={{ fontSize: 12, color: "#555", margin: 0 }}>Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default CertificateTemplate;
