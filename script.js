const imageUpload = document.getElementById("image-upload");
const imagePreview = document.getElementById("photo-preview");

const photoStrip = document.getElementById("photo-strip");
const canvas = photoStrip.getContext("2d");

const frame = new Image();

imageUpload.addEventListener("change", function() {
    console.log("A photo was selected!");
    for (const file of imageUpload.files) {
        console.log(`File Name: ${file.name}, Size: ${file.size} bytes`);
    }

    const image = new Image();
    const file = imageUpload.files[0];
    /*
    image.src = URL.createObjectURL(file);
    image.addEventListener("load", function() {
        console.log("image is ready");
        canvas.drawImage(image, 20, 20, 300, 300);
    });
    */

    

    image.addEventListener("load", function() {
        console.log("Frame loaded successfully!");
        canvas.drawImage(image, 20, 20, 600, 1800);
    });

    image.src = "frames/diwali.png";
    


});





