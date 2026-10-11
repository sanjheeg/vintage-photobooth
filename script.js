const imageUpload = document.getElementById("image-upload");
const imagePreview = document.getElementById("photo-preview");


imageUpload.addEventListener("change", function() {
    console.log("A photo was selected!");
    const file = imageUpload.files[0];
    imagePreview.src = URL.createObjectURL(file);
});