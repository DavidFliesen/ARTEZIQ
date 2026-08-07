/*
ARTEZIQ Explorer Program submission endpoint
Deploy as a Google Apps Script Web App:
  Execute as: Me
  Who has access: Anyone

After deployment, copy the Web App URL into SUBMIT_ENDPOINT
inside explorer/index.html.

Set ADMIN_EMAIL below to the address where you want Explorer requests sent.
*/
const ADMIN_EMAIL = "YOUR_EMAIL_HERE";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    const required = ["appBeingTested","fullName","email","phone","cityState","contactMethod","device","experience","ndaName","ndaEmail","ndaDate","pdfBase64","filename"];
    for (const key of required) {
      if (!data[key]) throw new Error("Missing required field: " + key);
    }
    if (!data.agreed) throw new Error("NDA agreement was not accepted.");

    const pdfBlob = Utilities.newBlob(
      Utilities.base64Decode(data.pdfBase64),
      "application/pdf",
      data.filename
    );

    const applicantSubject = "Your signed ARTEZIQ Explorer Program NDA";
    const applicantBody =
      "Thank you for requesting consideration for the ARTEZIQ Explorer Program for " + data.appBeingTested + ".\n\n" +
      "Attached is a PDF copy of the NDA you completed and signed.\n" +
      "Agreement ID: " + (data.agreementId || "Not provided") + "\n" +
      "Signed: " + (data.signedAt || "Not provided") + "\n\n" +
      "Your request is being considered. If selected, ARTEZIQ will contact you using the information you provided.\n\n" +
      "ARTEZIQ";

    GmailApp.sendEmail(data.email, applicantSubject, applicantBody, {
      attachments: [pdfBlob],
      name: "ARTEZIQ Explorer Program"
    });

    if (ADMIN_EMAIL && ADMIN_EMAIL !== "YOUR_EMAIL_HERE") {
      const adminBody =
        "New ARTEZIQ Explorer Program request\n\n" +
        "App Being Tested: " + data.appBeingTested + "\n" +
        "Name: " + data.fullName + "\n" +
        "Email: " + data.email + "\n" +
        "Phone: " + data.phone + "\n" +
        "City / State: " + data.cityState + "\n" +
        "Preferred Contact: " + data.contactMethod + "\n" +
        "Primary Testing Device: " + data.device + "\n" +
        "Agreement ID: " + (data.agreementId || "Not provided") + "\n" +
        "Signed: " + (data.signedAt || "Not provided") + "\n\n" +
        "Fishing experience / intended use:\n" + data.experience;
      GmailApp.sendEmail(ADMIN_EMAIL, "New ARTEZIQ Explorer Request - " + data.appBeingTested + " - " + data.fullName, adminBody, {
        attachments: [pdfBlob],
        name: "ARTEZIQ Explorer Program"
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ok:false,error:String(err.message || err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
