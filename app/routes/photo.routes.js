module.exports = (app) => {
   const photo = require("../controllers/photo.controllers.js");

   app.post("/api/addPhoto", photo.create);

   app.post("/api/upload", photo.check);

   app.get("/api/photos", photo.findAll);

   app.get("/api/photo/:id", photo.findOne);

   app.put("/api/photo/:id", photo.update);

   app.delete("/api/photo/:id", photo.delete);

   app.delete("/api/photos", photo.deleteAll);
};
