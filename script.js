document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       FORM PAGE
    ===================================== */

    const form = document.getElementById("licenseForm");

    if (form) {

        const photoInput = document.getElementById("photo");
        const choosePhoto = document.getElementById("choosePhoto");
        const photoPreview = document.getElementById("photoPreview");
        const photoStatus = document.getElementById("photoStatus");
        const generateBtn = document.getElementById("generateBtn");

        let selectedPhoto = "";


        /* OPEN PHOTO PICKER */

        choosePhoto.addEventListener("click", function () {
            photoInput.click();
        });


        /* IMAGE COMPRESSION */

        function compressImage(file) {

            return new Promise((resolve, reject) => {

                const allowedTypes = [
                    "image/jpeg",
                    "image/png"
                ];

                if (!allowedTypes.includes(file.type)) {
                    reject("শুধু JPG অথবা PNG ছবি নির্বাচন করুন।");
                    return;
                }

                if (file.size > 3 * 1024 * 1024) {
                    reject("ছবির সাইজ সর্বোচ্চ ৩ MB হতে পারবে।");
                    return;
                }

                const reader = new FileReader();

                reader.onerror = function () {
                    reject("ছবি পড়া সম্ভব হয়নি। আবার চেষ্টা করুন।");
                };

                reader.onload = function (event) {

                    const image = new Image();

                    image.onerror = function () {
                        reject("ছবিটি সঠিক নয় অথবা খোলা যাচ্ছে না।");
                    };

                    image.onload = function () {

                        const maxWidth = 800;
                        const maxHeight = 1000;

                        let width = image.width;
                        let height = image.height;

                        const scale = Math.min(
                            1,
                            maxWidth / width,
                            maxHeight / height
                        );

                        width = Math.round(width * scale);
                        height = Math.round(height * scale);

                        const canvas = document.createElement("canvas");

                        canvas.width = width;
                        canvas.height = height;

                        const context = canvas.getContext("2d");

                        if (!context) {
                            reject("ছবি প্রসেস করা সম্ভব হয়নি।");
                            return;
                        }

                        context.fillStyle = "#ffffff";

                        context.fillRect(0, 0, width, height);

                        context.drawImage(
                            image,
                            0,
                            0,
                            width,
                            height
                        );

                        const compressedImage = canvas.toDataURL(
                            "image/jpeg",
                            0.65
                        );

                        resolve(compressedImage);

                    };

                    image.src = event.target.result;

                };

                reader.readAsDataURL(file);

            });

        }


        /* PHOTO SELECTION */

        photoInput.addEventListener("change", async function () {

            const file = this.files[0];

            if (!file) return;

            selectedPhoto = "";

            photoPreview.classList.add("hidden");

            photoStatus.textContent = "ছবি প্রস্তুত হচ্ছে...";

            choosePhoto.disabled = true;

            try {

                const compressedImage = await compressImage(file);

                selectedPhoto = compressedImage;

                photoPreview.src = compressedImage;

                photoPreview.classList.remove("hidden");

                photoStatus.textContent =
                    "✓ ছবি সফলভাবে আপলোড হয়েছে।";

            } catch (error) {

                selectedPhoto = "";

                photoPreview.src = "";

                photoPreview.classList.add("hidden");

                photoStatus.textContent =
                    "ছবি আপলোড করা যায়নি।";

                alert(error);

                photoInput.value = "";

            } finally {

                choosePhoto.disabled = false;

            }

        });


        /* FORM SUBMIT */

        form.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!selectedPhoto) {

                alert("প্রথমে ছবি নির্বাচন করুন।");

                return;
            }

            const data = {

                name: document.getElementById("name").value.trim(),

                dob: document.getElementById("dob").value,

                guardian: document.getElementById("guardian").value.trim(),

                issueDate: document.getElementById("issueDate").value,

                expiryDate: document.getElementById("expiryDate").value,

                reference: document.getElementById("reference").value.trim(),

                issuer: document.getElementById("issuer").value.trim(),

                address: document.getElementById("address").value.trim(),

                vehicleClass: document.getElementById("vehicleClass").value.trim(),

                photo: selectedPhoto

            };


            /* DATE VALIDATION */

            if (new Date(data.expiryDate) <= new Date(data.issueDate)) {

                alert("মেয়াদ শেষের তারিখ ইস্যু তারিখের পরে হতে হবে।");

                return;
            }


            /* SAVE DATA */

            try {

                sessionStorage.setItem(
                    "dlDemoData",
                    JSON.stringify(data)
                );

                generateBtn.disabled = true;

                generateBtn.textContent = "Generating...";

                window.location.href = "cardview.html";

            } catch (error) {

                alert(
                    "তথ্য সংরক্ষণ করা যায়নি। আরও ছোট ছবি ব্যবহার করে চেষ্টা করুন।"
                );

                generateBtn.disabled = false;

                generateBtn.textContent = "Generate Demo Card →";

            }

        });


        /* FORM RESET */

        form.addEventListener("reset", function () {

            selectedPhoto = "";

            photoInput.value = "";

            photoPreview.src = "";

            photoPreview.classList.add("hidden");

            photoStatus.textContent =
                "এখনো কোনো ছবি নির্বাচন করা হয়নি।";

        });

    }


    /* =====================================
       CARD VIEW PAGE
    ===================================== */

    if (document.getElementById("cardName")) {

        const storedData = sessionStorage.getItem("dlDemoData");

        if (!storedData) {

            alert("কোনো Demo তথ্য পাওয়া যায়নি।");

            window.location.replace("index.html");

            return;
        }

        let data;

        try {

            data = JSON.parse(storedData);

        } catch (error) {

            alert("তথ্য পড়তে সমস্যা হয়েছে।");

            window.location.replace("index.html");

            return;
        }


        /* DATE FORMAT */

        function formatDate(value) {

            if (!value) return "—";

            const date = new Date(value + "T00:00:00");

            if (isNaN(date.getTime())) return value;

            const months = [
                "JAN", "FEB", "MAR", "APR",
                "MAY", "JUN", "JUL", "AUG",
                "SEP", "OCT", "NOV", "DEC"
            ];

            const day = String(date.getDate()).padStart(2, "0");

            return (
                day + "-" +
                months[date.getMonth()] + "-" +
                date.getFullYear()
            );

        }


        /* SET TEXT */

        function setText(id, value) {

            const element = document.getElementById(id);

            if (element) {

                element.textContent = value || "—";

            }

        }


        /* FRONT DATA */

        setText("cardName", data.name);

        setText("cardDob", formatDate(data.dob));

        setText("cardGuardian", data.guardian);

        setText("cardIssue", formatDate(data.issueDate));

        setText("cardExpiry", formatDate(data.expiryDate));

        setText("cardReference", data.reference);

        setText("cardIssuer", data.issuer);


        /* BACK DATA */

        setText("backAddress", data.address);

        setText("backClass", data.vehicleClass);

        setText("backIssue", formatDate(data.issueDate));

        setText("backReference", data.reference);

        setText("backIssuer", data.issuer);


        /* PHOTO */

        if (data.photo) {

            const cardPhoto = document.getElementById("cardPhoto");

            const backPhoto = document.getElementById("backPhoto");

            if (cardPhoto) {
                cardPhoto.src = data.photo;
            }

            if (backPhoto) {
                backPhoto.src = data.photo;
            }

        }


        /* QR GENERATOR */

        const qrContainer = document.getElementById("qrCode");

        if (qrContainer) {

            qrContainer.innerHTML = "";

            if (typeof QRCode !== "undefined") {

                const demoQRData = {

                    type: "PERSONAL DEMO",

                    name: data.name,

                    reference: data.reference,

                    issuer: data.issuer,

                    notice: "NOT AN OFFICIAL DOCUMENT"

                };

                new QRCode(qrContainer, {

                    text: JSON.stringify(demoQRData),

                    width: 150,

                    height: 150,

                    colorDark: "#26334b",

                    colorLight: "#ffffff",

                    correctLevel: QRCode.CorrectLevel.M

                });

            } else {

                qrContainer.textContent = "QR LIBRARY UNAVAILABLE";

            }

        }


        /* BARCODE GENERATOR */

        const barcode = document.getElementById("demoBarcode");

        if (barcode) {

            if (typeof JsBarcode !== "undefined") {

                const safeReference = String(data.reference)
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .substring(0, 20);

                const demoCode = "DEMO" + safeReference;

                JsBarcode(barcode, demoCode, {

                    format: "CODE128",

                    width: 1.5,

                    height: 55,

                    displayValue: false,

                    lineColor: "#8d353b",

                    background: "#ffffff",

                    margin: 3

                });

            }

        }

    }

});
