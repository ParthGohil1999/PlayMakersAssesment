const Jimp = require('jimp'); 

// Function to verify badge image
async function verifyBadgeImage(inputPath) {
  try {
    const image = await Jimp.read(inputPath);

    // Check size
    if (image.bitmap.width !== 512 || image.bitmap.height !== 512) {
      return "Image size should be 512x512.";
    }

    // Check circle mask
    const centerX = image.bitmap.width / 2;
    const centerY = image.bitmap.height / 2;
    const radius = image.bitmap.width / 2;
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > radius && image.bitmap.data[idx + 3] > 0) {
        return "Non-transparent pixels should be within a circle.";
      }
    });

    return "Badge image is valid.";
  } catch (error) {
    return "An error occurred: " + error.message;
  }
}

// Function to convert image to badge specifications
async function convertToBadgeImage(inputPath, outputPath) {
  try {
    const image = await Jimp.read(inputPath);
    
    // Resize image to 512x512
    image.resize(512, 512);

    // Apply circle mask
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      const centerX = image.bitmap.width / 2;
      const centerY = image.bitmap.height / 2;
      const radius = image.bitmap.width / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > radius) {
        image.bitmap.data[idx + 3] = 0; 
      }
    });

    await image.writeAsync(outputPath);
    return "Image converted to badge specifications.";
  } catch (error) {
    return "An error occurred: " + error.message;
  }
}

// Usage example
const inputImagePath = 'test.jpg';
const outputImagePath = 'badge.png';

verifyBadgeImage(inputImagePath).then(result => {
  console.log(result);
});

convertToBadgeImage(inputImagePath, outputImagePath).then(result => {
  console.log(result);
});
