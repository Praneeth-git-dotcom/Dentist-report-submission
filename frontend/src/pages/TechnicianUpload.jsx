import { useState } from "react";
import axios from "axios";
import "../styles/TechnicianUpload.css";

export default function TechnicianUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [scanType, setScanType] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("scanImage", file);
      formData.append("patientName", patientName);
      formData.append("patientId", patientId);
      formData.append("scanType", scanType);
      formData.append("region", region);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/scans/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setStatus("✅ Upload successful!");
        // Reset fields
        setFile(null);
        setPreview(null);
        setPatientName("");
        setPatientId("");
        setScanType("");
        setRegion("");
      } else {
        setStatus("❌ Upload failed: " + (res.data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("❌ Upload failed. Try again.");
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit} className="upload-card">
        <h2>Upload Oral Scan</h2>
        <p className="description">Securely upload patient scans</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {preview && (
          <div className="preview-container">
            <img
              src={preview}
              alt="Preview"
              className="preview-image"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Scan Type (e.g., X-Ray, CT)"
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Region (e.g., Upper Jaw)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        />

        <button type="submit">Upload</button>

        {status && <p className="status">{status}</p>}
      </form>
    </div>
  );
}
