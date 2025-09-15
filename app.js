const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''))
});
const upload = multer({ storage });

// OCR endpoint
app.post('/ocr', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ text: 'No file uploaded' });

    const pythonPath = 'C:\\Users\\MY PC\\AppData\\Local\\Programs\\Python\\Python313\\python.exe';
    const scriptPath = path.join(__dirname, 'imgtotext.py');

    const pythonProcess = spawn(pythonPath, [scriptPath, req.file.path]);

    let output = '';
    pythonProcess.stdout.on('data', (data) => output += data.toString());
    pythonProcess.stderr.on('data', (data) => console.error(data.toString()));

    pythonProcess.on('close', () => {
        res.json({ text: output.trim() });
    });
});

app.listen(5000, () => console.log('Backend running on port 5000'));
