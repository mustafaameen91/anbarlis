const sql = require("./db.js");

const CertificateDocument = function (certificateDocument) {
   this.patientResultId = certificateDocument.patientResultId;
   this.certificatePath = certificateDocument.certificatePath;
};

CertificateDocument.create = (newCertificateDocument, result) => {
   sql.query(
      "INSERT INTO certificateDocument SET ?",
      newCertificateDocument,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         console.log("created certificateDocument: ", {
            idCertificateDocument: res.insertId,
            ...newCertificateDocument,
         });
         result(null, {
            idCertificateDocument: res.insertId,
            ...newCertificateDocument,
         });
      }
   );
};

CertificateDocument.findById = (certificateDocumentId, result) => {
   sql.query(
      `SELECT * FROM certificateDocument WHERE idCertificateDocument = ${certificateDocumentId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found certificateDocument: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

CertificateDocument.findByIdResult = (patientResultId, result) => {
   console.log(patientResultId);
   sql.query(
      `SELECT * FROM certificateDocument WHERE patientResultId = ${patientResultId}`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found certificateDocument: ", res[res.length - 1]);
            result(null, res[res.length - 1]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

CertificateDocument.getAll = (result) => {
   sql.query("SELECT * FROM certificateDocument", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("certificateDocument: ", res);
      result(null, res);
   });
};

CertificateDocument.updateById = (id, certificateDocument, result) => {
   sql.query(
      "UPDATE certificateDocument SET roleName = ?  WHERE idCertificateDocument = ?",
      [role.roleName, id],
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

         console.log("updated certificateDocument: ", {
            id: id,
            ...certificateDocument,
         });
         result(null, { id: id, ...certificateDocument });
      }
   );
};

CertificateDocument.remove = (id, result) => {
   sql.query(
      "DELETE FROM certificateDocument WHERE idCertificateDocument = ?",
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

         console.log("deleted certificateDocument with id: ", id);
         result(null, res);
      }
   );
};

CertificateDocument.removeAll = (result) => {
   sql.query("DELETE FROM certificateDocument", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} certificateDocument`);
      result(null, res);
   });
};

module.exports = CertificateDocument;
