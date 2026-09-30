import * as ort from "./ort.wasm.min.mjs";

document.body.style.fontFamily = "Arial, sans-serif";

document.body.style.textAlign = "center";

document.body.style.padding = "30px";

document.body.style.backgroundColor = "#f7f7f7";

document.querySelector("h1").style.fontSize = "40px";

document.querySelector("h1").style.fontWeight = "700";

document.querySelector("h1").style.letterSpacing = "0.5px";

document.querySelector("h1").style.marginBottom = "8px";

document.querySelector("h1").nextElementSibling.style.color = "#555";

document.querySelector("h1").nextElementSibling.style.fontSize = "16px";

document.querySelector("h1").nextElementSibling.style.marginBottom = "15px";








document.getElementById("preview").style.borderRadius = "12px";

document.getElementById("preview").style.border = "1px solid #ddd";

document.getElementById("preview").style.marginBottom = "20px";

document.getElementById("preview").style.maxWidth = "400px";

document.getElementById("preview").style.height = "auto";

document.getElementById("preview").style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";

document.getElementById("preview").style.transition = "all 0.3s ease";

const previewContainer = document.createElement("div");
previewContainer.style.position = "relative";
previewContainer.style.display = "inline-block";
previewContainer.style.maxWidth = "400px";
previewContainer.style.width = "100%";

const previewElement = document.getElementById("preview");
previewElement.parentNode.insertBefore(previewContainer, previewElement);
previewContainer.appendChild(previewElement);

console.log("ONNX Runtime Web loaded successfully!");

const session = await ort.InferenceSession.create("./detectra_model.onnx");

console.log("Detectra ONNX model loaded successfully!");

const imageInput = document.getElementById("imageInput");

imageInput.insertAdjacentHTML("beforebegin", "<p style='font-weight:600; margin-bottom:8px; color:#444;'>Select an image to analyze</p>");

const analyzeButton = document.getElementById("analyzeButton");

analyzeButton.style.padding = "10px 20px";
analyzeButton.style.transition = "all 0.2s ease";
analyzeButton.style.borderRadius = "6px";
analyzeButton.style.cursor = "pointer";
analyzeButton.style.fontWeight = "600";
analyzeButton.style.marginTop = "10px";

const resetButton = document.createElement("button");

resetButton.textContent = "Analyze Another Image";
resetButton.style.marginTop = "10px";
resetButton.style.padding = "10px 20px";
resetButton.style.fontSize = "15px";
resetButton.style.borderRadius = "8px";
resetButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.12)";
resetButton.style.transition = "all 0.2s ease";
resetButton.style.cursor = "pointer";
resetButton.style.marginLeft = "auto";
resetButton.style.marginRight = "auto";
resetButton.style.display = "block";
resetButton.style.borderRadius = "6px";
resetButton.style.cursor = "pointer";
resetButton.style.fontWeight = "600";
resetButton.style.display = "none";
resetButton.style.display = "block";

resetButton.addEventListener("mouseover", () => {
    resetButton.style.transform = "scale(1.03)";
    resetButton.style.opacity = "0.8";
});

resetButton.addEventListener("mouseout", () => {
    resetButton.style.transform = "scale(1)";
    resetButton.style.opacity = "1";
});

document.body.appendChild(resetButton);

let selectedImage = null;

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    const preview = document.getElementById("preview");
preview.src = URL.createObjectURL(file);
preview.style.display = "inline-block";
preview.style.marginTop = "10px";

    selectedImage = imageInput.files[0];

    const image = new Image();

    image.onload = async () => {
        const canvas = document.createElement("canvas");
canvas.width = 384;
canvas.height = 384;

const ctx = canvas.getContext("2d");

ctx.drawImage(image, 0, 0, 384, 384);

console.log("Image resized to 384 × 384!");
console.log("Image preparation finished!");






    };

    image.src = URL.createObjectURL(file);
});

