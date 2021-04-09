const Test = require("../models/test.models.js");

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   const test = new Test({
      testName: req.body.testName,
      fixed: req.body.fixed,
      price: req.body.price,
   });

   Test.create(test, (err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while creating the test.",
         });
      else res.send(data);
   });
};

exports.createTest = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   if (req.body.fixed == 1) {
      Test.createOptionTest(req.body, (err, data) => {
         if (err)
            res.status(500).send({
               message:
                  err.message || "Some error occurred while creating the test.",
            });
         else res.send(data);
      });
   } else {
      Test.createNewTest(req.body, (err, data) => {
         if (err)
            res.status(500).send({
               message:
                  err.message || "Some error occurred while creating the test.",
            });
         else res.send(data);
      });
   }
};

exports.findAll = (req, res) => {
   Test.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving test.",
         });
      else
         res.send(
            data.tests.map((test) => {
               return {
                  idTest: test.idTest,
                  testName: test.testName,
                  fixed: test.fixed,
                  price: test.price,
                  options:
                     test.fixed == 0
                        ? data.ranges.filter(
                             (range) => range.testId == test.idTest
                          )
                        : data.options.filter(
                             (option) => option.testId == test.idTest
                          ),
               };
            })
         );
   });
};

exports.findOne = (req, res) => {
   Test.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found test with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving test with id " + req.params.id,
            });
         }
      } else res.send(data);
   });
};

exports.findOneTest = (req, res) => {
   Test.findByIdTest(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found test with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving test with id " + req.params.id,
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

   Test.updateById(req.params.id, new Test(req.body), (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found test with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error updating test with id " + req.params.id,
            });
         }
      } else res.send(data);
   });
};

exports.delete = (req, res) => {
   Test.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found test with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Could not delete test with id " + req.params.id,
            });
         }
      } else res.send({ message: `test was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   Test.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while removing all test.",
         });
      else res.send({ message: `All test were deleted successfully!` });
   });
};
