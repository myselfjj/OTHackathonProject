import React from "react";
import PatientLogin from "./Login/PatientLogin";
import DoctorLogin from "./Login/DoctorLogin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopNavigation from "./Navigations/TopNavigation";
import PatientDashboardPage from "./Patient-Dashboard/PatientDashboardPage";
import SideNavigation from "./Navigations/SideNavigation";
import AppLayout from "@cloudscape-design/components/app-layout";
import { useRef, useState, useEffect } from "react";
import "@cloudscape-design/global-styles/index.css";
import DoctorDashboardPage from "./Doctor-Dashboard/DoctorDashboardPage";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [mailId, setMailId] = useState("");
  const [hideSideNav, setHideSideNav] = useState(false);
  const [sideNavText, setSideNaveText] = useState("");

  const handleCallBack = (mail_id, access_Token, sideNav, sideNavText) => {
    setAccessToken(access_Token);
    setMailId(mail_id);
    setHideSideNav(sideNav);
    setSideNaveText(sideNavText);
  };

  return (
    <BrowserRouter>
      <TopNavigation mail_id={mailId} handleCallBack={handleCallBack} />
      <AppLayout
        content={
          <Routes>
            <Route
              path="/"
              element={<PatientLogin handleCallBack={handleCallBack} />}
            />
            {/* <Route path="/patientdashboard" element={<PatientDasboard />} /> */}
            <Route
              path="/patientdashboardpage"
              element={
                <PatientDashboardPage
                  access_Token={accessToken}
                  mail_id={mailId}
                />
              }
            />
            <Route
              path="/patientlogin"
              element={<PatientLogin handleCallBack={handleCallBack} />}
            />
            <Route
              path="/doctorlogin"
              element={<DoctorLogin handleCallBack={handleCallBack} />}
            />
            <Route
              path="/doctordashboardpage"
              element={
                <DoctorDashboardPage
                  access_Token={accessToken}
                  mail_id={mailId}
                />
              }
            />
          </Routes>
        }
        toolsHide={true}
        navigation={<SideNavigation sideNavText={sideNavText} />}
        navigationHide={!hideSideNav}
      />
    </BrowserRouter>
  );
}

export default App;
