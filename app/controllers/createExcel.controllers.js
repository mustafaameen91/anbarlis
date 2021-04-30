const Excel = require("exceljs");
const directory = require("./../../server");
const path = require("path");
const fs = require("fs");
const html_to_pdf = require("html-pdf-node");

exports.createExcel = async (req, res) => {
   const workbook = new Excel.Workbook();
   const worksheet = workbook.addWorksheet("My Sheet");

   worksheet.columns = [
      { header: "index", key: "index" },
      { header: "patient name", key: "patientName" },
      { header: "age", key: "age" },
      { header: "gender", key: "gender" },
      { header: "address", key: "address" },
      { header: "test name", key: "testName" },
      { header: "result", key: "result" },
      { header: "phone", key: "phone" },
      { header: "date", key: "date" },
      { header: "user", key: "userName" },
      { header: "patient result id", key: "testId" },
      { header: "price", key: "price" },
   ];
   worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
   });

   req.body.forEach((patient, i) => {
      worksheet.addRow({
         index: i + 1,
         patientName: patient.patientName,
         age: patient.age,
         gender: patient.gender,
         address: patient.address,
         testName: patient.testName,
         result: patient.result,
         phone: patient.phone,
         date: patient.date,
         userName: patient.userName,
         testId: patient.testId,
         price: patient.price,
      });
   });
   await workbook.xlsx.writeFile(`static.xlsx`);
   res.send({ url: "excel/static.xlsx" });
};

