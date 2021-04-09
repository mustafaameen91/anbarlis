module.exports = (app) => {
   const patientResult = require("../controllers/patientResult.controllers.js");

   app.post("/api/addPatientResult", patientResult.create);

   app.get("/api/patientResults", patientResult.findAll);

   app.get("/api/patientResult/:id", patientResult.findOne);

   app.put("/api/patientResult/:id", patientResult.update);

   // app.delete("/api/patientResult/:id", patientResult.delete);

   app.delete("/api/patientResults", patientResult.deleteAll);
};
