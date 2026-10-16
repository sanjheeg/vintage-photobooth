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

/*
imageUpload.addEventListener("change", function() {
    console.log("A photo was selected!");

    let imageCount = 0;
    const imageHeight = 390;
    const imageWidth = 540;
    const x = 30;
    const topMargin = 75; 
    const loadedImages = [];
    
    for (const file of imageUpload.files) {
        
        console.log(`File Name: ${file.name}, Size: ${file.size} bytes`);
        const image = new Image();
        const y = topMargin + ((x + imageHeight) * imageCount);

        image.addEventListener("load", function() {
            //canvas.drawImage(image, x, y, imageWidth, imageHeight);
            //loadedImages.push( {image, y});            

            // only display the frame once all photos are done loading
            console.log(loadedImages.length);
            if (loadedImages.length == 4) {
                frame.addEventListener("load", function() {
                    console.log("Frame loaded successfully!");
                    canvas.drawImage(frame, 0, 0, 600, 1800);
                });

                frame.src = "frames/diwali.png";
            }
        });

        //image.src = URL.createObjectURL(file);
        cropImage.src = URL.createObjectURL(file);

        imageCount++;
    }
});
*/

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

