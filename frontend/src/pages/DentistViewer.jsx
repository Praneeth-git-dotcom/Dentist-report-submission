import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dentist.css";

export default function DentistViewer() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [modalUrl, setModalUrl] = useState(null);

  useEffect(() => {
    fetchScans();
    // eslint-disable-next-line
  }, []);

  const fetchScans = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found — please log in.");
        setScans([]);
        setLoading(false);
        return;
      }

      const base = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
      const res = await axios.get(`${base}/scans`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.success) {
        setScans(res.data.data || []);
      } else {
        setError(res.data?.error || "Failed to fetch scans.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred while fetching scans.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = scans.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (s.patientName || "").toLowerCase().includes(q) ||
      String(s.patientId || "").toLowerCase().includes(q) ||
      (s.scanType || "").toLowerCase().includes(q) ||
      (s.region || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="dv-root">
      <div className="dv-header">
        <div>
          <div className="dv-title">Uploaded Oral Scans</div>
          <div className="dv-sub">All scans uploaded by technicians — view thumbnails and open full image.</div>
        </div>

        <div className="dv-controls">
          <input
            className="dv-search"
            placeholder="Search by patient name, ID, scan type or region..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-ghost" onClick={fetchScans} aria-label="Refresh list">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="dv-empty">Loading scans…</div>
      ) : error ? (
        <div className="dv-empty" style={{ color: "#b91c1c" }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div className="dv-empty">No scans available.</div>
      ) : (
        <div className="dv-grid" role="list">
          {filtered.map((scan) => (
            <article className="dv-card" key={scan.id} role="listitem" aria-label={`${scan.patientName} ${scan.scanType}`}>
              <div className="dv-thumb" onClick={() => setModalUrl(scan.imageUrl)} style={{cursor:'pointer'}}>
                <img src={scan.imageUrl} alt={`${scan.patientName} ${scan.scanType}`} loading="lazy" />
              </div>

              <div className="dv-body">
                <div style={{display:'flex', justifyContent:'space-between', gap:8}}>
                  <div>
                    <div className="dv-patient">{scan.patientName || "Unknown"}</div>
                    <div className="dv-meta">{scan.patientId} • {scan.scanType}</div>
                  </div>
                  <div style={{textAlign:'right', color:'#6b7280', fontSize:12}}>
                    {scan.uploadDate ? new Date(scan.uploadDate).toLocaleDateString() : ""}
                  </div>
                </div>

                <div className="dv-meta">{scan.region}</div>

                <div className="dv-actions" style={{marginTop:6}}>
                  <button className="btn" onClick={() => setModalUrl(scan.imageUrl)}>View</button>
                  <a className="btn btn-ghost" href={scan.imageUrl} target="_blank" rel="noreferrer">Open</a>
                  <a className="btn btn-ghost" href={scan.imageUrl} download>Download</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalUrl && (
        <div className="dv-modal-backdrop" onClick={() => setModalUrl(null)}>
          <div className="dv-modal" onClick={(e) => e.stopPropagation()}>
            <img src={modalUrl} alt="Full scan" />
            <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:10}}>
              <a className="btn btn-ghost" href={modalUrl} target="_blank" rel="noreferrer">Open in new tab</a>
              <a className="btn" href={modalUrl} download>Download</a>
              <button className="btn btn-ghost" onClick={() => setModalUrl(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
