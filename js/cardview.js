"use strict";

/* =====================================
   LOAD FORM DATA
===================================== */

const rawData = sessionStorage.getItem("demoLicenseData");

let data = {};

if (!rawData) {
  alert("কোনো Demo তথ্য পাওয়া যায়নি। আবার ফরম পূরণ করুন।");
  window.location.replace("index.html");
} else {
  try {
    data = JSON.parse(rawData);
  } catch (error) {
    alert("তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
    window.location.replace("index.html");
  }
}

/* =====================================
   DATE FORMAT
===================================== */

function formatDate(value) {

  if (!value) return "—";

  const date = new Date(value + "T00:00:00");

  if (Number.isNaN(date.getTime())) return "—";

  const months = [
    "JAN", "FEB", "MAR", "APR",
    "MAY", "JUN", "JUL", "AUG",
    "SEP", "OCT", "NOV", "DEC"
  ];

  const day = String(date.getDate()).padStart(2, "0");

  return day + "-" +
    months[date.getMonth()] + "-" +
    date.getFullYear();
}

/* =====================================
   SAFE TEXT DISPLAY
===================================== */

function setText(id, value) {

  const element = document.getElementById(id);

  if (element) {
    element.textContent = value || "—";
  }

}

/* =====================================
   FRONT CARD INFORMATION
===================================== */

setText("cardName", data.name);
setText("cardDob", formatDate(data.dob));
setText("cardBloodGroup", data.bloodGroup);
setText("cardGuardian", data.guardian);
setText("cardIssue", formatDate(data.issue));
setText("cardExpiry", formatDate(data.expiry));
setText("cardReference", data.reference);
setText("cardIssuer", data.issuer);

/* =====================================
   BACK CARD INFORMATION
===================================== */

setText("backAddress", data.address);
setText("backClass", data.vehicle);

/*
   Pre Ref No. আপাতত Demo Reference
   থেকে দেখানো হচ্ছে।
*/

setText(
  "backPreRefNo",
  data.preRefNo || data.reference
);

setText("backIssueDate", formatDate(data.issue));

/* =====================================
   PHOTO DISPLAY
===================================== */

if (data.photo) {

  const frontPhoto = document.getElementById("cardPhoto");
  const backPhoto = document.getElementById("backPhoto");

  if (frontPhoto) {
    frontPhoto.src = data.photo;
  }

  if (backPhoto) {
    backPhoto.src = data.photo;
  }

}

/* =====================================
   QR CODE GENERATION
===================================== */

function generateDemoQR(containerId) {

  const qrContainer = document.getElementById(containerId);

  if (!qrContainer) return;

  qrContainer.innerHTML = "";

  if (typeof QRCode === "undefined") {
    qrContainer.textContent = "QR unavailable";
    return;
  }

  const maroonColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--maroon")
      .trim() || "#800000";

  const demoQRData = [
    "PERSONAL DEMO CARD",
    "NOT AN OFFICIAL DOCUMENT",
    "NOT VALID FOR IDENTIFICATION"
  ].join(" | ");

  new QRCode(qrContainer, {
    text: demoQRData,
    width: 160,
    height: 160,
    colorDark: maroonColor,
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.L
  });

}

document.addEventListener("DOMContentLoaded", function () {
  generateDemoQR("qrCode");
});

/* =====================================
   DEMO BARCODE GENERATION
===================================== */

function generateBarcode() {

  const barcodeElement = document.getElementById("demoBarcode");

  if (!barcodeElement) return;

  if (typeof JsBarcode === "undefined") {
    barcodeElement.outerHTML =
      '<span>Barcode unavailable</span>';
    return;
  }

  const barcodeValue = "DEMO-" +
    String(data.reference || "000000")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .slice(0, 25);

  JsBarcode("#demoBarcode", barcodeValue, {
    format: "CODE128",
    lineColor: "#4a0e0e",
    background: "transparent",
    width: 3,
    height: 105,
    displayValue: false,
    margin: 0
  });

}

/* =====================================
   FRONT / BACK SWITCH
===================================== */

function showSide(side) {

  const front = document.getElementById("frontCard");
  const back = document.getElementById("backCard");

  const frontButton = document.getElementById("frontButton");
  const backButton = document.getElementById("backButton");

  if (!front || !back) return;

  if (side === "front") {

    front.classList.remove("hidden");
    back.classList.add("hidden");

    frontButton.classList.add("active");
    backButton.classList.remove("active");

  } else {

    front.classList.add("hidden");
    back.classList.remove("hidden");

    frontButton.classList.remove("active");
    backButton.classList.add("active");

  }

}

/* =====================================
   PDF / PRINT
===================================== */

function downloadPDF() {

  const front = document.getElementById("frontCard");
  const back = document.getElementById("backCard");

  if (!front || !back) return;

  window.print();

}

/* =====================================
   EDIT INFORMATION
===================================== */

function editInformation() {

  window.location.href = "index.html";

}

/* =====================================
   INITIALIZE
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  generateDemoQR("qrCode");

  generateDemoQR("backQrCode");

  generateBarcode();

  showSide("front");

});
