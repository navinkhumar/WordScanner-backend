const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''))
});
const upload = multer({ storage });

// OCR endpoint
app.post('/ocr', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ text: 'No file uploaded' });

    const scriptPath = path.join(__dirname, 'imgtotext.py');

    // Use 'python3' for Render Linux environment
    const pythonProcess = spawn('python3', [scriptPath, req.file.path]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => output += data.toString());
    pythonProcess.stderr.on('data', (data) => console.error(data.toString()));

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ text: 'OCR process failed' });
        }
        res.json({ text: output.trim() });
    });
});

// Use PORT from environment (Render sets it)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
