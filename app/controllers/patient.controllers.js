const Patient = require("../models/patient.models.js");
const CertificateDocument = require("../models/certificateDocument.models.js");
const Photo = require("../models/photo.models.js");
const directory = require("./../../server");
const fs = require("fs");
const html_to_pdf = require("html-pdf-node");
const bwipjs = require("bwip-js");
const path = require("path");

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

function extractData(photo) {
   if (photo) {
      return {
         photoPath: photo.photoPath,
      };
   } else {
      return {
         photoPath: null,
      };
   }
}

exports.create = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }
   console.log(req.body);
   let patientData = JSON.parse(req.body.patient);

   Patient.findByDocumentId(req.body.patient.documentId, (err, data) => {
      if (err.kind === "not_found") {
         const patient = new Patient({
            name: patientData.name,
            enName: patientData.enName,
            email: patientData.email,
            gender: patientData.gender,
            dob: patientData.dob,
            address: patientData.address,
            phone: patientData.phone,
            weight: patientData.weight,
            height: patientData.height,
            relationship: patientData.relationship,
            nationalityId: patientData.nationalityId,
            documentId: patientData.documentId,
            smoker: patientData.smoker,
            fasting: patientData.fasting,
            munaId: patientData.munaId,
            certificateNo: patientData.certificateNo,
            createdBy: patientData.createdBy,
         });

         Patient.create(patient, (err, data) => {
            if (err) {
               res.status(500).send({
                  message:
                     err.message ||
                     "Some error occurred while creating the patient.",
               });
            } else {
               if (req.files) {
                  let photoName = generateRandomName(6, 3);
                  var file = req.files.document;
                  var filename = file.name;
                  var ext = filename.substr(filename.lastIndexOf(".") + 1);

                  file.mv(
                     directory.directory +
                        "/app/documents/" +
                        `${photoName}.${ext}`,
                     function (err) {
                        if (err) {
                           console.log(err);
                           res.status(401).send("unable to upload file");
                        } else {
                           const photo = new Photo({
                              photoPath: `documents/${photoName}.${ext}`,
                              patientId: data.id,
                              photoType: 1,
                           });
                           Photo.create(photo, (err, data) => {
                              if (err)
                                 res.status(500).send({
                                    message:
                                       err.message ||
                                       "Some error occurred while creating the photo.",
                                 });
                           });
                           if (req.body.image) {
                              var base64Data = req.body.image.replace(
                                 /^data:image\/jpeg;base64,/,
                                 ""
                              );

                              require("fs").writeFile(
                                 `./app/photos/${data.id}.jpeg`,
                                 base64Data,
                                 "base64",
                                 function (err) {
                                    if (err) {
                                       console.log(err);
                                    } else {
                                       const photo = new Photo({
                                          photoPath: `image/${data.id}.jpeg`,
                                          patientId: data.id,
                                          photoType: 0,
                                       });

                                       Photo.create(photo, (err, data) => {
                                          if (err)
                                             res.status(500).send({
                                                message:
                                                   err.message ||
                                                   "Some error occurred while upload the photo.",
                                             });
                                       });
                                    }
                                 }
                              );
                           }
                        }
                     }
                  );
               } else if (req.body.image) {
                  var base64Data = req.body.image.replace(
                     /^data:image\/jpeg;base64,/,
                     ""
                  );

                  require("fs").writeFile(
                     `./app/photos/${data.id}.jpeg`,
                     base64Data,
                     "base64",
                     function (err) {
                        if (err) {
                           console.log(err);
                        } else {
                           const photo = new Photo({
                              photoPath: `image/${data.id}.jpeg`,
                              patientId: data.id,
                              photoType: 0,
                           });

                           Photo.create(photo, (err, data) => {
                              if (err)
                                 res.status(500).send({
                                    message:
                                       err.message ||
                                       "Some error occurred while upload the photo.",
                                 });
                           });
                        }
                     }
                  );
               }
               res.send(data);
            }
         });
      } else {
         res.status(403).send({
            message: "this patient is already exist",
         });
      }
   });
};

