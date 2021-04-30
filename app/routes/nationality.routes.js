module.exports = (app) => {
   const nationality = require("../controllers/nationality.controllers.js");

   app.post("/api/addNationality", nationality.create);

   app.get("/api/nationalities", nationality.findAll);

   app.get("/api/nationality/:id", nationality.findOne);

   app.get("/api/nationalityName/:name", nationality.getOneByNationalityName);

   app.put("/api/nationality/:id", nationality.update);

   app.delete("/api/nationality/:id", nationality.delete);

   app.delete("/api/nationalities", nationality.deleteAll);
};
