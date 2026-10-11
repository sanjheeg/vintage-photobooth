const imageUpload = document.getElementById("image-upload");

const photoStrip = document.getElementById("photo-strip");
const canvas = photoStrip.getContext("2d");

const frame = new Image();


imageUpload.addEventListener("change", function() {
    console.log("A photo was selected!");

    let imageCount = 0;
    const imageHeight = 124.8;
    const imageWidth = 172.8;
    const x = 9.6;
    const loadedImages = [];
    
    for (const file of imageUpload.files) {
        
        console.log(`File Name: ${file.name}, Size: ${file.size} bytes`);
        const image = new Image();
        const y = 24 + ((9.6 + imageHeight) * imageCount);
        image.addEventListener("load", function() {
            canvas.drawImage(image, x, y, imageWidth, imageHeight);
            loadedImages.push( {image, y});
            

            // only display the frame once all photos are done loading
            console.log(loadedImages.length);
            if (loadedImages.length == 4) {
                frame.addEventListener("load", function() {
                    console.log("Frame loaded successfully!");
                    canvas.drawImage(frame, 0, 0, 192, 576);
                });

                frame.src = "frames/diwali.png";
            }
        });

        image.src = URL.createObjectURL(file);
        imageCount++;
    }


    

    
    


});





