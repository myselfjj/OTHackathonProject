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
  const [hidePresID, sethidePresID] = React.useState("");
  const [hideDocMailId, sethideDocMailId] = React.useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      await axios
        .post("http://localhost:3000/hideFromDoctor", {
          hidePresID,
          hideDocMailId,
        })
        .then((res) => {
          if (res.data == " Successfully Updated") {
            alert("Done");
          }
        })
        .catch((e) => {
          alert("wrong details");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
    sethideDocMailId("");
    sethidePresID("");
  }

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
    <Container
      header={
        <Header
          actions={
            <Popup
              trigger={<Button>Hide Prescription From Doctor</Button>}
              modal
              nested
            >
              {(close) => (
                <form>
                  <Form
                    actions={
                      <SpaceBetween direction="horizontal" size="xs">
                        <Button
                          formAction="none"
                          variant="link"
                          onClick={() => close()}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={(e) => {
                            // sethidePresID(element.prescriptionId);
                            submit(e);
                            close();
                          }}
                        >
                          Done
                        </Button>
                      </SpaceBetween>
                    }
                    // header={<Header variant="h1">Form header</Header>}
                  >
                    <Container
                      header={
                        <Header variant="h2">
                          Hide Prescription (ID:
                          {element.prescriptionId})
                        </Header>
                      }
                    >
                      <SpaceBetween direction="vertical" size="l">
                        <p>
                          <h4> Hidden From: </h4> {element.hideFromDoctorId}
                        </p>
                        <FormField label="Prescription ID">
                          <Input
                            value={hidePresID}
                            onChange={(event) =>
                              sethidePresID(event.detail.value)
                            }
                            ariaRequired
                            // disabled
                          />
                        </FormField>
                        <FormField label="Doctors email id">
                          <Input
                            value={hideDocMailId}
                            onChange={(event) =>
                              sethideDocMailId(event.detail.value)
                            }
                            ariaRequired
                          />
                        </FormField>
                      </SpaceBetween>
                    </Container>
                  </Form>
                </form>
              )}
            </Popup>
          }
        >
          {element.prescriptionName}
          <p>(ID:{element.prescriptionId})</p>
        </Header>
      }
    >
      <SpaceBetween size="l">
        {getPrescriptionDetails()}
        {getMedicineTable()}
      </SpaceBetween>
    </Container>
  );
};
