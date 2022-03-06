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

        var lat = ConvertDMSToDD(...tags.GPSLatitude, tags.GPLatitudeRef);
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
        <h1>exif photos</h1>
      </header>
      <section>
        <input type="file" multiple onChange={onChange} />
      </section>
      <section>
        {photos.map((photo) => (
          <div key={photo.id} className="photo">
            <img className="photo" src={URL.createObjectURL(photo.file)} />
            <div className="photo-summary">
              {photo.lat}, {photo.lon}
              <div>
                <a
                  href={`https://www.google.com/maps?q=${photo.lat},${photo.lon}`}
                  target="_blank"
                >
                  Otwórz w Google Maps
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section style={{ display: photos.length ? "block" : "none" }}>
        <button className="button-39" onClick={toCSV}>
          Pobierz do CSV
        </button>
      </section>
    </div>
  );
}

export default App;
