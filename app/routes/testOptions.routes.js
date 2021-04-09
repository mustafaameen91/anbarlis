module.exports = (app) => {
   const testOptions = require("../controllers/testOptions.controllers.js");

   app.post("/api/addTestOption", testOptions.create);

   app.get("/api/testOptions", testOptions.findAll);

   app.get("/api/testOption/:id", testOptions.findOne);

   app.put("/api/testOption/:id", testOptions.update);

   app.delete("/api/testOption/:id", testOptions.delete);

   app.delete("/api/testOptions", testOptions.deleteAll);
};