exports.findAllForProvider = (req, res) => {
   Patient.getAllForProvider((err, data) => {
      if (err) {
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving patient.",
         });
      }
      let patients = data.patients.map((pat) => {
         return {
            idPatient: pat.idPatient,
            name: pat.name,
            enName: pat.enName,
            email: pat.email,
            gender: pat.gender,
            dob: pat.dob,
            address: pat.address,
            phone: pat.phone,
            weight: pat.weight,
            height: pat.height,
            relationship: pat.relationship,
            nationalityId: pat.nationalityId,
            nationalName: pat.nationalName,
            documentId: pat.documentId,
            smoker: pat.smoker,
            fasting: pat.fasting,
            munaId: pat.munaId,
            certificateNo: pat.certificateNo,
            createdAt: pat.createdAt,
            documentPhoto: data.photos.filter(
               (photo) =>
                  photo.patientId == pat.idPatient && photo.photoType == 1
            )[0],
            image: data.photos.filter(
               (photo) =>
                  photo.patientId == pat.idPatient && photo.photoType == 0
            )[0],
         };
      });
      res.send(patients);
   });
};

exports.findAll = (req, res) => {
   Patient.getAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving patient.",
         });
      else res.send(data);
   });
};

exports.findTestPhoto = async (req, res) => {
   try {
      let reportName = generateRandomName(6, 5);

      let resultData;
      if (req.body.result == "positive") {
         resultData = "مصاب";
      } else {
         resultData = "غير مصاب";
      }

      let colorResult;

      if (req.body.result == "positive") {
         colorResult = "rgb(223, 68, 68)";
      } else {
         colorResult = "rgb(13, 148, 85)";
      }

      bwipjs.toBuffer(
         {
            bcid: "qrcode",
            text: `https://smartlis.co/api/certificates/${reportName}.pdf`,
            scale: 4,
            height: 10,
            width: 10,
            includetext: false,
            textxalign: "center",
         },
         async function (err, png) {
            if (err) {
               console.log(err);
            } else {
               let options = { format: "A4", printBackground: true };
               let logoImage = fs.readFileSync(
                  path.join(__dirname, "logo.png"),
                  {
                     encoding: "base64",
                  }
               );
               let bgImage = fs.readFileSync(path.join(__dirname, "bg.jpeg"), {
                  encoding: "base64",
               });

               let file = {
                  content: `<style>*{font-family:Arial, Helvetica, sans-serif; !important}body{border : 1px solid; padding : 10px}</style><div style="background-image: url('data:image/jpeg;base64,${bgImage}');background-size: cover;background-position: center;background-repeat: no-repeat;">
                  <header style="display:flex;direction: rtl;margin-bottom:20px;">
         <div style="flex-grow: 1;text-align: center;">
             <h4 style="font-size: 14px;margin: 4px 0px;font-family:'arial'">جمهورية العراق</h4>
             <h4 style="font-size: 14px;margin: 4px 0px;font-family:'arial'">وزارة الصحة / البيئة</h4>
             <h4 style="font-size: 14px;margin: 4px 0px;font-family:'arial'">Ministry of Health / Environment</h4>
             <h4 style="font-size: 14px;margin: 4px 0px;font-family:'arial'">Department of Popular Medical Clinics</h4>
             <div style="height: 10px;"></div>
             <h4 style="font-size: 14px;margin: 4px 0px;font-family:'arial'">شهادة صحية</h4>
             <h4 style="font-size: 14px;margin: 4px 0px;font-family:'arial'">لفحص مسحة فايروس كورونا المستجد</h4>
             <h6 style="font-size: 14px;margin: 3px 0px;font-family:'arial'">لقد تم منح هذه الشهادة بناء على رغبة الشخص ، دون اي مسؤولية من الجهة</h6>
             <h6 style="font-size: 14px;margin: 3px 0px;font-family:'arial'">المانحة</h6>
         </div>
         <div style="flex-grow: 1;text-align: center;"><img src="data:image/png;base64,${logoImage}" width="120"></div>
         <div style="flex-grow: 1;text-align: center;">
             <div style="height: 10px;"></div>
             <h4 style="font-size: 14px;margin: 4px 0px;font-family:'arial'">مختبر الصحة العامة / وحدة كوفيد19</h4>
             <h4 style="font-size: 14px;margin: 4px 0px;font-family:'arial'">المختبر مجاز من قبل وزارة الصحة العراقية</h4>
             <div style="height: 20px;"></div>
             <h4 style="font-size: 14px;margin: 4px 0px;">Health Certificate</h4>
             <h4 style="direction: ltr;font-size: 14px;margin: 4px 0px;font-family:'arial'">2019 Novel Coronavirus Test</h4>
             <h6 style="font-size: 14px;margin: 3px 0px;font-family:'arial'">this certificate has been granted to the person upon their personal</h6>
             <h6 style="font-size: 14px;margin: 3px 0px;font-family:'arial'">request to whom it may concern and MOH is not responsible for any</h6>
             <h6 style="font-size: 14px;margin: 3px 0px;font-family:'arial'">consequences resulting from this</h6>
         </div>
     </header>
     <div style="border: 2px solid #464646;margin: 0px 20px;">
         
         <div style="border-bottom:2px solid #464646;padding: 10px;">
             <div style="display: flex;">
                 <div style="flex-grow: 1;padding: 5px;"><span>Full Name : </span><span style="font-family:'arial'">  ${
                    req.body.enName
                 }</span></div>
                 <div style="flex-grow: 1;direction: rtl;padding: 5px;"><span>الاسم الكامل : </span><span> ${
                    req.body.name
                 }</span></div>
             </div>
             <div style="display: flex;">
                 <div style="flex-grow: 1;padding: 5px;"><span> Gender - Age </span></div>
                 <div style="flex-grow: 1;padding: 5px;text-align: center;"><span style="font-family:'arial'">${
                    req.body.gender
                 } - ${req.body.age} </span></div>
                 <div style="flex-grow: 1;direction: rtl;padding: 5px;font-family:'arial'">  الجنس - العمر<span></span></div>
             </div>
         </div>
         <div style="border-bottom:2px solid #464646;padding: 10px;">
             <div style="display: flex;">
                 <div style="width: 25%;padding: 5px;font-family:'arial'"><span> Registration No. </span></div>
                 <div style="flex-grow: 1;padding: 5px;text-align: center;font-family:'arial'"><span>${
                    req.body.patientResultId
                 }</span></div>
                 <div style="width: 25%;direction: rtl;padding: 5px;font-family:'arial'"> <span>رقم التسلسل</span></div>
             </div>
         </div>
         <div style="border-bottom:2px solid #464646;padding: 10px;">
             <div style="display: flex;">
                 <div style="width: 25%;padding: 5px;font-family:'arial'"><span> Passport / ID No. </span></div>
                 <div style="flex-grow: 1;padding: 5px;text-align: center;font-family:'arial'"><span>${
                    req.body.documentId
                 }</span></div>
                 <div style="width: 25%;direction: rtl;padding: 5px;font-family:'arial'"> <span>رقم الجواز / البطاقة التعريفية</span></div>
             </div>
         </div>
         <div style="border-bottom:2px solid #464646;padding: 10px;">
             <div style="display: flex;">
                 <div style="width: 25%;padding: 5px;font-family:'arial'"><span> Date of Report </span></div>
                 <div style="flex-grow: 1;padding: 5px;text-align: center;font-family:'arial'"><span>${
                    req.body.date
                 }</span></div>
                 <div style="width: 25%;direction: rtl;padding: 5px;font-family:'arial'"> <span> تاريخ اصدار النتيجة </span></div>
             </div>
         </div>
         <div>
             <div style="display: flex;padding: 10px;">
                 <div style="width: 25%;padding: 5px;font-family:'arial'"><span> Nationality </span></div>
                 <div style="flex-grow: 1;padding: 5px;text-align: center;font-family:'arial'"><span>${
                    req.body.nationality
                 }</span></div>
                 <div style="width: 25%;direction: rtl;padding: 5px;font-family:'arial'"> <span> الجنسية </span></div>
             </div>
         </div>
     </div>
     <div style="display: flex; direction: rtl;padding: 10px;">
         <div style="flex-grow: 1;">
             <h6 style="font-size: 10px;margin: 3px 0px;font-family:'arial'">النتيجة السالبة لا تعني عدم الاصابة بمرض كوفيد ١٩ او عواقبه بينما النتيجه</h6>
             <h6 style="font-size: 10px;margin: 3px 0px;font-family:'arial'">الموجبة تعني الاصابة الفعالة بالمرض والاصابة بفايروس كورونا المستجد</h6>
             <h6 style="font-size: 10px;margin: 3px 0px;font-family:'arial'">يجب ربط الحالة الطبية والتاريخ المرضي مع فحص المسحة او الدم</h6>
         </div>
         <div style="flex-grow: 1;text-align: left;">
             <h6 style="font-size: 10px;margin: 3px 0px;font-family:'arial'">A negative result dose not mean not suffering from Covid 19 disease or its</h6>
             <h6 style="font-size: 10px;margin: 3px 0px;font-family:'arial'">consequences, while a positive result means effective infection with the</h6>
             <h6 style="font-size: 10px;margin: 3px 0px;font-family:'arial'">disease and infection with the emerging</h6>
         </div>
     </div>
 
     <div style="display: flex; direction: rtl;padding: 10px;">
         <div style="flex-grow: 1;">
             <h6 style="font-size: 12px;margin: 3px 0px;font-family:'arial'">فحص مسحة (2019 -nCoV)</h6>
             <h6 style="font-size: 12px;margin: 3px 0px;font-family:'arial'">نؤكد ان مسحة الشخص اعلاه تم فحصها لمرض</h6>
             <h6 style="font-size: 12px;margin: 3px 0px;font-family:'arial'">(Covid - 19) بطريقة (real time-PCR)</h6>
             <h6 style="font-size: 12px;margin: 3px 0px;font-family:'arial'">وظهرت نتيجة المسحة كالتالي</h6>
         </div>
         <div style="flex-grow: 1;text-align: left;">
             <h6 style="font-size: 12px;margin: 3px 0px;font-family:'arial'">SWAB test (2019-nCov)</h6>
             <h6 style="font-size: 12px;margin: 3px 0px;font-family:'arial'">WE CERTIFY THAT A SWAB from THIS PERSON</h6>
             <h6 style="font-size: 12px;margin: 3px 0px;font-family:'arial'">is tested for COVID-19 BY (real time-PCR)</h6>
             <h6 style="font-size: 12px;margin: 3px 0px;font-family:'arial'">Result interpretation is</h6>
         </div>
     </div>
     <div style="text-align: center;">
         <div style="width: 25%;margin: auto;border: 1px solid #464646;">
             <h3 style="margin: 5px ;color : ${colorResult};font-family:'arial'">${
                     req.body.result
                  } ${resultData}</h3>
         </div>
     </div>
 
     <div style="text-align: center;">
         <div style="margin: 5px;border: 1px solid #464646;padding: 3px;">
             <span style="color:rgb(13, 148, 85);font-family:'arial'">NO 2019 Novel Coronavirus (2019-nCov) RNA was detected in the specimen , and the concentration was lower than the sensitivity of the kit</span>
         </div>
     </div>
 
     <div style="display: flex; direction: rtl;padding: 5px;">
         <div style="flex-grow: 1;">
             <h6 style="font-size: 10px;margin: 3px 0px;color:rgb(223, 68, 68);font-family:'arial'">استخدام تطبيق الكامرة للتحقق من صحة التقرير عن طريق مسح الكيو ار كود</h6>
         </div>
         <div style="flex-grow: 1;text-align: left;">
             <h6 style="font-size: 10px;margin: 3px 0px;color:rgb(223, 68, 68);font-family:'arial'">scan the Qr code by mobile app to check report validity</h6>
         </div>
     </div>
 
     <div style="border: 1px solid;"></div>
 
     <div style="display: flex; direction: rtl;padding: 5px;">
         <div style="flex-grow: 1;">
             <h6 style="font-size: 10px;margin: 3px 0px;color:rgb(13, 148, 85);font-family:'arial'">التاخر في مواعيد السفر ليست مسؤوليتنا</h6>
         </div>
         <div style="flex-grow: 1;text-align: left;">
             <h6 style="font-size: 10px;margin: 3px 0px;color:rgb(13, 148, 85);font-family:'arial'">Travel date changes is not our responsibility</h6>
         </div>
     </div>
 
     <div style="text-align: center;margin-bottom:20px">
         <div style="margin: auto;">
             <img src="${
                "data:image/png;base64," + Buffer.from(png).toString("base64")
             }" width="100">
         </div>
     </div>
 
     <div style="display: flex;padding: 10px;">
         <div style="flex-grow: 1;text-align: center;">Director</div>
         <div style="flex-grow: 1;text-align: center;">Authorization</div>
     </div>
 
   <div style="direction: rtl;">
   <div style="border: 1px solid;position: relative;bottom: 10px;margin-top:100px ;"></div>
      <div style="position: fixed;bottom: 10px;">
        <h6 style="font-size: 10px;margin: 3px 0px;color:rgb(13, 148, 85)">للاستفسار الاتصال على رقم الموبايل - 07710350380 يجب استلام نسخة ورقية لغرض السفر</h6>
        <h6 style="font-size: 10px;margin: 3px 0px;color:rgb(13, 148, 85)">خدمة ٢٤ ساعة وعلى مدار الاسبوع ويتم تسليم النتيجة بما لا يزيد عن ٢٤ ساعة مع مراعاة الحالات الطارئة</h6>
      </div>
    </div>
    </div>`,
               };

               html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
                  fs.writeFileSync(
                     `${directory.directory}/app/certificates/${reportName}.pdf`,
                     pdfBuffer
                  );
                  let certificateData = new CertificateDocument({
                     patientResultId: req.body.patientResultId,
                     certificatePath: `certificates/${reportName}.pdf`,
                  });
                  CertificateDocument.create(certificateData, (err, data) => {
                     if (err)
                        res.status(500).send({
                           message:
                              err.message ||
                              "Some error occurred while creating the certificateDocument.",
                        });
                     else {
                        try {
                           let patientPhoto = req.body.patientPhoto.split(
                              "/"
                           )[1];
                           let dataForSend = {
                              idCertificateDocument: data.idCertificateDocument,
                              patientResultId: data.patientResultId,
                              certificatePath: data.certificatePath,
                              pdf: fs.readFileSync(
                                 `${directory.directory}/app/certificates/${reportName}.pdf`,
                                 { encoding: "base64" }
                              ),
                              fileName: `${reportName}.pdf`,
                              mime_type: "application/pdf",
                              photo: fs.readFileSync(
                                 `${directory.directory}/app/photos/${patientPhoto}`,
                                 { encoding: "base64" }
                              ),
                              photoName: `${patientPhoto}`,
                              photo_mime: "image/jpeg",
                           };
                           res.send(dataForSend);
                        } catch (e) {
                           let dataForSend = {
                              idCertificateDocument: data.idCertificateDocument,
                              patientResultId: data.patientResultId,
                              certificatePath: data.certificatePath,
                              pdf: fs.readFileSync(
                                 `${directory.directory}/app/certificates/${reportName}.pdf`,
                                 { encoding: "base64" }
                              ),
                              fileName: `${reportName}.pdf`,
                              mime_type: "application/pdf",
                              photo: "",
                              photoName: ``,
                              photo_mime: "image/jpeg",
                           };
                           res.send(dataForSend);
                        }
                     }
                  });
               });
            }
         }
      );
   } catch (e) {
      console.log(e);
   }
};

