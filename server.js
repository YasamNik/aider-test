const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/run-docker', (req, res) => {
    const dockerArgs = [
        'run',
        '--rm',
        '--gpus', 'all',
        '-v', `${process.cwd()}/in:/app/inputs`,
        '-v', `${process.cwd()}/out:/app/results`,
        'upscale-docker-image',
        'python', 'inference_realesrgan.py',
        '-n', 'sem_train_masked',
        '12345334'
    ];

    const dockerProcess = spawn('docker', dockerArgs);
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
