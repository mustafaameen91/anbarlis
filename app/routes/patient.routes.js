module.exports = (app) => {
   const patient = require("../controllers/patient.controllers.js");

   app.post("/api/addPatient", patient.create);

   app.post("/api/addPatientForPhone", patient.createForPhone);

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

// CHECK IF PASSPORT EXISTS
// axios.get('https://api.munahealth.com/identities?filter[passport]=' + this.data.documentId)
// .then(async res => {
//    let ptnt = res.data.data;
//    if (ptnt.length > 0) {
//     this.data.munaId = ptnt[0].attributes.address
//     this.saveToDb()
//    } else {
//     axios
//     .post(munaApi + "identities", JSON.stringify(munaData))
//     .then((response) => {
//        this.data.munaId = response.data.data.id
//        this.saveToDb()
//     })
//     .catch((error) => {
//        console.log(error);
//     })
//    }
//  }).finally(async () => {
//   await loading.dismiss();
//  });
