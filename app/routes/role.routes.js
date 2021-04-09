module.exports = (app) => {
   const role = require("../controllers/role.controllers.js");

   app.post("/api/addRole", role.create);

   app.get("/api/roles", role.findAll);

   app.get("/api/role/:id", role.findOne);

   app.put("/api/role/:id", role.update);

   app.delete("/api/role/:id", role.delete);

   app.delete("/api/roles", role.deleteAll);
};
