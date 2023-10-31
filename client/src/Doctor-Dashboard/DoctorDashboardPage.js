import * as React from "react";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import FormField from "@cloudscape-design/components/form-field";
import Box from "@cloudscape-design/components/box";
import Tabs from "@cloudscape-design/components/tabs";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Input from "@cloudscape-design/components/input";
import Popover from "@cloudscape-design/components/popover";
import StatusIndicator from "@cloudscape-design/components/status-indicator";
import OTPVerificationPopup from "./OptVerificationPopup";
import PrescriptionItem from "./PrescriptionItem";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import axios from "axios";

export default (props) => {
  const [patientData, setPatientData] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [presStatus, setPresStatus] = React.useState("");
  const [otpStatus, setOtpStatus] = React.useState("");
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const onSearch = () => {
    try {
      axios
        .get(`${BASE_URL}/patientData`, {
          params: { patientMailID: value },
        })
        .then((res) => {
          if (res.data != "") {
            setPatientData(res.data[0]);
            setStatus("Patient Found");
          } else setStatus("Patient Not Found!!");
          console.log(status);
          // console.log(patientData.prescription);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };

  const ValueWithLabel = ({ label, children }) => {
    return (
      <div>
        <Box variant="awsui-key-label">{label}</Box>
        <div>{children}</div>
      </div>
    );
  };

  const getDoctorDetails = () => {
    return (
      <ColumnLayout columns={3} variant="text-grid">
        <ValueWithLabel label={"Doctor's Name"}>Aqdas Abrar</ValueWithLabel>
        <ValueWithLabel label={"Doctor Id"}>{props.mail_id}</ValueWithLabel>
      </ColumnLayout>
    );
  };

  const getPatientPrescription = () => {
    return (
      <SpaceBetween size="xl">
        {console.log(patientData.prescription)}
        {patientData.prescription?.map((element) => {
          console.log(element);
          if (!element.hideFromDoctorId.includes(props.mail_id))
            return <PrescriptionItem element={element} />;
        })}
      </SpaceBetween>
    );
  };

  const patientFound = () => {
    return (
      <SpaceBetween size="xl">
        {otpStatus == "Success" ? getPatientPrescription() : ""}
      </SpaceBetween>
    );
  };
  const GetPatientDetails = () => {
    const [generatedOTP, setGeneratedOTP] = React.useState("");

    const generateOTP = () => {
      onSearch();
      const newOtp = Math.floor(10000 + Math.random() * 90000).toString();
      setGeneratedOTP(newOtp);
      handleSearchClick(newOtp);
    };
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const verifyOTP = (enteredOTP, generatedOTP) => {
      return enteredOTP === generatedOTP;
    };

    const handleVerifyOTP = (otp) => {
      const isValidOTP = verifyOTP(otp, generatedOTP);
      console.log(generatedOTP);
      console.log(otp);
      if (isValidOTP) {
        console.log("OTP is valid. Proceed with verification.");
        setOtpStatus("Success");
        return true;
      } else {
        console.log("Invalid OTP. Please try again.");
        setOtpStatus("Error");
        return false;
      }
    };

    const handleSearchClick = async (newOtp) => {
      try {
        axios
          .post(`${BASE_URL}/sendOtp`, {
            receiverEmail: value,
            otp: newOtp,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <SpaceBetween size="xl">
        <h2>Enter Patient Mail ID</h2>
        <Input
          onChange={({ detail }) => setValue(detail.value)}
          value={value}
          placeholder="Search"
          type="search"
        />
        <Popup
          trigger={
            <Button formAction="none" variant="search">
              Search
            </Button>
          }
          onOpen={generateOTP}
          modal
          nested
        >
          {(close) => (
            <OTPVerificationPopup
              onVerify={handleVerifyOTP}
              onClose={() => close()}
            />
          )}
        </Popup>
        {patientFound()}
        {/* {otpStatus ? onSearch() : ""} */}
      </SpaceBetween>
    );
  };

  const PrescriptionForm = () => {
    const [medicines, setMedicines] = React.useState([
      { medicineName: "", dosage: "" },
    ]);
    const [doctorName, setDoctorName] = React.useState("");
    const [patientMailID, setPatientMailID] = React.useState("");
    const [diseaseName, setDiseaseName] = React.useState("");
    const [showPopover, setShowPopover] = React.useState(false);
    const [isMedicineFilled, setIsMedicineFilled] = React.useState(false);
    const [isDosageFilled, setIsDosageFilled] = React.useState(false);
    const [status, setStatus] = React.useState("");

    const handleInputChange = (index, field, value) => {
      const updatedMedicines = [...medicines];
      updatedMedicines[index][field] = value;
      setMedicines(updatedMedicines);

      const medicineFilled = updatedMedicines[index].medicineName !== "";
      const dosageFilled = updatedMedicines[index].dosage !== "";
      setIsMedicineFilled(medicineFilled);
      setIsDosageFilled(dosageFilled);
    };

    const handleAddMedicine = () => {
      setMedicines([...medicines, { medicineName: "", dosage: "" }]);
    };

    const handleRemoveMedicine = (index) => {
      const updatedMedicines = medicines.filter((_, i) => i !== index);
      setMedicines(updatedMedicines);
    };

    const handleFormSubmit = (event) => {
      event.preventDefault();
      console.log(medicines);
      setShowPopover(true);
      try {
        axios
          .post(`${BASE_URL}/addPrescription`, {
            patientMailId: patientMailID,
            prescriptionName: diseaseName,
            addedOn: new Date().toISOString(),
            doctorName: doctorName,
            medicines: medicines,
          })
          .then((res) => {
            console.log("Prescription added successfully:", res.data);
            if (res.data == "1") setPresStatus("success");
            else setPresStatus("error");
          });
      } catch (error) {
        console.error("Error adding prescription:", error);
      }
      setTimeout(() => {
        // setShowPopover(false);
        setDiseaseName("");
        setMedicines([{ medicineName: "", dosage: "" }]);
      }, 5);
    };

    const isSubmitDisabled = medicines.some(
      (medicine) => medicine.medicineName === "" || medicine.dosage === ""
    );
    const isAddMoreMedicineDisabled = !isMedicineFilled || !isDosageFilled;

    return (
      <>
        <form onSubmit={handleFormSubmit}>
          <SpaceBetween size="l">
            <FormField
              description="Please Enter Your Name"
              label="Doctor's Name"
            >
              <Input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.detail.value)}
                placeholder="Your Name"
                required
              />
            </FormField>
            <FormField
              description="Enter unique Patient Mail ID"
              label="Patient Mail ID"
            >
              <Input
                type="text"
                value={patientMailID}
                onChange={(e) => setPatientMailID(e.detail.value)}
                placeholder="Patient Mail ID"
                required
              />
            </FormField>
            <FormField
              description="Short description of disease"
              label="Disease"
            >
              <Input
                type="text"
                value={diseaseName}
                onChange={(e) => setDiseaseName(e.detail.value)}
                placeholder="Disease Name"
                required
              />
            </FormField>
          </SpaceBetween>
          {medicines.map((medicine, index) => (
            <div
              key={index}
              style={{ marginBottom: "1rem", marginTop: "1rem" }}
            >
              <SpaceBetween size="l">
                <FormField>
                  <Input
                    type="text"
                    value={medicine.medicineName}
                    onChange={(e) =>
                      handleInputChange(index, "medicineName", e.detail.value)
                    }
                    placeholder="Medicine Name"
                  />
                </FormField>
                <FormField>
                  <Input
                    type="text"
                    value={medicine.dosage}
                    onChange={(e) =>
                      handleInputChange(index, "dosage", e.detail.value)
                    }
                    placeholder="Dosage"
                  />
                </FormField>
                {medicines.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => handleRemoveMedicine(index)}
                  >
                    Remove
                  </Button>
                )}
                {index === medicines.length - 1 && (
                  <Button
                    type="button"
                    onClick={handleAddMedicine}
                    style={{ marginTop: "0rem" }}
                    disabled={isAddMoreMedicineDisabled}
                  >
                    Add More Medicines
                  </Button>
                )}
              </SpaceBetween>
            </div>
          ))}
          <SpaceBetween size="l">
            <Button
              type="submit"
              style={{ marginTop: "1rem" }}
              disabled={isSubmitDisabled}
            >
              Submit
            </Button>
          </SpaceBetween>
        </form>
        {showPopover && (
          <Popover
            open={showPopover}
            // dismissButton={true}
            onClose={() => setShowPopover(false)}
            anchor={<Button>Show Popover</Button>}
            content={
              presStatus == "success"
                ? "Prescription Added Successfully"
                : "Patient Email ID Not Found!!"
            }
          >
            <StatusIndicator type={presStatus}>{presStatus}</StatusIndicator>
          </Popover>
        )}
      </>
    );
  };

  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <Header
            variant="h1"
            description="Search Patient and get their prescriptions details. Add new prescription to searched patient."
          >
            Doctor Dashboard
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
            content: getDoctorDetails(),
          },
          {
            label: <small>{"Search Patient"}</small>,
            id: "patients",
            content: GetPatientDetails(),
          },
          {
            label: <small>{"Add Prescription"}</small>,
            id: "prescription",
            content: PrescriptionForm(),
          },
        ]}
      />
    </ContentLayout>
  );
};
