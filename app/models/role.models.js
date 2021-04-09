const sql = require("./db.js");

const Role = function (role) {
   this.roleName = role.roleName;
};

Role.create = (newRole, result) => {
   sql.query("INSERT INTO role SET ?", newRole, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      console.log("created role: ", {
         id: res.insertId,
         ...newRole,
      });
      result(null, { id: res.insertId, ...newRole });
   });
};

Role.findById = (roleId, result) => {
   sql.query(`SELECT * FROM role WHERE idRole = ${roleId}`, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      if (res.length) {
         console.log("found role: ", res[0]);
         result(null, res[0]);
         return;
      }

      result({ kind: "not_found" }, null);
   });
};

Role.getAll = (result) => {
   sql.query("SELECT * FROM role", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("roles: ", res);
      result(null, res);
   });
};

Role.updateById = (id, role, result) => {
   sql.query(
      "UPDATE role SET roleName = ?  WHERE idRole = ?",
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

         console.log("updated role: ", { id: id, ...role });
         result(null, { id: id, ...role });
      }
   );
};

Role.remove = (id, result) => {
   sql.query("DELETE FROM role WHERE idRole = ?", id, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      if (res.affectedRows == 0) {
         result({ kind: "not_found" }, null);
         return;
      }

      console.log("deleted role with id: ", id);
      result(null, res);
   });
};

Role.removeAll = (result) => {
   sql.query("DELETE FROM role", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} role`);
      result(null, res);
   });
};

module.exports = Role;
