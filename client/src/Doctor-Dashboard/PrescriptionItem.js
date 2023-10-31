import * as React from "react";
import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import ExpandableSection from "@cloudscape-design/components/expandable-section";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import axios from "axios";

export default ({ element }) => {
  const getMedicineTable = () => {
    return (
      <ExpandableSection defaultExpanded headerText={"Medicines"}>
        <Table
          columnDefinitions={[
            {
              id: "medicine",
              header: "Medicine Name",
              cell: (e) => e.medicineName,
              isRowHeader: true,
            },
            {
              id: "dosage",
              header: "Dosage",
              cell: (e) => e.dosage,
            },
          ]}
          items={element.medicines}
          loadingText="Loading resources"
          trackBy="name"
          variant="embedded"
          stripedRows={true}
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No resources</b>
                <Button>Create resource</Button>
              </SpaceBetween>
            </Box>
          }
        />
      </ExpandableSection>
    );
  };

  const ValueWithLabel = ({ label, children }) => {
    return (
      <div>
        <Box variant="awsui-key-label">{label}</Box>
        <div>{children}</div>
      </div>
    );
  };

  const getPrescriptionDetails = () => {
    return (
      <ColumnLayout columns={3} variant="text-grid">
        <ValueWithLabel label={"Doctor Name"}>
          {element.doctorName}
        </ValueWithLabel>
        <ValueWithLabel label={"Date"}>
          {new Date(element.addedOn).toDateString()}
        </ValueWithLabel>
      </ColumnLayout>
    );
  };

  return (
    <Container header={<Header>{element.prescriptionName}</Header>}>
      <SpaceBetween size="l">
        {getPrescriptionDetails()}
        {getMedicineTable()}
      </SpaceBetween>
    </Container>
  );
};
