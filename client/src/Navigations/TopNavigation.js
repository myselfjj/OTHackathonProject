import * as React from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import PatientLogin from "../Login/PatientLogin";
import { useNavigate } from "react-router-dom";

export default (props) => {
  let navigate = useNavigate();
  const routeChange = () => {
    console.log("Sign out clicked");
    props.handleCallBack("", "", false, "");
    navigate("/doctorlogin");
  };
  return (
    <TopNavigation
      identity={{
        href: "#",
        title: "OT HealthCare",
        logo: {
          src: "https://www.clipartmax.com/png/small/58-586906_they-are-detail-oriented-and-understand-how-to-bring-hospital-icon-png.png",
          alt: "Service",
        },
      }}
      utilities={[
        {
          type: "menu-dropdown",
          text: props.mail_id,
          description: PatientLogin.user,
          iconName: "user-profile",
          onItemClick: routeChange,
          items: [
            {
              id: "signout",
              text: "Sign out",
            },
          ],
        },
      ]}
    />
  );
};
