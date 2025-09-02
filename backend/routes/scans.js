// backend/routes/scans.js
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const db = require("../db");

dotenv.config();

console.log("Cloudinary ENV:", {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "****" : "MISSING"
});

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer (store file in memory buffer)
const upload = multer({ storage: multer.memoryStorage() });

// ================= Upload Scan (Technician only) =================
router.post(
  "/upload",
  authenticateToken,
  authorizeRole("Technician"),
  upload.single("scanImage"),
  (req, res) => {
    try {
      const { patientName, patientId, scanType, region } = req.body;

      console.log("Incoming upload request:", {
        body: req.body,
        file: req.file?.originalname,
        user: req.user, // ✅ log user to check role
      });

      // ✅ Validate file
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, error: "No file uploaded" });
      }

      // ✅ Validate required fields
      if (!patientName || !patientId || !scanType || !region) {
        return res
          .status(400)
          .json({ success: false, error: "Missing required fields" });
      }

      // ✅ Upload file to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "oralvis_scans" },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary error:", error);
            return res.status(500).json({
              success: false,
              error: "Upload to Cloudinary failed",
              details: error.message,
            });
          }

          const imageUrl = result.secure_url;
          const uploadDate = new Date().toISOString();

          const query = `
            INSERT INTO scans (patientName, patientId, scanType, region, imageUrl, uploadDate)
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          db.run(
            query,
            [patientName, patientId, scanType, region, imageUrl, uploadDate],
            function (err) {
              if (err) {
                console.error("❌ DB insert error:", err);
                return res
                  .status(500)
                  .json({ success: false, error: "Database insert failed" });
              }

              console.log("✅ Scan uploaded successfully with ID:", this.lastID);

              return res.status(201).json({
                success: true,
                message: "Scan uploaded successfully",
                scan: {
                    id: this.lastID,
                    patientName,
                    patientId,
                    scanType,
                    region,
                    imageUrl,
                    uploadDate,
                },
                });

            }
          );
        }
      );

      // ✅ Stream file buffer to Cloudinary
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (err) {
      console.error("❌ Unexpected error in /upload:", err);
      return res
        .status(500)
        .json({ success: false, error: "Unexpected server error" });
    }
  }
);

// ================= Get All Scans (Dentist only) =================
router.get("/", authenticateToken, authorizeRole("Dentist"), (req, res) => {
  const query = `SELECT * FROM scans ORDER BY uploadDate DESC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("❌ DB read error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Database read failed" });
    }
    return res.json({ success: true, data: rows });
  });
});

module.exports = router;
