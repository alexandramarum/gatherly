import express from 'express'
import cloudinary from '../config/cloudinary.js'

const router = express.Router();

// Upload an image
router.post('/:eventId', async (req, res) => {
    const { eventId } = req.params
    const { image } = req.body

    if (!image) return res.status(400).json({ error: "No image provided" });

    try {
        cloudinary.uploader.upload_large(image, {
        public_id: eventId,
        overwrite: true,
        quality: "auto"
        })

        res.status(200).json({
        message: `Image fetched successfully for event '${eventId}'`,
        data: result
        });
    } catch (error) {
        res.status(500).json({
            error: `Failed to upload image for event '${eventId}'`,
            details: error.message
        });
    }
})

// Fetch an image
router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await cloudinary.api.resource(eventId);

    res.status(200).json({
      message: `Image fetched successfully for event '${eventId}'`,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch image for event '${eventId}'`,
      details: error.message
    });
  }
});

// Delete image
router.delete('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await cloudinary.uploader.destroy(eventId);

    if (result.result === "not found") {
      return res.status(404).json({ error: `Image with ID '${eventId}' not found.` });
    }

    res.status(200).json({
      message: `Image with ID '${eventId}' deleted successfully`,
      result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to delete event image",
      details: error.message
    });
  }
});


export default router;