// File: /pages/api/generateSignedUrl.js
import { Storage } from '@google-cloud/storage';

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const storage = new Storage({credentials: credentials});
// Instantiate a storage client

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const bucketName = '3dobjects'; // Replace with your bucket name
    const filename = req.body.filename; // Filename should be sent in the request body

    try {
      // Define options for generating a signed URL
      const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType: 'application/octet-stream',
      };

      // Generate a signed URL
      const [signedUrl] = await storage
        .bucket(bucketName)
        .file(filename)
        .getSignedUrl(options);

      // Return the signed URL in the response
      res.status(200).json({ signedUrl });
    } catch (error) {
      // Log and return any errors
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    // Unsupported HTTP method
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
