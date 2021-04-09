const sql = require("./db.js");

const Photo = function (photo) {
   this.photoPath = photo.photoPath;
   this.patientId = photo.patientId;
   this.photoType = photo.photoType;
};

Photo.create = (newPhoto, result) => {
   sql.query("INSERT INTO photo SET ?", newPhoto, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      console.log("created photo: ", {
         id: res.insertId,
         ...newPhoto,
      });
      result(null, { id: res.insertId, ...newPhoto });
   });
};

Photo.findById = (photoId, result) => {
   sql.query(`SELECT * FROM photo WHERE idPhoto = ${photoId}`, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      if (res.length) {
         console.log("found photo: ", res[0]);
         result(null, res[0]);
         return;
      }

      result({ kind: "not_found" }, null);
   });
};

Photo.getAll = (result) => {
   sql.query("SELECT * FROM photo", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("nationalities: ", res);
      result(null, res);
   });
};

Photo.updateById = (id, photo, result) => {
   sql.query(
      "UPDATE photo SET photoPath = ? , patientName = ?   WHERE idPhoto = ?",
      [photo.photoPath, photo.patientId, id],
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

         console.log("updated photo: ", { id: id, ...photo });
         result(null, { id: id, ...photo });
      }
   );
};

Photo.remove = (id, result) => {
   sql.query("DELETE FROM photo WHERE idPhoto = ?", id, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      if (res.affectedRows == 0) {
         result({ kind: "not_found" }, null);
         return;
      }

      console.log("deleted photo with id: ", id);
      result(null, res);
   });
};

Photo.removeAll = (result) => {
   sql.query("DELETE FROM photo", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} photo`);
      result(null, res);
   });
};

module.exports = Photo;
