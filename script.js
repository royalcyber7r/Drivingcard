const $ = (id) => document.getElementById(id);
const fields = {
  nameEn: "vName", dob: "vDob", blood: "vBlood", guardian: "vGuardian",
  issue: "vIssue", expiry: "vExpiry", reference: "vReference",
  address: "vAddress", classes: "vClasses", firstIssue: "vFirstIssue"
};

function updatePreview() {
  Object.entries(fields).forEach(([inputId, outputId]) => {
    $(outputId).textContent = $(inputId).value.trim() || "—";
  });
  // The Bengali name is displayed as a secondary name line.
  const bn = $("nameBn").value.trim();
  $("vName").textContent = bn ? `${$("nameEn").value.trim() || "—"} / ${bn}` : ($("nameEn").value.trim() || "—");
}

$("cardForm").addEventListener("input", updatePreview);

let photoData = "";
$("photoInput").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("অনুগ্রহ করে একটি ছবি নির্বাচন করুন।");
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    photoData = reader.result;
    $("photoFront").src = photoData;
    $("photoBack").src = photoData;
  };
  reader.readAsDataURL(file);
});

function showSide(side) {
  $("frontCard").classList.toggle("hidden", side !== "front");
  $("backCard").classList.toggle("hidden", side !== "back");
  document.querySelectorAll(".side-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.side === side);
  });
}
document.querySelectorAll(".side-btn").forEach(btn => {
  btn.addEventListener("click", () => showSide(btn.dataset.side));
});

function makePattern(id, seed) {
  // Decorative, non-scannable texture only; it is not a QR code.
  const el = $(id);
  let n = seed;
  let cells = "";
  for (let i = 0; i < 49; i++) {
    n = (n * 9301 + 49297) % 233280;
    cells += `<i style="opacity:${(n / 233280) > .5 ? .95 : .12}"></i>`;
  }
  el.innerHTML = cells;
}
makePattern("frontPattern", 17);
makePattern("backPattern", 41);

$("resetBtn").addEventListener("click", () => {
  $("cardForm").reset();
  photoData = "";
  $("photoFront").removeAttribute("src");
  $("photoBack").removeAttribute("src");
  updatePreview();
});
$("printBtn").addEventListener("click", () => {
  showSide("front");
  window.print();
});

$("downloadPng").addEventListener("click", async () => {
  if (typeof html2canvas !== "function") {
    alert("PNG export library লোড হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।");
    return;
  }
  const button = $("downloadPng");
  button.disabled = true;
  button.textContent = "Preparing...";
  try {
    const front = $("frontCard");
    const back = $("backCard");
    const frontWasHidden = front.classList.contains("hidden");
    const backWasHidden = back.classList.contains("hidden");
    front.classList.remove("hidden");
    back.classList.remove("hidden");
    const canvas1 = await html2canvas(front, {scale: 2, backgroundColor: "#ffffff", useCORS: true});
    const canvas2 = await html2canvas(back, {scale: 2, backgroundColor: "#ffffff", useCORS: true});
    const output = document.createElement("canvas");
    output.width = Math.max(canvas1.width, canvas2.width);
    output.height = canvas1.height + canvas2.height + 40;
    const ctx = output.getContext("2d");
    ctx.fillStyle = "#f1f2f4";
    ctx.fillRect(0, 0, output.width, output.height);
    ctx.drawImage(canvas1, 0, 0);
    ctx.drawImage(canvas2, 0, canvas1.height + 40);
    const link = document.createElement("a");
    link.download = "driving-license-sample.png";
    link.href = output.toDataURL("image/png");
    link.click();
    if (frontWasHidden) front.classList.add("hidden");
    if (backWasHidden) back.classList.add("hidden");
  } catch (error) {
    console.error(error);
    alert("PNG তৈরি করা যায়নি। আবার চেষ্টা করুন।");
  } finally {
    button.disabled = false;
    button.textContent = "Download PNG";
  }
});

updatePreview();
