const Role = require("../models/role.models.js");

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   const role = new Role({
      roleName: req.body.roleName,
   });

   Role.create(role, (err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while creating the role.",
         });
      else res.send(data);
   });
};

exports.findAll = (req, res) => {
   Role.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving role.",
         });
      else res.send(data);
   });
};

exports.findOne = (req, res) => {
   Role.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found role with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving role with id " + req.params.id,
            });
         }
      } else res.send(data);
   });
};

exports.update = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   Role.updateById(req.params.id, new Role(req.body), (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found role with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error updating role with id " + req.params.id,
            });
         }
      } else res.send(data);
   });
};

exports.delete = (req, res) => {
   Role.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found role with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Could not delete role with id " + req.params.id,
            });
         }
      } else res.send({ message: `role was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   Role.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while removing all roles.",
         });
      else res.send({ message: `All roles were deleted successfully!` });
   });
};
