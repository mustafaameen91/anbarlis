const sql = require("./db.js");

const PatientTest = function (patientTest) {
   this.patientId = patientTest.patientId;
   this.createdBy = patientTest.createdBy;
};

PatientTest.create = (newPatientTest, result) => {
   sql.query("INSERT INTO patientTest SET ?", newPatientTest, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      console.log("created patientTest: ", {
         idPatientTest: res.insertId,
         ...newPatientTest,
      });
      result(null, { id: res.insertId, ...newPatientTest });
   });
};

PatientTest.getByPatientId = (patientId, result) => {
   sql.query(
      `SELECT * FROM patientTest JOIN user ON patientTest.createdBy = user.idUser WHERE patientId = ${patientId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            sql.query(
               `SELECT * FROM patientResult JOIN test ON test.idTest = patientResult.testId`,
               (err, resResult) => {
                  if (err) {
                     console.log("error: ", err);
                     result(err, null);
                     return;
                  }
                  console.log("found patientResult: ", resResult);
                  result(null, { tests: res, results: resResult });
               }
            );
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

PatientTest.getBetweenTwoDates = (dateOne, DateTwo, testId, result) => {
   sql.query(
      `SELECT * FROM patientResult JOIN patientTest JOIN test JOIN patient JOIN user ON patientTest.idPatientTest = patientResult.patientTestId AND test.idTest = patientResult.testId AND patient.idPatient = patientTest.patientId AND user.idUser = patientTest.createdBy WHERE (DATE(patientResult.requested) BETWEEN DATE('${dateOne}') AND DATE('${DateTwo}')) AND ${testId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found patientResult: ", res);
            result(null, res);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

PatientTest.findById = (patientTestId, result) => {
   sql.query(
      `SELECT * FROM patientTest WHERE idPatientTest = ${patientTestId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found patientTest: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

PatientTest.getAll = (result) => {
   sql.query("SELECT * FROM patientTest", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("nationalities: ", res);
      result(null, res);
   });
};

PatientTest.updateById = (id, patientTest, result) => {
   sql.query(
      "UPDATE patientTest SET patientId = ? ,  createdBy = ?   WHERE idPatientTest = ?",
      [patientTest.patientId, patientTest.createdBy, id],
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

         console.log("updated patientTest: ", { id: id, ...patientTest });
         result(null, { id: id, ...patientTest });
      }
   );
};

PatientTest.remove = (id, result) => {
   sql.query(
      "DELETE FROM patientTest WHERE idPatientTest = ?",
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
         sql.query(
            `DELETE FROM patientResult WHERE patientTestId = ${id}`,
            (err, resResult) => {
               if (err) {
                  console.log("error: ", err);
                  result(null, err);
                  return;
               }

               if (res.affectedRows == 0) {
                  result({ kind: "not_found" }, null);
                  return;
               }
               console.log("deleted patientTest with id: ", id);
               result(null, res);
            }
         );
      }
   );
};

PatientTest.removeAll = (result) => {
   sql.query("DELETE FROM patientTest", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} patientTest`);
      result(null, res);
   });
};

module.exports = PatientTest;
