# 🛡️ DeepGuard AI

**Detect. Verify. Decide.**

DeepGuard AI is an AI-powered synthetic-media detector designed to help users identify **AI-generated and potentially manipulated images directly in the browser**.

The project uses the **Detectra v3** pretrained model with **ONNX Runtime Web** and integrates it into a Chrome extension. When a user clicks an image on a webpage, DeepGuard AI analyzes that specific image and displays the result as an overlay on the image itself.

## ✨ Features

* 🖼️ Image-level AI detection
* 🖱️ Analyze images by clicking them
* 🔍 AI-generated / manipulated classification
* 📊 AI probability score
* 🌐 Browser-based inference
* ⚡ ONNX Runtime Web
* 🧩 Chrome Extension integration
* 🔄 Supports dynamically loaded webpage images
* 🛡️ Human remains the final decision-maker

## 🧠 How It Works

```text
Webpage
   ↓
User clicks an image
   ↓
DeepGuard captures the selected image
   ↓
Detectra v3 ONNX model
   ↓
AI probability
   ↓
REAL / AI-GENERATED
   ↓
Result overlay appears on that image
```

## 🛠️ Technology Stack

* **Model:** Detectra v3
* **Model format:** ONNX
* **Inference:** ONNX Runtime Web
* **Frontend:** HTML, CSS, JavaScript
* **Browser:** Google Chrome
* **Extension:** Chrome Manifest V3
* **Development:** Python + JavaScript
* **Platform:** Browser / Client-side

## 📊 Independent Evaluation

DeepGuard AI was independently tested on a small set of **62 images** with user-supplied ground-truth labels:

* **29 AI-generated images**
* **33 real images**

Observed results:

| Metric    |     Result |
| --------- | ---------: |
| Accuracy  | **88.71%** |
| Precision | **95.83%** |
| Recall    | **79.31%** |
| F1 Score  | **86.79%** |

Confusion matrix:

```text
                 Predicted
               REAL     AI

Actual REAL     32       1
Actual AI        6      23
```

These results come from a small independent evaluation set and **should not be interpreted as a general-purpose accuracy guarantee**.

## 🎯 Detection Threshold

DeepGuard uses a **65% AI-probability threshold** for its current classification:

```text
AI Probability ≥ 65%  →  AI-GENERATED / MANIPULATED

AI Probability < 65%  →  REAL
```

The probability is an automated model prediction, not definitive proof of authenticity.

## 🚀 Chrome Extension

The Chrome extension modifies the webpage DOM to attach a DeepGuard overlay to individual images.

Each suitable image can display:

```text
🛡️ DeepGuard AI
Click to analyze
```

After clicking:

```text
🛡️ DeepGuard AI
AI-GENERATED / MANIPULATED
AI Probability: 99.66%
```

or:

```text
🛡️ DeepGuard AI
REAL
AI Probability: 7.62%
```

Images dynamically added to a webpage can also be detected using a `MutationObserver`.

## 🔬 Model

DeepGuard AI uses the **Detectra v3** pretrained ONNX model.

The model produces a logit that is converted using a sigmoid function into an estimated probability that an image is AI-generated.

The model's preprocessing uses:

* Resize shortest edge to 440 pixels
* Center crop to 384 × 384
* Pixel values scaled to [0, 1]
* ImageNet normalization

## ⚠️ Disclaimer

DeepGuard AI provides an **automated probabilistic assessment**.

A result such as **REAL** does not prove that an image is authentic, and an **AI-GENERATED / MANIPULATED** result does not by itself establish the image's origin.

Users should consider the result as **decision-support information**, not definitive evidence.

## 📁 Project Structure

```text
DeepGuard_ONNX/
│
├── browser/
│   ├── detectra_model.onnx
│   ├── index.html
│   ├── script.js
│   └── ONNX Runtime Web files
│
└── chrome_extension/
    ├── manifest.json
    ├── index.html
    ├── script.js
    ├── content.js
    ├── detectra_model.onnx
    └── ONNX Runtime Web files
```

## 🚀 Future Development

* Improved image preprocessing
* Support for more media types
* Additional model validation on diverse datasets
* Performance optimization
* Expanded browser compatibility
* More detailed provenance and verification signals

---

### DeepGuard AI

**Detect. Verify. Decide.**

Built to make synthetic-media detection more accessible directly from the browser.
