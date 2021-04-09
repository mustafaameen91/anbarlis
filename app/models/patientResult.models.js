const sql = require("./db.js");

const PatientResult = function (patientResult) {
   this.testId = patientResult.testId;
   this.patientTestId = patientResult.patientTestId;
   this.requested = patientResult.requested;
   this.collected = patientResult.collected;
   this.received = patientResult.received;
   this.perform = patientResult.perform;
   this.result = patientResult.result;
   this.quantity = patientResult.quantity;
   this.price = patientResult.price;
};

PatientResult.create = (newPatientResult, result) => {
   sql.query(
      "INSERT INTO patientResult SET ?",
      newPatientResult,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         console.log("created patientResult: ", {
            id: res.insertId,
            ...newPatientResult,
         });
         result(null, { id: res.insertId, ...newPatientResult });
      }
   );
};

PatientResult.findById = (patientResultId, result) => {
   sql.query(
      `SELECT * FROM patientResult WHERE idPatientResult = ${patientResultId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found patientResult: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

PatientResult.getAll = (result) => {
   sql.query("SELECT * FROM patientResult", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("nationalities: ", res);
      result(null, res);
   });
};

PatientResult.updateById = (id, patientResult, result) => {
   sql.query(
      "UPDATE patientResult SET  testId = ? , requested = ? , collected = ? , received = ? , perform = ? , result = ? , quantity = ? , price = ?   WHERE idPatientResult = ?",
      [
         patientResult.testId,
         patientResult.requested ? new Date(patientResult.requested) : null,
         patientResult.collected ? new Date(patientResult.collected) : null,
         patientResult.received ? new Date(patientResult.received) : null,
         patientResult.perform ? new Date(patientResult.perform) : null,
         patientResult.result,
         patientResult.quantity,
         patientResult.price,
         id,
      ],
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

         console.log("updated patientResult: ", { id: id, ...patientResult });
         result(null, { id: id, ...patientResult });
      }
   );
};

PatientResult.remove = (id, result) => {
   sql.query(
      "DELETE FROM patientResult WHERE idPatientResult = ?",
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

         console.log("deleted patientResult with id: ", id);
         result(null, res);
      }
   );
};

PatientResult.removeAll = (result) => {
   sql.query("DELETE FROM patientResult", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} patientResult`);
      result(null, res);
   });
};

module.exports = PatientResult;
