module.exports = (app) => {
   const certificateDocument = require("../controllers/certificateDocument.controllers.js");

   app.post("/api/addCertificateDocument", certificateDocument.create);

   app.get("/api/certificateDocuments", certificateDocument.findAll);

   app.get("/api/certificateDocument/:id", certificateDocument.findOne);

   app.get("/api/uploadCertificate/:id", certificateDocument.findOneByResultId);

   app.put("/api/certificateDocument/:id", certificateDocument.update);

   app.delete("/api/certificateDocument/:id", certificateDocument.delete);

   app.delete("/api/certificateDocuments", certificateDocument.deleteAll);
};
