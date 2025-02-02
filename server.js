const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.post('/run-docker', (req, res) => {
    const dockerArgs = [
        'run',
        '--rm',
        '-v', `C:\\Users\\Alexander\\Documents\\upscale_docker_test\\inputs:/app/in`,
        '-v', `C:\\Users\\Alexander\\Documents\\upscale_docker_test\\results:/app/out`,
        '699c9f490b12',
        'python', 'app.py'
    ];

    const dockerProcess = spawn('docker', dockerArgs, {
      env: {
        ...process.env,
        DOCKER_CONFIG: `${process.env.HOME}/.docker` // Use Windows-style path if needed
      }
    });
    let output = '';

    dockerProcess.stdout.on('data', (data) => {
        output += data.toString();
        console.log(data.toString());
    });

    dockerProcess.stderr.on('data', (data) => {
        output += data.toString();
        console.error(data.toString());
    });

    dockerProcess.on('close', (code) => {
        if (code === 0) {
            res.json({ success: true, output });
        } else {
            res.status(500).json({ success: false, error: `Docker process exited with code ${code}`, output });
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
