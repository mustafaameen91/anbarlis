const sql = require("./db.js");

const Nationality = function (nationality) {
   this.nationalName = nationality.nationalName;
};

Nationality.create = (newNationality, result) => {
   sql.query("INSERT INTO nationality SET ?", newNationality, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      console.log("created nationality: ", {
         id: res.insertId,
         ...newNationality,
      });
      result(null, { id: res.insertId, ...newNationality });
   });
};

Nationality.findById = (nationalityId, result) => {
   sql.query(
      `SELECT * FROM nationality WHERE idNationality = ${nationalityId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found nationality: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

Nationality.findByNationalityName = (nationalName, result) => {
   sql.query(
      `SELECT * FROM nationality WHERE nationalName = '${nationalName}'`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found nationality: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

Nationality.getAll = (result) => {
   sql.query("SELECT * FROM nationality", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("nationalities: ", res);
      result(null, res);
   });
};

Nationality.updateById = (id, nationality, result) => {
   sql.query(
      "UPDATE nationality SET nationalName = ?  WHERE idNationality = ?",
      [nationality.nationalName, id],
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

         console.log("updated nationality: ", { id: id, ...nationality });
         result(null, { id: id, ...nationality });
      }
   );
};

Nationality.remove = (id, result) => {
   sql.query(
      "DELETE FROM nationality WHERE idNationality = ?",
      id,
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

         console.log("deleted nationality with id: ", id);
         result(null, res);
      }
   );
};

Nationality.removeAll = (result) => {
   sql.query("DELETE FROM nationality", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} nationality`);
      result(null, res);
   });
};

module.exports = Nationality;
