"use strict";

/* =====================================
   LOAD FORM DATA
===================================== */

const rawData = sessionStorage.getItem("demoLicenseData");

if (!rawData) {
  alert("কোনো Demo তথ্য পাওয়া যায়নি। আবার ফরম পূরণ করুন।");
  window.location.replace("index.html");
}

let data = {};

try {
  data = JSON.parse(rawData);
} catch (error) {
  alert("তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
  window.location.replace("index.html");
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
setText("backIssue", formatDate(data.issue));
setText("backReference", data.reference);
setText("backIssuer", data.issuer);

/* =====================================
   PHOTO DISPLAY
===================================== */

if (data.photo) {

  document.getElementById("cardPhoto").src = data.photo;

  document.getElementById("backPhoto").src = data.photo;

}

/* =====================================
   QR CODE GENERATION
===================================== */

function generateQRCode() {

  const qrContainer = document.getElementById("qrCode");

  qrContainer.innerHTML = "";

  if (typeof QRCode === "undefined") {
    qrContainer.textContent = "QR unavailable";
    return;
  }

  const demoQRData = [
    "PERSONAL DESIGN DEMO",
    "NOT AN OFFICIAL DOCUMENT",
    "Name: " + data.name,
    "Reference: " + data.reference
  ].join("\n");

  new QRCode(qrContainer, {
    text: demoQRData,
    width: 120,
    height: 120,
    colorDark: "#17233d",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });

}

/* =====================================
   DEMO BARCODE GENERATION
===================================== */

function generateBarcode() {

  if (typeof JsBarcode === "undefined") {
    document.getElementById("demoBarcode").outerHTML =
      '<span>Barcode unavailable</span>';
    return;
  }

  const barcodeValue = "DEMO-" +
    String(data.reference || "000000")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .slice(0, 25);

  JsBarcode("#demoBarcode", barcodeValue, {
    format: "CODE128",
    lineColor: "#8d353b",
    background: "#ffffff",
    width: 2,
    height: 55,
    displayValue: true,
    fontSize: 12,
    margin: 5
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

  // Both sides are displayed by the print CSS.
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

  generateQRCode();
  generateBarcode();

  showSide("front");

});