exports.findOne = (req, res) => {
   Patient.findById(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found patient with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error retrieving patient with id " + req.params.id,
            });
         }
      } else
         res.send({
            idPatient: data[0].idPatient,
            name: data[0].name,
            enName: data[0].enName,
            email: data[0].email,
            gender: data[0].gender,
            dob: data[0].dob,
            address: data[0].address,
            phone: data[0].phone,
            weight: data[0].weight,
            height: data[0].height,
            relationship: data[0].relationship,
            nationalityId: data[0].nationalityId,
            nationalName: data[0].nationalName,
            documentId: data[0].documentId,
            smoker: data[0].smoker,
            fasting: data[0].fasting,
            munaId: data[0].munaId,
            certificateNo: data[0].certificateNo,
            createdAt: data[0].createdAt,
            documentPhoto: extractData(
               data.filter((photo) => photo.photoType == 1)[0]
            ),
            image: extractData(data.filter((photo) => photo.photoType == 0)[0]),
         });
   });
};

exports.findPatientInformation = (req, res) => {
   let page = req.query.page;
   var numPerPage = 1000;
   var skip = (page - 1) * numPerPage;
   var limit = skip + "," + numPerPage;
   Patient.findAllPatientData(numPerPage, limit, (err, data) => {
      if (err) {
         res.status(500).send({
            message:
               err.message || "Some error occurred while retrieving patient.",
         });
      }
      let patients = data.patients.map((pat) => {
         return {
            idPatient: pat.idPatient,
            name: pat.name,
            enName: pat.enName,
            email: pat.email,
            gender: pat.gender,
            dob: pat.dob,
            address: pat.address,
            phone: pat.phone,
            weight: pat.weight,
            height: pat.height,
            relationship: pat.relationship,
            nationalityId: pat.nationalityId,
            nationalName: pat.nationalName,
            documentId: pat.documentId,
            smoker: pat.smoker,
            fasting: pat.fasting,
            munaId: pat.munaId,
            certificateNo: pat.certificateNo,
            createdAt: pat.createdAt,
            documentPhoto: data.photos.filter(
               (photo) =>
                  photo.patientId == pat.idPatient && photo.photoType == 1
            )[0],
            image: data.photos.filter(
               (photo) =>
                  photo.patientId == pat.idPatient && photo.photoType == 0
            )[0],
         };
      });
      res.send({
         pages: data.num,
         totalPatients: data.total,
         patients: patients,
      });
   });
};

