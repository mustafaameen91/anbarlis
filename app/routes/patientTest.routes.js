module.exports = (app) => {
   const patientTest = require("../controllers/patientTest.controllers.js");

   app.post("/api/addPatientTest", patientTest.create);

   app.get("/api/patientTests", patientTest.findAll);

   app.get("/api/patientTest/:id", patientTest.findOne);

   app.get("/api/patientTestId/:id", patientTest.findByPatientId);

   app.get("/api/income", patientTest.findBetweenTwoDates);

   app.put("/api/patientTest/:id", patientTest.update);

   app.delete("/api/patientTest/:id", patientTest.delete);

   app.delete("/api/patientTests", patientTest.deleteAll);
};
