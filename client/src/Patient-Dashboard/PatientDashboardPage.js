import * as React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";
import Alert from "@cloudscape-design/components/alert";
import Box from "@cloudscape-design/components/box";
import Tabs from "@cloudscape-design/components/tabs";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import { DummyPatientDetails } from "../data-type/patient";
import { useEffect } from "react";
import PrescriptionItem from "./PrescriptionItem";
import axios from "axios";

export default (props) => {
  const [patientData, setPatientData] = React.useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/patientData`, {
        params: { patientMailID: props.mail_id },
      })
      .then((res) => {
        setPatientData(res.data[0]);
        console.log(patientData.prescription);
      });
  }, []);

  const ValueWithLabel = ({ label, children }) => {
    return (
      <div>
        <Box variant="awsui-key-label">{label}</Box>
        <div>{children}</div>
      </div>
    );
  };

  const getPatientDetails = () => {
    return (
      <ColumnLayout columns={3} variant="text-grid">
        <ValueWithLabel label={"Patient's Name"}>
          {patientData.patientName}
        </ValueWithLabel>
        <ValueWithLabel label={"Patient Id"}>
          {patientData.patientId}
        </ValueWithLabel>
      </ColumnLayout>
    );
  };

  const getPatientDocuments = () => {
    return null;
  };

  const getPatientPrescription = () => {
    return (
      <SpaceBetween size="xl">
        {console.log(patientData.prescription)}
        {patientData.prescription?.map((element) => {
          console.log(element);
          return <PrescriptionItem element={element} />;
        })}
      </SpaceBetween>
    );
  };

  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description="See the details about patient and download documents and prescription assigned by doctors."
          >
            Patient Dashboard
          </Header>
        </SpaceBetween>
      }
    >
      <Tabs
        variant="container"
        tabs={[
          {
            label: <small>{"Details"}</small>,
            id: "details",
            content: getPatientDetails(),
          },
          {
            label: <small>{"Documents"}</small>,
            id: "documents",
            content: "Second tab content area",
          },
          {
            label: <small>{"Prescription"}</small>,
            id: "prescription",
            content: getPatientPrescription(),
          },
        ]}
      />
    </ContentLayout>
  );
};