analyzeButton.addEventListener("click", async () => {

   if (!selectedImage) {
    console.log("Please select an image first.");
    return;
}
const image = new Image();

image.src = URL.createObjectURL(selectedImage);

await new Promise(resolve => {
    image.onload = resolve;
});
console.log("Analyze button loaded the image!");

const status = document.getElementById("status");
status.textContent = "Analyzing image...";
analyzeButton.disabled = true;

analyzeButton.textContent = "Analyzing...";

const canvas = document.createElement("canvas");
canvas.width = 384;
canvas.height = 384;

const ctx = canvas.getContext("2d");
ctx.drawImage(image, 0, 0, 384, 384);

const imageData = ctx.getImageData(0, 0, 384, 384);
const inputData = new Float32Array(1 * 3 * 384 * 384);

for (let i = 0; i < 384 * 384; i++) {
    const r = imageData.data[i * 4] / 255;
    const g = imageData.data[i * 4 + 1] / 255;
    const b = imageData.data[i * 4 + 2] / 255;
    
    inputData[i] = (r - 0.485) / 0.229;
    inputData[384 * 384 + i] = (g - 0.456) / 0.224;
    inputData[2 * 384 * 384 + i] = (b - 0.406) / 0.225;
}
   const tensor = new ort.Tensor(
    "float32",
    inputData,
    [1, 3, 384, 384]
);
const results = await session.run({
    pixel_values: tensor
});
const logit = results.logit.data[0];
const probability = 1 / (1 + Math.exp(-logit));

console.log("Model logit:", logit);
console.log("AI probability:", probability * 100 + "%");

const oldOverlay = document.getElementById("deepguardOverlay");
if (oldOverlay) oldOverlay.remove();

const overlay = document.createElement("div");
overlay.id = "deepguardOverlay";

const percentage = (probability * 100).toFixed(2);
const isAI = probability >= 0.65;

overlay.innerHTML = `
    <div style="font-size:16px; font-weight:700; margin-bottom:4px;">
        🛡️ DeepGuard AI
    </div>
    <div style="font-size:20px; font-weight:800;">
        ${isAI ? "AI-GENERATED / MANIPULATED" : "REAL"}
    </div>
    <div style="font-size:13px; margin-top:4px;">
        AI Probability: ${percentage}%
    </div>
`;

overlay.style.position = "absolute";
overlay.style.bottom = "12px";
overlay.style.left = "12px";
overlay.style.right = "12px";
overlay.style.padding = "10px 12px";
overlay.style.borderRadius = "10px";
overlay.style.background = "rgba(0, 0, 0, 0.82)";
overlay.style.color = "white";
overlay.style.textAlign = "left";
overlay.style.fontFamily = "Arial, sans-serif";
overlay.style.zIndex = "10";
overlay.style.boxSizing = "border-box";
overlay.style.backdropFilter = "blur(6px)";

previewContainer.appendChild(overlay);

document.getElementById("status").style.display = "none";

if (probability >= 0.65) {
    status.textContent = "AI-GENERATED / MANIPULATED";
} else {
    status.textContent = "REAL";
}
status.style.fontWeight = "bold";
status.style.letterSpacing = "0.3px";
status.style.fontSize = "20px";
status.style.marginTop = "20px";
status.style.padding = "20px";
status.style.borderRadius = "12px";
status.style.border = "1px solid #ddd";
status.style.backgroundColor = "white";
status.style.boxShadow = "0 6px 16px rgba(0,0,0,0.10)";
status.style.marginTop = "20px";
status.style.maxWidth = "600px";
status.style.marginLeft = "auto";
status.style.marginRight = "auto";
status.style.boxSizing = "border-box";
status.style.width = "100%";
status.style.marginBottom = "20px";
status.style.lineHeight = "1.5";
status.style.transition = "all 0.3s ease";
status.style.transform = "translateY(0)";
status.style.textAlign = "center";
status.style.marginTop = "20px";

status.style.maxWidth = "600px";
status.style.maxWidth = "650px";
status.style.marginLeft = "auto";
status.style.marginRight = "auto";
status.style.width = "100%";
status.style.marginBottom = "20px";
status.style.color = probability >= 0.65 ? "#c62828" : "#2e7d32";

const confidence = document.createElement("p");
confidence.textContent =
    "AI Probability: " + (probability * 100).toFixed(2) + "%";

confidence.style.marginTop = "8px";
confidence.style.fontWeight = "600";

status.appendChild(confidence);

const explanation = document.createElement("p");
explanation.style.marginTop = "10px";
explanation.style.fontSize = "14px";
explanation.style.textAlign = "center";

if (probability >= 0.65) {
    explanation.textContent =
        "The model detected patterns commonly associated with AI-generated or manipulated images.";
} else {
    explanation.textContent =
        "The model did not detect strong patterns associated with AI-generated images.";
}

status.appendChild(explanation);

const confidenceBar = document.createElement("div");

confidenceBar.style.width = "100%";
confidenceBar.style.maxWidth = "400px";
confidenceBar.style.height = "20px";
confidenceBar.style.border = "none";
confidenceBar.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
confidenceBar.style.backgroundColor = "#eee";
confidenceBar.style.height = "24px";
confidenceBar.style.overflow = "hidden";
confidenceBar.style.marginTop = "15px";
confidenceBar.style.marginLeft = "auto";
confidenceBar.style.marginRight = "auto";
confidenceBar.style.marginBottom = "15px";
confidenceBar.style.borderRadius = "12px";

const fill = document.createElement("div");

fill.style.height = "100%";

fill.style.minHeight = "24px";

fill.style.transition = "width 0.5s ease, background-color 0.3s ease";

fill.style.width = Math.min(probability * 100, 100) + "%";

fill.style.backgroundColor =
    probability >= 0.65 ? "red" : "green";

fill.style.borderRadius = "12px";

fill.style.transition = "width 0.5s ease";

confidenceBar.appendChild(fill);
status.appendChild(confidenceBar);

const disclaimer = document.createElement("p");

disclaimer.textContent =
    "Disclaimer: This AI prediction is not definitive proof of authenticity.";

disclaimer.style.fontSize = "12px";
disclaimer.style.marginTop = "15px";
disclaimer.style.textAlign = "center";

status.appendChild(disclaimer);

analyzeButton.disabled = false;

analyzeButton.textContent = "Analyze Image";

analyzeButton.addEventListener("mouseover", () => {
analyzeButton.style.transform = "scale(1.03)";
    analyzeButton.style.opacity = "0.8";
});

analyzeButton.addEventListener("mouseout", () => {
    analyzeButton.style.transform = "scale(1)";
    analyzeButton.style.opacity = "1";
});

resetButton.style.display = "block";
resetButton.addEventListener("click", () => {
    imageInput.value = "";
    selectedImage = null;
    document.getElementById("preview").style.display = "none";

const overlay = document.getElementById("deepguardOverlay");
if (overlay) overlay.remove();

    status.innerHTML = "Waiting for an image...";
status.style.cssText = "";
    status.textContent = "Waiting for an image...";
    
    resetButton.style.display = "none";
imageInput.click();
});
});