
document.addEventListener("DOMContentLoaded", function () {

  const rawData = sessionStorage.getItem("demoLicenseData");

  if (!rawData) {
    alert("ডেমো কার্ডের তথ্য পাওয়া যায়নি। আবার তথ্য পূরণ করুন।");
    window.location.href = "index.html";
    return;
  }

  let data;

  try {
    data = JSON.parse(rawData);
  } catch (error) {
    alert("তথ্য পড়তে সমস্যা হয়েছে। আবার তথ্য পূরণ করুন।");
    window.location.href = "index.html";
    return;
  }

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value || "—";
    }
  }

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value + "T00:00:00");

    if (isNaN(date.getTime())) {
      return value;
    }

    const months = [
      "JAN", "FEB", "MAR", "APR",
      "MAY", "JUN", "JUL", "AUG",
      "SEP", "OCT", "NOV", "DEC"
    ];

    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  /* FRONT INFORMATION */

  setText("cardName", data.name);
  setText("cardDob", formatDate(data.dob));
  setText("cardBloodGroup", data.bloodGroup);
  setText("cardGuardian", data.guardian);
  setText("cardIssue", formatDate(data.issue));
  setText("cardExpiry", formatDate(data.expiry));
  setText("cardReference", data.reference);
  setText("cardIssuer", data.issuer);

  /* BACK INFORMATION */

  setText("backAddress", data.address);
  setText("backClass", data.vehicle);
  setText("backPreRefNo", data.preRefNo || data.reference);
  setText("backIssueDate", formatDate(data.issue));

  /* PHOTO */

  const frontPhoto = document.getElementById("cardPhoto");
  const backPhoto = document.getElementById("backPhoto");

  if (data.photo) {
    frontPhoto.src = data.photo;
    backPhoto.src = data.photo;
  }

  /* DEMO QR */

  function generateDemoQR(containerId, text) {
    const container = document.getElementById(containerId);

    if (!container || typeof QRCode === "undefined") {
      return;
    }

    container.innerHTML = "";

    new QRCode(container, {
      text: text,
      width: 120,
      height: 120,
      colorDark: "#17233d",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  const demoQRText =
    "PERSONAL DEMO CARD | NOT VALID | NOT A GOVERNMENT DOCUMENT";

  generateDemoQR("qrCode", demoQRText);
  generateDemoQR("backQrCode", demoQRText);

});

/* PRINT / SAVE PDF */

function downloadPDF() {
  window.print();
}

/* EDIT INFORMATION */

function editInformation() {
  window.location.href = "index.html";
}
