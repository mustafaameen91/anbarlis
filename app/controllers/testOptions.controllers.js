const TestOptions = require("../models/testOptions.models.js");

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   const testOptions = new TestOptions({
      testId: req.body.testId,
      optionName: req.body.optionName,
   });

   TestOptions.create(testOptions, (err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while creating the testOptions.",
         });
      else res.send(data);
   });
};

exports.findAll = (req, res) => {
   TestOptions.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while retrieving testOptions.",
         });
      else res.send(data);
   });
};

exports.findOne = (req, res) => {
   TestOptions.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found testOptions with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving testOptions with id " + req.params.id,
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

   TestOptions.updateById(
      req.params.id,
      new TestOptions(req.body),
      (err, data) => {
         if (err) {
            if (err.kind === "not_found") {
               res.status(404).send({
                  message: `Not found testOptions with id ${req.params.id}.`,
               });
            } else {
               res.status(500).send({
                  message:
                     "Error updating testOptions with id " + req.params.id,
               });
            }
         } else res.send(data);
      }
   );
};

exports.delete = (req, res) => {
   TestOptions.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found testOptions with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Could not delete testOptions with id " + req.params.id,
            });
         }
      } else res.send({ message: `testOptions was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   TestOptions.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while removing all testOptions.",
         });
      else res.send({ message: `All testOptions were deleted successfully!` });
   });
};
