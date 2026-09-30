import * as ort from "./ort.wasm.min.mjs";

const imageInput = document.getElementById("imageInput");

const preview = document.getElementById("preview");

const analyzeButton = document.getElementById("analyzeButton");

const status = document.getElementById("status");
const confidenceBar = document.getElementById("confidenceBar");

const verdict = document.getElementById("verdict");
status.textContent = "";
ort.env.wasm.wasmPaths = "./";

ort.env.wasm.numThreads = 1;

const session = await ort.InferenceSession.create("./detectra_model.onnx");

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    preview.src = URL.createObjectURL(file);

    preview.style.display = "block";
    verdict.textContent = "";
});

analyzeButton.addEventListener("click", async () => {
    status.textContent = "Analyzing image...";

    const file = imageInput.files[0];
if (!file) {
    status.textContent = "Please choose an image first.";
    return;
}
const image = await createImageBitmap(file);

const canvas = document.createElement("canvas");
canvas.width = 384;
canvas.height = 384;

const ctx = canvas.getContext("2d");

ctx.drawImage(image, 0, 0, 384, 384);

const imageData = ctx.getImageData(0, 0, 384, 384);

const input = new Float32Array(1 * 3 * 384 * 384);

const mean = [0.485, 0.456, 0.406];
const std = [0.229, 0.224, 0.225];

for (let y = 0; y < 384; y++) {
    for (let x = 0; x < 384; x++) {
        const pixelIndex = (y * 384 + x) * 4;
        const r = imageData.data[pixelIndex] / 255;
        const g = imageData.data[pixelIndex + 1] / 255;
        const b = imageData.data[pixelIndex + 2] / 255;

input[y * 384 + x] = (r - mean[0]) / std[0];
input[384 * 384 + y * 384 + x] = (g - mean[1]) / std[1];
input[2 * 384 * 384 + y * 384 + x] = (b - mean[2]) / std[2];

    }
}
const tensor = new ort.Tensor("float32", input, [1, 3, 384, 384]);
const results = await session.run({
    pixel_values: tensor
});

const logit = results.logit.data[0];
const probability = 1 / (1 + Math.exp(-logit));
const percentage = (probability * 100).toFixed(2);
confidenceBar.style.width = `${percentage}%`;

status.textContent = `AI Probability: ${percentage}%`;

if (probability >= 0.65) {
    verdict.textContent = "AI-GENERATED / MANIPULATED";
    verdict.style.color = "#dc2626";
} else {
    verdict.textContent = "REAL";
    verdict.style.color = "#16a34a";
}
});
