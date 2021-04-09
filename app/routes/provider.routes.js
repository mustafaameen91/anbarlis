module.exports = (app) => {
   const provider = require("../controllers/provider.controllers.js");

   app.post("/api/addProvider", provider.create);

   app.get("/api/providers", provider.findAll);

   app.get("/api/provider/:id", provider.findOne);

   app.put("/api/provider/:id", provider.update);

   app.delete("/api/provider/:id", provider.delete);

   app.delete("/api/providers", provider.deleteAll);
};
