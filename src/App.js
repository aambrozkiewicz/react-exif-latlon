import EXIF from "exif-js";
import { useState } from "react";
import "./App.css";
import { ConvertDMSToDD, downloadCSV } from "./utils";

function App() {
  const [photos, setPhotos] = useState([]);

  function onChange(e) {
    [...e.target.files].forEach((file) => {
      EXIF.getData(file, () => {
        const tags = EXIF.getAllTags(file);

        var lat = ConvertDMSToDD(...tags.GPSLatitude, tags.GPSLatitudeRef);
        var lon = ConvertDMSToDD(...tags.GPSLongitude, tags.GPSLongitudeRef);
        setPhotos((p) => [...p, { lat, lon, file, id: Date.now() }]);
      });
    });
  }

  function toCSV() {
    downloadCSV(
      photos.reduce((prev, p) => [...prev, [p.file.name, p.lat, p.lon]], []),
      "coords.csv"
    );
  }

  return (
    <div className="App">
      <header>
        <h1>LatLon</h1>
        <p>Extract Latitude & Longitude from photos using EXIF</p>
      </header>
      <section>
        <input type="file" multiple onChange={onChange} />
      </section>
      <section>
        {photos.map((photo) => (
          <div key={photo.id} className="photo">
            <div className="text-muted">{photo.file.name}</div>
            <div>
              {photo.lat}, {photo.lon}
            </div>
            <div>
              <a
                href={`https://www.google.com/maps?q=${photo.lat},${photo.lon}`}
                target="_blank"
                rel="noreferrer"
              >
                Google ↗
              </a>
            </div>
          </div>
        ))}
      </section>
      <section style={{ display: photos.length ? "block" : "none" }}>
        <button className="button-39" onClick={toCSV}>
          Download CSV
        </button>
      </section>
      <section>
        <a
          href="https://github.com/aambrozkiewicz/react-exif-latlon"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png"
            alt="GitHub Logo"
            style={{ width: "30px" }}
          />
        </a>
      </section>
    </div>
  );
}

export default App;
