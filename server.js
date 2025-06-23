const express = require('express');
const cors = require('cors');
const axios = require('axios');
const CryptoJS = require('crypto-js'); // Use crypto-js for compatibility with frontend
const archiver = require('archiver');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
// const SECRET_KEY = 'A75|n>Xh_?;I}`YTI%mKEQ/DZ+:K(9Y['; // Must match frontend
const SECRET_KEY = process.env.SECRET_KEY;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Use POST for /pdf to support encryptedUrl in body only
app.post('/pdf', async (req, res) => {
  const encryptedUrl = req.body?.encryptedUrl;
  if (!encryptedUrl) {
    return res.status(400).json({ error: 'encryptedUrl is required in the request body' });
  }
  try {
    // Decrypt using crypto-js for compatibility with frontend
    const bytes = CryptoJS.AES.decrypt(encryptedUrl, SECRET_KEY);
    const fileUrl = bytes.toString(CryptoJS.enc.Utf8);
    if (!fileUrl) {
      return res.status(400).json({ error: 'Failed to decrypt fileUrl' });
    }
    const response = await axios.get(fileUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch file', details: error.message });
  }
});

// New route to handle multiple encrypted URLs and return a zip file
app.post('/pdfs-zip', async (req, res) => {
  const encryptedUrls = req.body?.encryptedUrls;
  if (!Array.isArray(encryptedUrls) || encryptedUrls.length === 0) {
    return res.status(400).json({ error: 'encryptedUrls (array) is required in the request body' });
  }
  try {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="files.zip"');
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    for (let i = 0; i < encryptedUrls.length; i++) {
      const encryptedUrl = encryptedUrls[i];
      const bytes = CryptoJS.AES.decrypt(encryptedUrl, SECRET_KEY);
      const fileUrl = bytes.toString(CryptoJS.enc.Utf8);
      if (!fileUrl) continue;
      try {
        const response = await axios.get(fileUrl, { responseType: 'stream' });
        archive.append(response.data, { name: `file${i + 1}.pdf` });
      } catch (err) {
        archive.append(`Failed to fetch: ${fileUrl}\n${err.message}`, { name: `error${i + 1}.txt` });
      }
    }
    archive.finalize();
  } catch (error) {
    res.status(500).json({ error: 'Failed to create zip', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
