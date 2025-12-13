const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const supabase = require('../utils/supabase');
const auth = require('../middleware/auth'); 
const File = require('../models/File');

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    const userId = req.user._id.toString();
    const filename = `${Date.now()}-${file.originalname}`;

    // Upload to Supabase
    const { error } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(`${userId}/${filename}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error(error);
      return res.status(500).send('Upload failed');
    }

    // Save metadata in MongoDB
    await File.create({
      userId: req.user._id,
      originalName: file.originalname,
      filename: filename,
      storageKey: `${userId}/${filename}`, // store full path in bucket
      size: file.size,
    });

    res.redirect('/home'); // keep existing redirect
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// --------------------
// List all files for the logged-in user
// --------------------
router.get('/', auth, async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching files');
  }
});

// --------------------
// Download a file by ID
// --------------------
router.get('/download/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    // ✅ correct ownership check
    if (!file.userId || file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send('Not authorized');
    }

    if (!file.storageKey) {
      return res.status(500).send('File path missing. Re-upload required.');
    }

    const { data, error } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .download(file.storageKey);

    if (error || !data) {
      console.error('Supabase download error:', error);
      return res.status(404).send('File missing from storage');
    }

    const buffer = Buffer.from(await data.arrayBuffer());

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.originalName}"`
    );
    res.setHeader(
      'Content-Type',
      file.mimeType || 'application/octet-stream'
    );

    res.send(buffer);
  } catch (err) {
    console.error('DOWNLOAD ERROR:', err);
    res.status(500).send('Download failed');
  }
});


// DELETE a file
router.post('/delete/:id', auth, async (req, res) => {
  try {

    const file = await File.findOne({ _id: req.params.id, userId: req.user._id });
    if (!file) return res.status(404).send("File not found");

    const bucket = process.env.SUPABASE_BUCKET;
    const filePath = `${file.userId}/${file.filename}`;


    // Delete from Supabase
    const { error: deleteError } = await supabase
      .storage
      .from(bucket)
      .remove([filePath]);   // VERY IMPORTANT → must match EXACT filename

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return res.status(500).send("Failed to delete file from storage");
    }

    // Delete from MongoDB
    await File.deleteOne({ _id: file._id });

    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


module.exports = router;
