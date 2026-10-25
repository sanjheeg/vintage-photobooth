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
let cameraStream = null;
let countdownTimer = null;
const snapshotPreview = document.getElementById("snapshot-preview");

const countdown = document.getElementById("countdown");
let capturedPhotos = [];

const welcomeScreen = document.getElementById("welcome-screen");
const cameraSection = document.getElementById("camera-section");
const uploadSection = document.getElementById("upload-section");

const chooseCameraButton = document.getElementById("choose-camera");
const chooseUploadButton = document.getElementById("choose-upload");

const cameraBackButton = document.getElementById("camera-back");
const uploadBackButton = document.getElementById("upload-back");

const cameraFlash = document.getElementById("camera-flash");

const colorFilterButton = document.getElementById("color-filter");
const bwFilterButton = document.getElementById("bw-filter");

let currentFilter = "color";

const sharePhotoButton = document.getElementById("share-photo");

const resultsSection = document.getElementById("results-section");
const downloadPhotoButton = document.getElementById("download-photo");
const retakePhotoButton = document.getElementById("retake-photo");

let currentMode = null;


imageUpload.addEventListener("change", async function() {
    selectedFiles = Array.from(imageUpload.files);
    croppedPhotos = [null, null, null, null];

    if (selectedFiles.length !== 4) {
        alert("Please select exactly 4 photos!");
        return;
    }
    currentPhotoIndex = 0;
    try {
        cropImage.src = await prepareImage(selectedFiles[currentPhotoIndex]);
    } catch (error) {
        console.error("Image conversion failed:", error);
        alert("Couldn't open this image. Please try a JPG or PNG instead.");
    }

});

let cropper = null;

cropImage.addEventListener("load", function() {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }   

    console.log("Image loaded! Starting Cropper...");
    console.log("Selected files:", selectedFiles);

    cropper = new Cropper(cropImage, {
        aspectRatio: 540 / 390,
        viewMode: 1,
        dragMode: "move"
    });
});

applyCropButton.addEventListener("click", async function() {
    if (!cropper) return;

    const croppedCanvas = cropper.getCroppedCanvas({
        width: 540,
        height: 390
    });

    croppedPhotos[currentPhotoIndex] = croppedCanvas;
    drawPhotoStrip();
    currentPhotoIndex++;

    if (currentPhotoIndex < 4) {
        try {
            cropImage.src = await prepareImage(selectedFiles[currentPhotoIndex]);
        } catch (error) {
            console.error("Image conversion failed:", error);
            alert("Couldn't open this image. Please try a JPG or PNG instead.");
        }
        cropProgress.textContent = `Photo ${currentPhotoIndex + 1} of 4`;        
    } else {
        
    }
});

frame.addEventListener("load", function() {
    drawPhotoStrip();
});

frame.src = "frames/diwali.png";


startCameraButton.addEventListener("click", async function() {
    cameraStream  = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });

    cameraPreview.srcObject = cameraStream;
});

takePhotoButton.addEventListener("click", async function() {
    if (!cameraPreview.videoWidth || !cameraPreview.videoHeight) {
        alert("Please start your camera first!");
        return;
    }

    takePhotoButton.disabled = true;
    colorFilterButton.disabled = true;
    bwFilterButton.disabled = true;
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

    if (croppedPhotos.every(photo => photo !== null)) {
        showResults();
    }
}

function takePhotoWithCountdown() {
    const snapshotCanvas = document.createElement("canvas");
    const snapshotContext = snapshotCanvas.getContext("2d");
    snapshotCanvas.width = 540;
    snapshotCanvas.height = 390;

    const videoWidth = cameraPreview.videoWidth;
    const videoHeight = cameraPreview.videoHeight;      
    const targetRatio = 540 / 390;
    const videoRatio = videoWidth / videoHeight;

    let cropWidth;
    let cropHeight;
    

    if (videoRatio > targetRatio) {
        cropHeight = videoHeight;
        cropWidth = videoHeight * targetRatio;
    } else {
        cropWidth = videoWidth;
        cropHeight = videoWidth / targetRatio;
    }

    const cropX = (videoWidth - cropWidth) / 2;
    const cropY = (videoHeight - cropHeight) / 2;

    let seconds = 3;
    countdown.textContent = seconds;

    countdownTimer = setInterval(function() {
        seconds--;

        if (seconds > 0) {
            countdown.textContent = seconds;
        } else {
            clearInterval(countdownTimer);
            countdownTimer = null;
            countdown.textContent = "";

            snapshotContext.filter = currentFilter === "bw" ? "grayscale(100%)" : "none";

            snapshotContext.drawImage(
                cameraPreview,
                cropX, cropY, cropWidth, cropHeight,
                0, 0, 540, 390
            );
            flashCamera();

            const photoURL = snapshotCanvas.toDataURL("image/png");
            capturedPhotos.push(snapshotCanvas);
            
            if (capturedPhotos.length < 4) {
                takePhotoWithCountdown();
            } else {
                countdown.textContent = "";
                takePhotoButton.disabled = false;
                croppedPhotos = [...capturedPhotos];
                drawPhotoStrip();
                colorFilterButton.disabled = false;
                bwFilterButton.disabled = false;
            }
        }
    }, 1000);
    
}

chooseCameraButton.addEventListener("click", function() {
    welcomeScreen.style.display = "none";
    cameraSection.style.display = "block";
    currentMode = "camera";
});

chooseUploadButton.addEventListener("click", function() {
    welcomeScreen.style.display = "none";
    uploadSection.style.display = "block";
    currentMode = "upload";
});

cameraBackButton.addEventListener("click", showHome);
uploadBackButton.addEventListener("click", showHome);


function showResults() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(function(track) {
            track.stop();
        });
        cameraStream = null;
        cameraPreview.srcObject = null;
    }

    welcomeScreen.style.display = "none";
    cameraSection.style.display = "none";
    uploadSection.style.display = "none";
    resultsSection.style.display = "block";
}

