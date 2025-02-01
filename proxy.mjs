import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/jobs", async (req, res) => {
  try {
    const apiUrl =
      "https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs";

    const params = new URLSearchParams({
      was: "Softwareentwickler", // Freitextsuche (optional)
      /* wo: "Berlin", */
      size: 100,
      veroeffentlichtseit: 21, // Jobs der letzten 7 Tage
    });

    const headers = {
      "X-API-Key": "jobboerse-jobsuche",
    };

    const response = await fetch(`${apiUrl}?${params}`, { headers });

    // Überprüfe, ob die API erfolgreich geantwortet hat
    if (!response.ok) {
      throw new Error(`API-Fehler: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Gib die API-Daten zurück
    res.json({
      success: true,
      data: data,
      params: Object.fromEntries(params), // Konvertiere URLSearchParams zu einem Objekt
    });

    // Logge die Anfrage und die Antwort
    console.log("API-URL:", `${apiUrl}?${params}`);
    console.log("API-Antwort:", data);
  } catch (error) {
    console.error("Fehler:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy-Server läuft auf http://localhost:${PORT}`);
});
