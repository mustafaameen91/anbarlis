module.exports = (app) => {
   const test = require("../controllers/test.controllers.js");

   app.post("/api/addTest", test.create);

   app.post("/api/createTest", test.createTest);

   app.get("/api/tests", test.findAll);

   app.get("/api/test/:id", test.findOne);

   app.get("/api/getTest/:id", test.findOneTest);

   app.put("/api/test/:id", test.update);

   app.delete("/api/test/:id", test.delete);

   app.delete("/api/tests", test.deleteAll);
};
