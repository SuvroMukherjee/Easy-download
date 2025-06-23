# PDF Proxy Service

A simple Express.js microservice to securely proxy and download PDF (or other file) URLs, with support for AES-encrypted URLs and batch downloads as ZIP archives.

## Features
- Download a single file from an AES-encrypted URL
- Download multiple files as a ZIP archive (each URL AES-encrypted)
- CORS support
- Health check endpoint
- Error handling and 404 routes

## Environment Variables
- `PORT`: Port to run the service (default: 3000)
- `SECRET_KEY`: AES key for encrypting/decrypting URLs (must match frontend)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins (default: *)

## Endpoints

### `POST /pdf`
Download a single file by sending an AES-encrypted URL in the request body.

**Request Body:**
```json
{
  "encryptedUrl": "<ENCRYPTED_URL_STRING>"
}
```
**Response:**
- Streams the file as a download (Content-Type and filename auto-detected)

### `POST /pdfs-zip`
Download multiple files as a ZIP archive by sending an array of AES-encrypted URLs.

**Request Body:**
```json
{
  "encryptedUrls": ["<ENCRYPTED_URL1>", "<ENCRYPTED_URL2>"]
}
```
**Response:**
- Streams a ZIP file containing all files (or error text files if a download fails)

### `GET /health`
Health check endpoint. Returns status and timestamp.

### `GET /`
Returns a welcome/info message.

## Error Handling
- Returns 400 for missing/invalid input
- Returns 500 for server errors
- Returns 404 for unknown routes

## Usage Example (Single PDF)
```bash
curl -X POST http://localhost:3000/pdf \
  -H "Content-Type: application/json" \
  -d '{"encryptedUrl": "<ENCRYPTED_URL_STRING>"}' --output file.pdf
```

## Usage Example (Multiple PDFs as ZIP)
```bash
curl -X POST http://localhost:3000/pdfs-zip \
  -H "Content-Type: application/json" \
  -d '{"encryptedUrls": ["<ENCRYPTED_URL1>", "<ENCRYPTED_URL2>"]}' --output files.zip
```

## Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with your environment variables (see above).
3. Start the server:
   ```bash
   npm start
   ```

---

**Note:** The `SECRET_KEY` must match between your backend and frontend for encryption/decryption to work.
