module.exports = (app) => {
   const testRange = require("../controllers/testRange.controllers.js");

   app.post("/api/addTestRange", testRange.create);

   app.get("/api/testRanges", testRange.findAll);

   app.get("/api/testRange/:id", testRange.findOne);

   app.put("/api/testRange/:id", testRange.update);

   app.delete("/api/testRange/:id", testRange.delete);

   app.delete("/api/testRanges", testRange.deleteAll);
};
