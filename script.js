const imageUpload = document.getElementById("image-upload");

const photoStrip = document.getElementById("photo-strip");
const canvas = photoStrip.getContext("2d");

const frame = new Image();
cropImage = document.getElementById("crop-image");
const applyCropButton = document.getElementById("apply-crop");

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
    const file = imageUpload.files[0];

    if (!file) return;

    cropImage.src = URL.createObjectURL(file);
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

    canvas.drawImage(cropImage, 30, 75, 540, 390);
});




