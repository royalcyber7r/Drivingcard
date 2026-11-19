const form = document.getElementById("licenseForm");
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");
const photoPlaceholder = document.getElementById("photoPlaceholder");

let uploadedPhoto = "";

photoInput.addEventListener("change", function () {

  const file = this.files[0];

  if (!file) return;

  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (!allowed.includes(file.type)) {
    alert("শুধু JPG, PNG অথবা WEBP ছবি আপলোড করুন।");
    this.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("ছবির সাইজ সর্বোচ্চ 5 MB হতে পারবে।");
    this.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {

    uploadedPhoto = event.target.result;

    photoPreview.src = uploadedPhoto;
    photoPreview.hidden = false;
    photoPlaceholder.hidden = true;

  };

  reader.readAsDataURL(file);

});

form.addEventListener("submit", function (event) {

  event.preventDefault();

  if (!uploadedPhoto) {
    alert("প্রথমে একটি ছবি আপলোড করুন।");
    return;
  }

  const data = {
    name: document.getElementById("name").value.trim(),
    dob: document.getElementById("dob").value,
    bloodGroup: document.getElementById("bloodGroup").value,
    guardian: document.getElementById("guardian").value.trim(),
    issue: document.getElementById("issue").value,
    expiry: document.getElementById("expiry").value,
    reference: document.getElementById("reference").value.trim(),
    issuer: document.getElementById("issuer").value.trim(),
    address: document.getElementById("address").value.trim(),
    vehicle: document.getElementById("vehicle").value,
    photo: uploadedPhoto
  };

  if (!data.bloodGroup) {
    alert("রক্তের গ্রুপ নির্বাচন করুন।");
    return;
  }

  if (new Date(data.expiry) <= new Date(data.issue)) {
    alert("মেয়াদ শেষের তারিখ ইস্যু তারিখের পরে হতে হবে।");
    return;
  }

  try {
    sessionStorage.setItem("demoLicenseData", JSON.stringify(data));
    window.location.href = "cardview.html";
  } catch (error) {
    alert("ছবিটি অনেক বড়। ছোট ছবি দিয়ে আবার চেষ্টা করুন।");
  }

});

function clearForm() {
  form.reset();
  uploadedPhoto = "";
  photoPreview.src = "";
  photoPreview.hidden = true;
  photoPlaceholder.hidden = false;
}

document.getElementById("clearBtn").addEventListener("click", clearForm);

document.getElementById("resetBtn").addEventListener("click", function () {
  if (confirm("সব তথ্য মুছে ফেলবেন?")) {
    clearForm();
  }
});
