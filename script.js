
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("licenseForm");

    /* =================================
       FORM PAGE
    ================================= */

    if (form) {

        const photoInput = document.getElementById("photo");
        const photoPreview = document.getElementById("photoPreview");

        let selectedPhoto = "";

        // Photo Preview
        photoInput.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) return;

            if (!["image/jpeg", "image/png"].includes(file.type)) {
                alert("শুধু JPG অথবা PNG ছবি নির্বাচন করুন।");
                this.value = "";
                return;
            }

            if (file.size > 3 * 1024 * 1024) {
                alert("ছবির সাইজ সর্বোচ্চ ৩ MB হতে পারবে।");
                this.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                selectedPhoto = event.target.result;

                photoPreview.src = selectedPhoto;
                photoPreview.classList.remove("hidden");
            };

            reader.readAsDataURL(file);

        });


        // Form Submit
        form.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!selectedPhoto) {
                alert("প্রথমে ছবি আপলোড করুন।");
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


            // Basic Validation
            if (new Date(data.expiryDate) <= new Date(data.issueDate)) {
                alert("মেয়াদ শেষের তারিখ ইস্যু তারিখের পরে হতে হবে।");
                return;
            }

            try {

                sessionStorage.setItem(
                    "dlDemoData",
                    JSON.stringify(data)
                );

                window.location.href = "cardview.html";

            } catch (error) {

                alert("তথ্য সংরক্ষণ করা যায়নি। ছোট সাইজের ছবি ব্যবহার করুন।");

            }

        });


        // Reset Preview
        form.addEventListener("reset", function () {

            selectedPhoto = "";

            photoPreview.src = "";
            photoPreview.classList.add("hidden");

        });

    }


    /* =================================
       CARD VIEW PAGE
    ================================= */

    if (document.getElementById("cardName")) {

        const storedData = sessionStorage.getItem("dlDemoData");

        if (!storedData) {

            alert("কোনো Demo তথ্য পাওয়া যায়নি।");

            window.location.href = "index.html";

            return;
        }

        const data = JSON.parse(storedData);


        // Date Format
        function formatDate(value) {

            if (!value) return "";

            const date = new Date(value + "T00:00:00");

            if (isNaN(date.getTime())) return value;

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


        // Set Text
        function setText(id, value) {

            const element = document.getElementById(id);

            if (element) {
                element.textContent = value || "—";
            }

        }


        /* FRONT INFORMATION */

        setText("cardName", data.name);

        setText("cardDob", formatDate(data.dob));

        setText("cardGuardian", data.guardian);

        setText("cardIssue", formatDate(data.issueDate));

        setText("cardExpiry", formatDate(data.expiryDate));

        setText("cardReference", data.reference);

        setText("cardIssuer", data.issuer);


        /* BACK INFORMATION */

        setText("backAddress", data.address);

        setText("backClass", data.vehicleClass);

        setText("backReference", data.reference);

        setText("backIssuer", data.issuer);

        setText("backIssue", formatDate(data.issueDate));


        /* PHOTO */

        const cardPhoto = document.getElementById("cardPhoto");

        const backPhoto = document.getElementById("backPhoto");

        if (cardPhoto) {
            cardPhoto.src = data.photo;
        }

        if (backPhoto) {
            backPhoto.src = data.photo;
        }


        /* =================================
           DEMO QR CODE
        ================================= */

        const qrContainer = document.getElementById("qrCode");

        if (qrContainer && typeof QRCode !== "undefined") {

            const demoQRData = {

                type: "PERSONAL DEMO ONLY",

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

        } else if (qrContainer) {

            qrContainer.textContent = "DEMO QR";

        }


        /* =================================
           DEMO BARCODE
        ================================= */

        const barcode = document.getElementById("demoBarcode");

        if (barcode && typeof JsBarcode !== "undefined") {

            // Only generate a non-official demo identifier.
            const demoCode = (
                "DEMO" +
                String(data.reference)
                    .replace(/[^a-zA-Z0-9]/g, "")
                    .substring(0, 25)
            ).substring(0, 30);

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

});
