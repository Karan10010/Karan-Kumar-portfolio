const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 5000;
const submissionsPath = path.join(__dirname, 'submissions.json');

function openBrowser(url) {
  const platform = process.platform;
  let command;

  if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    command = `open "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      console.error('Unable to open browser automatically:', error);
    }
  });
}

// Ensure submissions file exists
if (!fs.existsSync(submissionsPath)) {
  fs.writeFileSync(submissionsPath, JSON.stringify([]), 'utf8');
}

function readSubmissions() {
  const raw = fs.readFileSync(submissionsPath, 'utf8');
  return JSON.parse(raw || '[]');
}

function writeSubmissions(submissions) {
  fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2), 'utf8');
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const submissions = readSubmissions();
  const newEntry = {
    id: submissions.length ? submissions[submissions.length - 1].id + 1 : 1,
    name,
    email,
    subject: subject || 'General inquiry',
    message,
    created_at: new Date().toISOString()
  };

  submissions.push(newEntry);
  writeSubmissions(submissions);

  res.json({ success: true, id: newEntry.id });
});

app.get('/api/submissions', (req, res) => {
  const submissions = readSubmissions();
  res.json(submissions.reverse());
});

function startServer(listenPort) {
  const server = app.listen(listenPort, () => {
    const url = `http://localhost:${listenPort}`;
    console.log(`Portfolio backend running on ${url}`);

    if (process.env.NODE_ENV !== 'production') {
      openBrowser(url);
    }
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${listenPort} is already in use. Trying port ${listenPort + 1}...`);
      startServer(listenPort + 1);
      return;
    }

    console.error('Server error:', error);
    process.exit(1);
  });
}

startServer(port);
