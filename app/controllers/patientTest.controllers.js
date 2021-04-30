const PatientTest = require("../models/patientTest.models.js");

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   const patientTest = new PatientTest({
      patientId: req.body.patientId,
      createdBy: req.body.createdBy,
   });

   PatientTest.create(patientTest, (err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while creating the patientTest.",
         });
      else res.send(data);
   });
};

exports.findAll = (req, res) => {
   PatientTest.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while retrieving patientTest.",
         });
      else res.send(data);
   });
};

exports.findByPatientId = (req, res) => {
   PatientTest.getByPatientId(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found patientTest with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving patientTest with id " + req.params.id,
            });
         }
      } else
         res.send(
            data.tests.map((test) => {
               return {
                  idPatientTest: test.idPatientTest,
                  patientId: test.patientId,
                  createdAt: test.createdAt,
                  createdBy: test.createdBy,
                  userName: test.userName,
                  roleId: test.roleId,
                  results: data.results.filter(
                     (result) => result.patientTestId == test.idPatientTest
                  ),
               };
            })
         );
   });
};

exports.findBetweenTwoDates = (req, res) => {
   let queryTest = "";
   if (req.query.testId == 0) {
      queryTest += "1=1";
   } else {
      queryTest += `testId = ${req.query.testId}`;
   }
   PatientTest.getBetweenTwoDates(
      req.query.dateOne,
      req.query.dateTwo,
      queryTest,
      (err, data) => {
         if (err) {
            if (err.kind === "not_found") {
               res.status(404).send({
                  message: `Not found patientTest with date ${req.query.dateOne}.`,
               });
            } else {
               res.status(500).send({
                  message:
                     "Error retrieving patientTest with date " +
                     req.query.dateOne,
               });
            }
         } else res.send(data);
      }
   );
};

exports.findOne = (req, res) => {
   PatientTest.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found patientTest with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving patientTest with id " + req.params.id,
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

   PatientTest.updateById(
      req.params.id,
      new PatientTest(req.body),
      (err, data) => {
         if (err) {
            if (err.kind === "not_found") {
               res.status(404).send({
                  message: `Not found patientTest with id ${req.params.id}.`,
               });
            } else {
               res.status(500).send({
                  message:
                     "Error updating patientTest with id " + req.params.id,
               });
            }
         } else res.send(data);
      }
   );
};

exports.delete = (req, res) => {
   PatientTest.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found patientTest with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Could not delete patientTest with id " + req.params.id,
            });
         }
      } else res.send({ message: `patientTest was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   PatientTest.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while removing all patientTests.",
         });
      else res.send({ message: `All patientTests were deleted successfully!` });
   });
};
