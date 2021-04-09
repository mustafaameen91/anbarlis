const TestRange = require("../models/testRange.models.js");

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   const testRange = new TestRange({
      testId: req.body.testId,
      fromAge: req.body.fromAge,
      toAge: req.body.toAge,
      normalFrom: req.body.normalFrom,
      normalTo: req.body.normalTo,
   });

   TestRange.create(testRange, (err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while creating the testRange.",
         });
      else res.send(data);
   });
};

exports.findAll = (req, res) => {
   TestRange.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving testRange.",
         });
      else res.send(data);
   });
};

exports.findOne = (req, res) => {
   TestRange.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found testRange with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving testRange with id " + req.params.id,
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

   TestRange.updateById(req.params.id, new TestRange(req.body), (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found testRange with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error updating testRange with id " + req.params.id,
            });
         }
      } else res.send(data);
   });
};

exports.delete = (req, res) => {
   TestRange.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found testRange with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Could not delete testRange with id " + req.params.id,
            });
         }
      } else res.send({ message: `testRange was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   TestRange.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while removing all testRanges.",
         });
      else res.send({ message: `All testRanges were deleted successfully!` });
   });
};
