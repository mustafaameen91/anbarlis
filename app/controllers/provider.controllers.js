const Provider = require("../models/provider.models.js");

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   const provider = new Provider({
      providerName: req.body.providerName,
   });

   Provider.create(provider, (err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while creating the provider.",
         });
      else res.send(data);
   });
};

exports.findAll = (req, res) => {
   Provider.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving provider.",
         });
      else res.send(data);
   });
};

exports.findOne = (req, res) => {
   Provider.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found provider with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving provider with id " + req.params.id,
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

   Provider.updateById(req.params.id, new Provider(req.body), (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found provider with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error updating provider with id " + req.params.id,
            });
         }
      } else res.send(data);
   });
};

exports.delete = (req, res) => {
   Provider.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found provider with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Could not delete provider with id " + req.params.id,
            });
         }
      } else res.send({ message: `provider was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   Provider.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while removing all providers.",
         });
      else res.send({ message: `All providers were deleted successfully!` });
   });
};