function showHome() {
    // stop the camera stream if active  
    if (cameraStream) {
        cameraStream.getTracks().forEach(function(track) {
            track.stop();
        });

        cameraStream = null;
        cameraPreview.srcObject = null;
    }

    // stop timer if active 
    if (countdownTimer !== null) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        capturedPhotos = [];
        countdown.textContent = "";
        takePhotoButton.disabled = false;
        snapshotPreview.removeAttribute("src");
    }

    // remove photostrip display
    photoStrip.style.display = "none";
    croppedPhotos = [null, null, null, null];

    welcomeScreen.style.display = "block";
    cameraSection.style.display = "none";
    uploadSection.style.display = "none";

    colorFilterButton.disabled = false;
    bwFilterButton.disabled = false;
    resultsSection.style.display = "none";
}

function flashCamera() {
    cameraFlash.classList.remove("flash");

    void cameraFlash.offsetWidth;

    cameraFlash.classList.add("flash");
}

colorFilterButton.addEventListener("click", function() {
    currentFilter = "color";
    cameraPreview.classList.remove("black-and-white");

    colorFilterButton.classList.add("active");
    bwFilterButton.classList.remove("active");
});

bwFilterButton.addEventListener("click", function() {
    currentFilter = "bw";
    cameraPreview.classList.add("black-and-white");

    bwFilterButton.classList.add("active");
    colorFilterButton.classList.remove("active");
});


sharePhotoButton.addEventListener("click", function() {
    photoStrip.toBlob(async function(blob) {
        if (!blob) {
            alert("Could not create the photostrip image.");
            return;
        }

        const photoFile = new File([blob], "my-photostrip.png", {
            type: "image/png"
        });

        if (navigator.canShare && navigator.canShare({ files: [photoFile] })) {
            try {
                await navigator.share({
                    files: [photoFile],
                    title: "My Photostrip"
                });
            } catch (error) {
                console.log("Sharing cancelled or failed:", error);
            }
        } else {
            alert("Sharing isn't supported on this browser. Please download your photostrip instead!");
        }
    }, "image/png");
});

downloadPhotoButton.addEventListener("click", function() {
    const link = document.createElement("a");

    link.href = photoStrip.toDataURL("image/png");
    link.download = "my-photostrip.png";

    link.click();
});

retakePhotoButton.addEventListener("click", function() {
    croppedPhotos = [null, null, null, null];
    capturedPhotos = [];

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    cropImage.removeAttribute("src");

    resultsSection.style.display = "none";
    currentPhotoIndex = 0;
    cropProgress.textContent = "Photo 1 of 4";
    imageUpload.value = "";

    if (currentMode === "camera") {
        cameraSection.style.display = "block";
    } else {
        uploadSection.style.display = "block";
    }
});

async function prepareImage(file) {
    const isHEIC = file.type === "image/heic" ||
                   file.type === "image/heif" ||
                   /\.hei[cf]$/i.test(file.name);

    if (isHEIC) {
        const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9
        });

        return URL.createObjectURL(convertedBlob);
    }

    return URL.createObjectURL(file);
}