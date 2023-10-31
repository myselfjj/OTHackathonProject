export const DummyPatientDetails = {
  patientId: "12345",
  name: "Jayesh Jadhav",
  prescription: [
    {
      prescriptionName: "FLU",
      addedOn: "2023-10-01T12:25:05.509Z",
      doctorId: "687",
      doctorName: "John Doe",
      hideFromDoctorId: ["677"],
      medicines: [
        {
          name: "aspirin",
          dosage: "daily - 2 times after lunch/dinner",
        },
        {
          name: "paracetamol",
          dosage: "daily - 2 times after lunch/dinner",
        },
      ],
    },
    {
      prescriptionName: "Dengue",
      addedOn: "2023-10-02T12:25:05.509Z",
      doctorId: "687",
      doctorName: "John Doe",
      hideFromDoctorId: ["677"],
      medicines: [
        {
          name: "DOLO 360",
          dosage: "daily - 2 times after lunch/dinner",
        },
        {
          name: "paracetamol",
          dosage: "daily - 2 times after lunch/dinner",
        },
      ],
    },
  ],
};
