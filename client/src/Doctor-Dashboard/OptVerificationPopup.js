import React, { useState } from "react";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";

const OTPVerificationPopup = ({ onVerify, onClose }) => {
  const [otp, setOTP] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerify = () => {
    const verificationResult = onVerify(otp);
    if (!verificationResult) {
      setErrorMessage("Invalid OTP. Please try again.");
    } else onClose();
  };

  return (
    <div style={{ borderRadius: "10%", padding: "10px" }}>
      <SpaceBetween size="l">
        <h3 style={{ color: "black" }}>Enter the OTP received by Patient</h3>
        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={({ detail }) => setOTP(detail.value)}
        />
        <Button variant="primary" onClick={handleVerify}>
          Verify
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </SpaceBetween>
      {errorMessage && (
        <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>
      )}
    </div>
  );
};

export default OTPVerificationPopup;
