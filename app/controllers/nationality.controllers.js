const Nationality = require("../models/nationality.models.js");

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   const nationality = new Nationality({
      nationalName: req.body.nationalName,
   });

   Nationality.create(nationality, (err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while creating the nationality.",
         });
      else res.send(data);
   });
};

exports.findAll = (req, res) => {
   Nationality.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while retrieving nationality.",
         });
      else res.send(data);
   });
};

exports.findOne = (req, res) => {
   Nationality.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found nationality with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving nationality with id " + req.params.id,
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

   Nationality.updateById(
      req.params.id,
      new Nationality(req.body),
      (err, data) => {
         if (err) {
            if (err.kind === "not_found") {
               res.status(404).send({
                  message: `Not found nationality with id ${req.params.id}.`,
               });
            } else {
               res.status(500).send({
                  message:
                     "Error updating nationality with id " + req.params.id,
               });
            }
         } else res.send(data);
      }
   );
};

exports.delete = (req, res) => {
   Nationality.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found nationality with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Could not delete nationality with id " + req.params.id,
            });
         }
      } else res.send({ message: `nationality was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   Nationality.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while removing all nationalities.",
         });
      else
         res.send({ message: `All nationalities were deleted successfully!` });
   });
};
