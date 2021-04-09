const sql = require("./db.js");

const TestRange = function (testRange) {
   this.testId = testRange.testId;
   this.fromAge = testRange.fromAge;
   this.toAge = testRange.toAge;
   this.normalFrom = testRange.normalFrom;
   this.normalTo = testRange.normalTo;
};

TestRange.create = (newTestRange, result) => {
   sql.query("INSERT INTO testRange SET ?", newTestRange, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      console.log("created testRange: ", {
         id: res.insertId,
         ...newTestRange,
      });
      result(null, { id: res.insertId, ...newTestRange });
   });
};

TestRange.findById = (testRangeId, result) => {
   sql.query(
      `SELECT * FROM testRange WHERE idTestRange = ${testRangeId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found testRange: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

TestRange.getAll = (result) => {
   sql.query("SELECT * FROM testRange", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("testRanges: ", res);
      result(null, res);
   });
};

TestRange.updateById = (id, testRange, result) => {
   sql.query(
      "UPDATE testRange SET fromAge = ? , toAge = ? , normalValue = ?   WHERE idTestRange = ?",
      [testRange.fromAge, testRange.toAge, testRange.normalValue, id],
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

         console.log("updated testRange: ", { id: id, ...testRange });
         result(null, { id: id, ...testRange });
      }
   );
};

TestRange.remove = (id, result) => {
   sql.query("DELETE FROM testRange WHERE idTestRange = ?", id, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      if (res.affectedRows == 0) {
         result({ kind: "not_found" }, null);
         return;
      }

      console.log("deleted testRange with id: ", id);
      result(null, res);
   });
};

TestRange.removeAll = (result) => {
   sql.query("DELETE FROM testRange", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} testRange`);
      result(null, res);
   });
};

module.exports = TestRange;