exports.updateForMunaId = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   Patient.updateMunaId(req.params.id, req.body.munaId, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found patient with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error updating patient with id " + req.params.id,
            });
         }
      } else res.send(data);
   });
};

exports.updateForCertificate = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   Patient.updateMunaCertificate(
      req.params.id,
      req.body.certificateNo,
      (err, data) => {
         if (err) {
            if (err.kind === "not_found") {
               res.status(404).send({
                  message: `Not found patient with id ${req.params.id}.`,
               });
            } else {
               res.status(500).send({
                  message: "Error updating patient with id " + req.params.id,
               });
            }
         } else res.send(data);
      }
   );
};

exports.update = (req, res) => {
   if (!req.body) {
      res.status(400).send({
         message: "Content can not be empty!",
      });
   }

   Patient.updateById(req.params.id, new Patient(req.body), (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found patient with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Error updating patient with id " + req.params.id,
            });
         }
      } else res.send(data);
   });
};

exports.delete = (req, res) => {
   Patient.remove(req.params.id, (err, data) => {
      if (err) {
         if (err.kind === "not_found") {
            res.status(404).send({
               message: `Not found patient with id ${req.params.id}.`,
            });
         } else {
            res.status(500).send({
               message: "Could not delete patient with id " + req.params.id,
            });
         }
      } else res.send({ message: `patient was deleted successfully!` });
   });
};

exports.deleteAll = (req, res) => {
   Patient.removeAll((err, data) => {
      if (err)
         res.status(500).send({
            message:
               err.message ||
               "Some error occurred while removing all patients.",
         });
      else res.send({ message: `All patients were deleted successfully!` });
   });
};
