const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Set up storage for uploaded audio files
const upload = multer({ dest: 'uploads/' });

/**
 * POST /upload
 * Route for handling audio file uploads and processing
 */
router.post('/upload', upload.single('audioFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    
    console.log(`Processing uploaded file: ${filePath}`);

    // Call Python script for processing audio
    const pythonProcess = spawn('python3', ['process_audio.py', filePath]);

    let outputData = '';

    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error processing audio: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);

        // Send the processed MusicXML/MIDI data back to client
        res.json({ success: true, musicXML: outputData });

        // Delete the uploaded file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting file: ${err}`);
        });
    });
});

/**
 * GET /status
 * Check server status
 */
router.get('/status', (req, res) => {
    res.json({ status: 'Audio API is running' });
});

module.exports = router;
