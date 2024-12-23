const path = require("path");

const downloadImage = (req, res) => {
  const { filename } = req.params;

  // Construct the file path based on the upload directory
  const filePath = path.join(
    __dirname,
    "../uploads/packages", // The base folder for uploads
    filename
  );

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading image:", err.message);
      res.status(404).json({ message: "Image not found" });
    }
  });
};

module.exports = downloadImage;
