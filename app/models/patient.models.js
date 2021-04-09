const sql = require("./db.js");

const Patient = function (patient) {
   this.name = patient.name;
   this.enName = patient.enName;
   this.email = patient.email;
   this.gender = patient.gender;
   this.dob = patient.dob;
   this.address = patient.address;
   this.phone = patient.phone;
   this.weight = patient.weight;
   this.height = patient.height;
   this.relationship = patient.relationship;
   this.nationalityId = patient.nationalityId;
   this.documentId = patient.documentId;
   this.smoker = patient.smoker;
   this.fasting = patient.fasting;
   this.munaId = patient.munaId;
   this.certificateNo = patient.certificateNo;
   this.createdBy = patient.createdBy;
};

Patient.create = (newPatient, result) => {
   sql.query("INSERT INTO patient SET ?", newPatient, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      console.log("created patient: ", {
         id: res.insertId,
         ...newPatient,
      });
      result(null, { id: res.insertId, ...newPatient });
   });
};

Patient.findById = (patientId, result) => {
   sql.query(
      `SELECT * FROM patient JOIN nationality LEFT JOIN photo ON photo.patientId = patient.idPatient AND nationality.idNationality = patient.nationalityId WHERE patient.idPatient = ${patientId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found patient: ", res);
            result(null, res);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

Patient.findAllPatientData = (numPerPage, limit, result) => {
   sql.query(`SELECT count(*) as numRows FROM patient`, (err, rows) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
      } else {
         var numRows = rows[0].numRows;
         var numPages = Math.ceil(numRows / numPerPage);
         sql.query(
            `SELECT * FROM patient JOIN nationality ON nationality.idNationality = patient.nationalityId ORDER BY patient.idPatient DESC LIMIT ${limit}`,
            (err, res) => {
               if (err) {
                  console.log("error: ", err);
                  result(null, err);
                  return;
               } else {
                  sql.query("SELECT * FROM photo", (err, resPhoto) => {
                     if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                     }
                     result(null, {
                        patients: res,
                        photos: resPhoto,
                        num: numPages,
                        total: numRows,
                     });
                  });
               }
            }
         );
      }
   });
};

Patient.findByDocumentId = (documentId, result) => {
   sql.query(
      `SELECT * FROM patient WHERE documentId = '${documentId}'`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found patient: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

Patient.getAllForProvider = (result) => {
   sql.query(
      `SELECT * FROM patient JOIN nationality ON nationality.idNationality = patient.nationalityId ORDER BY patient.idPatient DESC`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
         } else {
            sql.query("SELECT * FROM photo", (err, resPhoto) => {
               if (err) {
                  console.log("error: ", err);
                  result(null, err);
                  return;
               }
               result(null, {
                  patients: res,
                  photos: resPhoto,
               });
            });
         }
      }
   );
};

Patient.getAll = (result) => {
   sql.query("SELECT * FROM patient", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("nationalities: ", res);
      result(null, res);
   });
};

Patient.updateById = (id, patient, result) => {
   console.log(patient);
   sql.query(
      `UPDATE patient SET name = ? , enName = ? , email = ? , gender = ? , dob =? , address = ? , phone = ? , weight = ? , height = ? , relationship = ? , nationalityId = ? , documentId = ? , smoker = ? , fasting = ? , munaId = ? , certificateNo = ? , createdBy = ?  WHERE idPatient = ?`,
      [
         patient.name,
         patient.enName,
         patient.email,
         patient.gender,
         patient.dob,
         patient.address,
         patient.phone,
         patient.weight,
         patient.height,
         patient.relationship,
         patient.nationalityId,
         patient.documentId,
         patient.smoker,
         patient.fasting,
         patient.munaId,
         patient.certificateNo,
         patient.createdBy,
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

         console.log("updated patient: ", { id: id, ...patient });
         result(null, { id: id, ...patient });
      }
   );
};

Patient.updateMunaCertificate = (id, certificateNo, result) => {
   sql.query(
      "UPDATE patient SET certificateNo = ?  WHERE idPatient = ?",
      [certificateNo, id],
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

         console.log("updated patient: ", {
            id: id,
            certificateNo: certificateNo,
         });
         result(null, { id: id, certificateNo: certificateNo });
      }
   );
};

Patient.updateMunaId = (id, munaId, result) => {
   sql.query(
      "UPDATE patient SET munaId = ?  WHERE idPatient = ?",
      [munaId, id],
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

         console.log("updated patient: ", {
            id: id,
            munaId: munaId,
         });
         result(null, { id: id, munaId: munaId });
      }
   );
};

Patient.remove = (id, result) => {
   sql.query("DELETE FROM patient WHERE idPatient = ?", id, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      if (res.affectedRows == 0) {
         result({ kind: "not_found" }, null);
         return;
      }

      console.log("deleted patient with id: ", id);
      result(null, res);
   });
};

Patient.removeAll = (result) => {
   sql.query("DELETE FROM patients", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} patients`);
      result(null, res);
   });
};

module.exports = Patient;
