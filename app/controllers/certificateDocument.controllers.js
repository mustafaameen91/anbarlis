const CertificateDocument = require("../models/certificateDocument.models.js");
const directory = require("./../../server");
const fs = require("fs");
const fetch = require("node-fetch");

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   const certificateDocument = new CertificateDocument({
      patientResultId: req.body.patientResultId,
      certificatePath: req.body.certificatePath,
   });

   CertificateDocument.create(certificateDocument, (err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while creating the certificateDocument.",
         });
      else res.send(data);
   });
};

exports.findAll = (req, res) => {
   CertificateDocument.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while retrieving certificateDocument.",
         });
      else res.send(data);
   });
};

exports.findOneByResultId = (req, res) => {
   CertificateDocument.findByIdResult(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found certificateDocument with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message:
                  "Error retrieving certificateDocument with id " +
                  req.params.id,
            });
         }
      } else {
         let fileName = data.certificatePath.split("/")[1];
         let fileData = fs.readFileSync(
            `${directory.directory}/app/${data.certificatePath}`,
            {
               encoding: "base64",
            }
         );

         let certificate = {
            fileName: fileName,
            pdf: fileData,
         };

         fetch("http://161.22.42.250/api/uploadQR", {
            method: "POST",
            body: JSON.stringify(certificate),
            headers: { "Content-Type": "application/json" },
         })
            .then((data2) => {
               res.send(data);
            })
            .catch((e) => {
               res.status(500).send({
                  message: "Error retrieving certificateDocument  ",
               });
            });
      }
   });
};

exports.findOne = (req, res) => {
   CertificateDocument.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found certificateDocument with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message:
                  "Error retrieving certificateDocument with id " +
                  req.params.id,
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

   CertificateDocument.updateById(
      req.params.id,
      new CertificateDocument(req.body),
      (err, data) => {
         if (err) {
            if (err.kind === "not_found") {
               res.status(404).send({
                  message: `Not found certificateDocument with id ${req.params.id}.`,
               });
            } else {
               res.status(500).send({
                  message:
                     "Error updating certificateDocument with id " +
                     req.params.id,
               });
            }
         } else res.send(data);
      }
   );
};

exports.delete = (req, res) => {
   CertificateDocument.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found certificateDocument with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message:
                  "Could not delete certificateDocument with id " +
                  req.params.id,
            });
         }
      } else
         res.send({ message: `certificateDocument was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   CertificateDocument.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while removing all certificateDocuments.",
         });
      else
         res.send({
            message: `All certificateDocuments were deleted successfully!`,
         });
   });
};
