const sql = require("./db.js");

const TestOptions = function (testOptions) {
   this.testId = testOptions.testId;
   this.optionName = testOptions.optionName;
};

TestOptions.create = (newTestOptions, result) => {
   sql.query("INSERT INTO testOptions SET ?", newTestOptions, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      console.log("created testOptions: ", {
         id: res.insertId,
         ...newTestOptions,
      });
      result(null, { id: res.insertId, ...newTestOptions });
   });
};

TestOptions.findById = (testOptionsId, result) => {
   sql.query(
      `SELECT * FROM testOptions WHERE idTestOptions = ${testOptionsId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found testOptions: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

TestOptions.getAll = (result) => {
   sql.query("SELECT * FROM testOptions", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("testOptions: ", res);
      result(null, res);
   });
};

TestOptions.updateById = (id, testOptions, result) => {
   sql.query(
      "UPDATE testOptions SET optionName = ? , testId = ?   WHERE idTestOptions = ?",
      [testOptions.optionName, testOptions.testId, id],
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

         console.log("updated testOptions: ", { id: id, ...testOptions });
         result(null, { id: id, ...testOptions });
      }
   );
};

TestOptions.remove = (id, result) => {
   sql.query(
      "DELETE FROM testOptions WHERE idTestOptions = ?",
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

         console.log("deleted testOptions with id: ", id);
         result(null, res);
      }
   );
};

TestOptions.removeAll = (result) => {
   sql.query("DELETE FROM testOptions", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} testOptions`);
      result(null, res);
   });
};

module.exports = TestOptions;
