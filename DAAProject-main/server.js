const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API endpoint to compress text
app.post('/api/compress', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    // Escape text for command line
    const escapedText = text.replace(/"/g, '\\"');

    // Execute C++ program
    const exePath = path.join(__dirname, 'huffman.exe');
    const command = `"${exePath}" "${escapedText}"`;

    exec(command, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.error('Execution error:', error);
            return res.status(500).json({ error: 'Failed to execute C++ program', details: error.message });
        }

        if (stderr) {
            console.error('C++ stderr:', stderr);
        }

        try {
            // Parse JSON output from C++ program
            const result = JSON.parse(stdout);
            res.json(result);
        } catch (parseError) {
            console.error('Parse error:', parseError);
            console.error('C++ output:', stdout);
            res.status(500).json({ error: 'Failed to parse C++ output', output: stdout });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 CompressionBuilder Backend Server Started!`);
    console.log(`📡 Server running at: http://localhost:${PORT}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser\n`);
});
