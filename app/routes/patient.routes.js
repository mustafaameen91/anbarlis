module.exports = (app) => {
   const patient = require("../controllers/patient.controllers.js");

   app.post("/api/addPatient", patient.create);

   app.get("/api/allPatients", patient.findAll);

   app.get("/api/patients", patient.findPatientInformation);

   app.get("/api/patientProvider", patient.findAllForProvider);

   app.post("/api/certificateResult", patient.findTestPhoto);

   app.get("/api/patient/:id", patient.findOne);

   app.put("/api/patient/:id", patient.update);

   app.put("/api/patientCertificate/:id", patient.updateForCertificate);

   app.put("/api/patientMunaId/:id", patient.updateForMunaId);

   app.delete("/api/patient/:id", patient.delete);

   app.delete("/api/patients", patient.deleteAll);
};
