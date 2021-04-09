const sql = require("./db.js");

const User = function (user) {
   this.userName = user.userName;
   this.password = user.password;
   this.email = user.email;
   this.roleId = user.roleId;
};

User.create = (newUser, result) => {
   sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      console.log("created User: ", { id: res.insertId, ...newUser });
      result(null, { id: res.insertId, ...newUser });
   });
};

User.findById = (userId, result) => {
   sql.query(`SELECT * FROM user WHERE idUser = ${userId}`, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(err, null);
         return;
      }

      if (res.length) {
         console.log("found user: ", res[0]);
         result(null, res[0]);
         return;
      }

      result({ kind: "not_found" }, null);
   });
};

User.login = (userName, password, result) => {
   sql.query(
      `SELECT * FROM user JOIN role ON role.idRole = user.roleId WHERE user.userName = '${userName}' AND user.password = '${password}'`,
      (err, res) => {
         if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
         }

         if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
         }

         result({ kind: "not_found" }, null);
      }
   );
};

User.getAll = (result) => {
   sql.query("SELECT * FROM user", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log("users: ", res);
      result(null, res);
   });
};

User.updateById = (id, user, result) => {
   sql.query(
      "UPDATE user SET userName = ?, password = ? , email = ? ,roleId = ?  WHERE idUser = ?",
      [user.userName, user.password, user.email, user.roleId, id],
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

         console.log("updated user: ", { id: id, ...user });
         result(null, { id: id, ...user });
      }
   );
};

User.remove = (id, result) => {
   sql.query("DELETE FROM user WHERE idUser = ?", id, (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      if (res.affectedRows == 0) {
         result({ kind: "not_found" }, null);
         return;
      }

      console.log("deleted user with id: ", id);
      result(null, res);
   });
};

User.removeAll = (result) => {
   sql.query("DELETE FROM user", (err, res) => {
      if (err) {
         console.log("error: ", err);
         result(null, err);
         return;
      }

      console.log(`deleted ${res.affectedRows} user`);
      result(null, res);
   });
};

module.exports = User;
