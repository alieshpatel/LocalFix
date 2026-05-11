const ImageKit = require("imagekit");

exports.getAuthToken = async (req, res) => {
  try {
    // Check if keys exist in .env
    if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_PUBLIC_KEY) {
      return res.status(400).json({ error: "ImageKit keys not configured" });
    }

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    // Generate authentication parameters for client-side upload
    const { token, expire, signature } = imagekit.getAuthenticationParameters();
    
    res.json({
      token,
      expire,
      signature,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY
    });
  } catch (error) {
    console.error("Auth Token Error:", error);
    res.status(500).json({ error: "Failed to generate auth token" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image provided" });

    // Check if keys exist in .env
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY) {
      console.warn("⚠️ ImageKit keys not found in .env! Using a placeholder image URL.");
      return res.json({ url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" });
    }

    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });

    // Convert buffer to base64 for reliable upload
    const fileBase64 = req.file.buffer.toString("base64");

    const result = await imagekit.upload({
      file: fileBase64, 
      fileName: req.file.originalname || `image_${Date.now()}`,
    });
    
    res.json({ url: result.url });
  } catch (error) {
    console.error("Upload Error:", error);
    // If the upload fails (e.g., due to invalid API keys), fallback to a placeholder
    console.warn("⚠️ ImageKit upload failed. Falling back to placeholder image.");
    res.json({ url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" });
  }
};
