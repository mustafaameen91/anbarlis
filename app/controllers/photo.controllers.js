const Photo = require("../models/photo.models.js");
const directory = require("./../../server");

function generateRandomName(length, patientId) {
   var result = "";
   var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result +=
         characters.charAt(Math.floor(Math.random() * charactersLength)) +
         patientId;
   }
   return result;
}

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   if (req.files) {
      let photoName = generateRandomName(5, 3);
      var file = req.files.document;
      var filename = file.name;
      var ext = filename.substr(filename.lastIndexOf(".") + 1);

      file.mv(
         directory.directory + "/app/photos/" + `${photoName}.${ext}`,
         function (err) {
            if (err) {
               console.log(err);
               res.status(401).send("unable to upload file");
            } else {
               const photo = new Photo({
                  photoPath: `image/${photoName}.${ext}`,
                  patientId: req.body.patientId,
                  photoType: req.body.photoType,
               });
               Photo.create(photo, (err, data) => {
                  if (err)
                     res.status(500).send({
                        message:
                           err.message ||
                           "Some error occurred while creating the photo.",
                     });
                  else res.send(data);
               });
            }
         }
      );
   }
};

exports.findAll = (req, res) => {
   Photo.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving photo.",
         });
      else res.send(data);
   });
};

exports.check = (req, res) => {
   var base64Data = req.body.image._imageAsDataUrl.replace(
      /^data:image\/jpeg;base64,/,
      ""
   );

   require("fs").writeFile(
      `./app/photos/${generateRandomName(5, 3)}.jpeg`,
      base64Data,
      "base64",
      function (err, data) {
         if (err) {
            console.log(err);
         } else {
            console.log(data);
         }
      }
   );
   res.send({ message: "ok" });
};

exports.findOne = (req, res) => {
   Photo.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found photo with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving photo with id " + req.params.id,
            });
         }
      } else res.writeHead(200, { "content-type": "image/jpg" });
   });
};

exports.update = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   Photo.updateById(req.params.id, new Photo(req.body), (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found photo with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error updating photo with id " + req.params.id,
            });
         }
      } else res.send(data);
   });
};

exports.delete = (req, res) => {
   Photo.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found photo with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Could not delete photo with id " + req.params.id,
            });
         }
      } else res.send({ message: `photo was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   Photo.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while removing all photos.",
         });
      else res.send({ message: `All photos were deleted successfully!` });
   });
};
