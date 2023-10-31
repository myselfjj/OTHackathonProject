import * as React from "react";
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Badge from "@cloudscape-design/components/badge";

export default (props) => {
  const [activeHref, setActiveHref] = React.useState("#/page1");
  return (
    <SideNavigation
      activeHref={activeHref}
      header={{ href: "/", text: "HealthPrescribe" }}
      onFollow={(event) => {
        if (!event.detail.external) {
          event.preventDefault();
          setActiveHref(event.detail.href);
        }
      }}
      items={[
        {
          type: "link",
          text: props.sideNavText,
          href: "/patientDashboardPage",
        },
        { type: "divider" },
      ]}
    />
  );
};