exports.createInvoice = async (req, res) => {
   try {
      let options = { format: "A4" };
      let logoImage = fs.readFileSync(path.join(__dirname, "logo.png"), {
         encoding: "base64",
      });

      let allTests = req.body.tests.map((test) => {
         return `</div><div style="display: flex; direction: ltr;padding: 2px 15px;"><div style="flex-grow: 3;"><h5 style="margin: 0px ;">${test.testName}</h5></div><div style="flex-grow: 1;"><h5 style="margin: 0px ;">${test.charge}</h5></div></div>`;
      });

      let file = {
         content: `<header style="display:flex;direction: rtl;">
                  <div style="flex-grow: 1;text-align: center;margin-top: 30px;">
                      <h4 style="font-size: 16px;margin: 4px 0px;">المختبر الوطني الاستثماري / الكرخ</h4>
                      <h4 style="font-size: 16px;margin: 4px 0px;">للتحليلات المرضية</h4>
                  </div>
                  <div style="flex-grow: 1;text-align: center;"><img src="data:image/png;base64,${logoImage}" width="120"></div>
                  <div style="flex-grow: 1;text-align: right;margin-top: 30px;">
                      <h4 style="font-size: 16px;margin: 4px 0px;">العدد : ${req.body.billId}</h4>
                      <h4 style="font-size: 16px;margin: 4px 0px;">التاريخ : ${req.body.billDate} </h4>
                  </div>
              </header>
              <div style="margin:10px;border: 1px solid #353535"></div>
              <div style="text-align: center;">
                  <div style="width: 20%;margin: auto;border: 1px solid #464646;box-shadow: 3px 3px 0px #888888;">
                      <h3 style="margin: 5px ;">Receipt</h3>
                  </div>
              </div>
              <div style="display: flex; direction: ltr;padding: 15px;">
                  <div style="flex-grow: 1;">
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Name </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.name}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Age / Gender  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.age}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Received Date  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.received}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Phone No  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.phone}</h6>
                  </div>
                  <div style="flex-grow: 1;">
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">PPID  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.patientId}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Bill No  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.billId}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Bill Date  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.billDate}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Center</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">المختبر الوطني</h6>
                  </div>
              </div>
              <div style="margin: 5px 15px;border: 1px solid #353535"></div>
              <div style="display: flex; direction: ltr;padding: 5px 15px;">
                  <div style="flex-grow: 3;"><h4 style="margin: 0px ;">Test Name</h4></div>
                  <div style="flex-grow: 1;"><h4 style="margin: 0px ;">Test Charges</h4></div>
              </div>

              ${allTests}
              
              <div style="margin: 5px 15px;border: 1px solid #353535"></div>
              <div style="display: flex; direction: ltr;padding: 2px 15px;">
                  <div style="flex-grow: 1;"><h5 style="margin: 0px ;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h5></div>
                  <div style="flex-grow: 1;"><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 20%;">Total Price  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.totalPrice}</h6></div>
              </div>
              <div style="text-align: center;"><h4 style="margin: 5px ;">Thank You</h4></div>
              <div style="text-align: right;padding: 20px;">
                  <span><span><span>TPI</span> <span> بغداد - الحارثية - نهاية شارع الكندي - فرع مصرف ال</span> </span><?xml version="1.0" encoding="iso-8859-1"?>
                  <svg version="1.1" id="Capa_1" width="15" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                       viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                  <path style="fill:#FD003A;" d="M256,0C156.698,0,76,80.7,76,180c0,33.6,9.302,66.301,27.001,94.501l140.797,230.414
                      c2.402,3.9,6.002,6.301,10.203,6.901c5.698,0.899,12.001-1.5,15.3-7.2l141.2-232.516C427.299,244.501,436,212.401,436,180
                      C436,80.7,355.302,0,256,0z M256,270c-50.398,0-90-40.8-90-90c0-49.501,40.499-90,90-90s90,40.499,90,90
                      C346,228.9,306.999,270,256,270z"/>
                  <path style="fill:#E50027;" d="M256,0v90c49.501,0,90,40.499,90,90c0,48.9-39.001,90-90,90v241.991
                      c5.119,0.119,10.383-2.335,13.3-7.375L410.5,272.1c16.799-27.599,25.5-59.699,25.5-92.1C436,80.7,355.302,0,256,0z"/>
                  <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></span>
              </div>

              <div style="border: 1px dashed #212121;"></div>

              <header style="display:flex;direction: rtl;">
                  <div style="flex-grow: 1;text-align: center;margin-top: 30px;">
                      <h4 style="font-size: 16px;margin: 4px 0px;">المختبر الوطني الاستثماري / الكرخ</h4>
                      <h4 style="font-size: 16px;margin: 4px 0px;">للتحليلات المرضية</h4>
                  </div>
                  <div style="flex-grow: 1;text-align: center;"><img src="data:image/png;base64,${logoImage}" width="120"></div>
                  <div style="flex-grow: 1;text-align: right;margin-top: 30px;">
                      <h4 style="font-size: 16px;margin: 4px 0px;">العدد : ${req.body.billId}</h4>
                      <h4 style="font-size: 16px;margin: 4px 0px;">التاريخ : ${req.body.billDate}</h4>
                  </div>
              </header>
              <div style="margin:10px;border: 1px solid #353535"></div>
              <div style="text-align: center;">
                  <div style="width: 20%;margin: auto;border: 1px solid #464646;box-shadow: 3px 3px 0px #888888;">
                      <h3 style="margin: 5px ;">Receipt</h3>
                  </div>
              </div>
              <div style="display: flex; direction: ltr;padding: 15px;">
                  <div style="flex-grow: 1;">
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Name </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.name}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Age / Gender  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.age}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Received Date  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.received}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Phone No  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.phone}</h6>
                  </div>
                  <div style="flex-grow: 1;">
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">PPID  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.patientId}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Bill No  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.billId}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Bill Date  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.billDate}</h6>
                      <br>
                      <h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 30%;">Center</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">المختبر الوطني</h6>
                  </div>
              </div>
              <div style="margin: 5px 15px;border: 1px solid #353535"></div>
              <div style="display: flex; direction: ltr;padding: 5px 15px;">
                  <div style="flex-grow: 3;"><h4 style="margin: 0px ;">Test Name</h4></div>
                  <div style="flex-grow: 1;"><h4 style="margin: 0px ;">Test Charges</h4></div>
              </div>

              ${allTests}
              
              <div style="margin: 5px 15px;border: 1px solid #353535"></div>
              <div style="display: flex; direction: ltr;padding: 2px 15px;">
                  <div style="flex-grow: 1;"><h5 style="margin: 0px ;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h5></div>
                  <div style="flex-grow: 1;"><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;width: 20%;">Total Price  </h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;padding-right: 5px;">:</h6><h6 style="font-size: 14px;margin: 3px 0px;display: inline-block;">${req.body.totalPrice}</h6></div>
              </div>
              <div style="text-align: center;"><h4 style="margin: 5px ;">Thank You</h4></div>
              <div style="text-align: right;padding: 20px;">
                  <span><span><span>TPI</span> <span> بغداد - الحارثية - نهاية شارع الكندي - فرع مصرف ال</span> </span><?xml version="1.0" encoding="iso-8859-1"?>
                  <svg version="1.1" id="Capa_1" width="15" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                       viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                  <path style="fill:#FD003A;" d="M256,0C156.698,0,76,80.7,76,180c0,33.6,9.302,66.301,27.001,94.501l140.797,230.414
                      c2.402,3.9,6.002,6.301,10.203,6.901c5.698,0.899,12.001-1.5,15.3-7.2l141.2-232.516C427.299,244.501,436,212.401,436,180
                      C436,80.7,355.302,0,256,0z M256,270c-50.398,0-90-40.8-90-90c0-49.501,40.499-90,90-90s90,40.499,90,90
                      C346,228.9,306.999,270,256,270z"/>
                  <path style="fill:#E50027;" d="M256,0v90c49.501,0,90,40.499,90,90c0,48.9-39.001,90-90,90v241.991
                      c5.119,0.119,10.383-2.335,13.3-7.375L410.5,272.1c16.799-27.599,25.5-59.699,25.5-92.1C436,80.7,355.302,0,256,0z"/>
                  <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></span>
              </div>
              
              `,
      };

      html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
         fs.writeFileSync(`${directory.directory}/bill.pdf`, pdfBuffer);
      });

      res.send({
         url: "excel/bill.pdf",
      });
   } catch (e) {
      console.log(e);
   }
};
