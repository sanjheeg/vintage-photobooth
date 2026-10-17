const imageUpload = document.getElementById("image-upload");

const photoStrip = document.getElementById("photo-strip");
const canvas = photoStrip.getContext("2d");

const frame = new Image();
cropImage = document.getElementById("crop-image");
const applyCropButton = document.getElementById("apply-crop");

let selectedFiles = [];
let currentPhotoIndex = 0;
const cropProgress = document.getElementById("crop-progress");
let croppedPhotos = [null, null, null, null];

const startCameraButton = document.getElementById("start-camera");
const cameraPreview = document.getElementById("camera-preview");
const takePhotoButton = document.getElementById("take-photo");
const snapshotPreview = document.getElementById("snapshot-preview");

const countdown = document.getElementById("countdown");
let capturedPhotos = [];


imageUpload.addEventListener("change", function() {  
    selectedFiles = Array.from(imageUpload.files);
    croppedPhotos = [null, null, null, null];

    if (selectedFiles.length !== 4) {
        alert("Please select exactly 4 photos!");
        return;
    }
    currentPhotoIndex = 0;
    cropImage.src = URL.createObjectURL(selectedFiles[currentPhotoIndex]);

});

let cropper = null;

cropImage.addEventListener("load", function() {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }   

    cropper = new Cropper(cropImage, {
        aspectRatio: 540 / 390,
        viewMode: 1,
        dragMode: "move"
    });
});

applyCropButton.addEventListener("click", function() {
    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas({
        width: 540,
        height: 390
    });

    croppedPhotos[currentPhotoIndex] = croppedCanvas;
    drawPhotoStrip();
    currentPhotoIndex++;

    if (currentPhotoIndex < 4) {
        cropImage.src = URL.createObjectURL(selectedFiles[currentPhotoIndex]);
        cropProgress.textContent = `Photo ${currentPhotoIndex + 1} of 4`;        
    } else {
        frame.src = "frames/diwali.png";
    }
});

frame.addEventListener("load", function() {
    drawPhotoStrip();
});


startCameraButton.addEventListener("click", async function() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });

    cameraPreview.srcObject = stream;
});

takePhotoButton.addEventListener("click", async function() {
    takePhotoButton.disabled = true;
    capturedPhotos = [];
    takePhotoWithCountdown();
});


function drawPhotoStrip() {
    canvas.clearRect(0, 0, 600, 1800);
    const imageHeight = 390;
    const imageWidth = 540;
    const x = 30;
    const topMargin = 75; 
    let imageCount = 0;

    for (let i = 0; i < croppedPhotos.length; i++) {
        if (croppedPhotos[i] === null) {
            continue;
        }
        const y = topMargin + ((x + imageHeight) * imageCount);

        canvas.drawImage(croppedPhotos[i], x, y, imageWidth, imageHeight);        
        imageCount++;
    
    }

    if (frame.complete && frame.naturalWidth > 0) {
        canvas.drawImage(frame, 0, 0, 600, 1800);
    }
}

function takePhotoWithCountdown() {
    const snapshotCanvas = document.createElement("canvas");
    const snapshotContext = snapshotCanvas.getContext("2d");
    snapshotCanvas.width = cameraPreview.videoWidth;
    snapshotCanvas.height = cameraPreview.videoHeight;

    let seconds = 3;
    countdown.textContent = seconds;

    const timer = setInterval(function() {
        seconds--;

        if (seconds > 0) {
            countdown.textContent = seconds;
        } else {
            clearInterval(timer);
            countdown.textContent = "📸 Smile!";
            snapshotContext.drawImage(cameraPreview, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
            const photoURL = snapshotCanvas.toDataURL("image/png"+capturedPhotos.length);
            capturedPhotos.push(photoURL);
            snapshotPreview.src = photoURL;
            
            if (capturedPhotos.length < 4) {
                takePhotoWithCountdown();
            } else {
                countdown.textContent = "All 4 photos captured!";
                takePhotoButton.disabled = false;
            }
        }
    }, 1000);

    
    
}