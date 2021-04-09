const sql = require("./db.js");

const Provider = function (provider) {
   this.providerName = provider.providerName;
};

Provider.create = (newProvider, result) => {
   sql.query("INSERT INTO provider SET ?", newProvider, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      console.log("created provider: ", {
         id: res.insertId,
         ...newProvider,
      });
      result(null, { id: res.insertId, ...newProvider });
   });
};

Provider.findById = (providerId, result) => {
   sql.query(
      `SELECT * FROM provider WHERE idProvider = ${providerId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found provider: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

Provider.getAll = (result) => {
   sql.query("SELECT * FROM provider", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("nationalities: ", res);
      result(null, res);
   });
};

Provider.updateById = (id, provider, result) => {
   sql.query(
      "UPDATE provider SET providerName = ?  WHERE idProvider = ?",
      [provider.providerName, id],
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
         }

         if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return;
         }

         console.log("updated provider: ", { id: id, ...provider });
         result(null, { id: id, ...provider });
      }
   );
};

Provider.remove = (id, result) => {
   sql.query("DELETE FROM provider WHERE idProvider = ?", id, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      if (res.affectedRows == 0) {
         result({ kind: "not_found" }, null);
         return;
      }

      console.log("deleted provider with id: ", id);
      result(null, res);
   });
};

Provider.removeAll = (result) => {
   sql.query("DELETE FROM provider", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} provider`);
      result(null, res);
   });
};

module.exports = Provider;
