const axios = require("axios");
const { MongoClient } = require("mongodb");
const express = require("express");
const path = require("path");

const app = express();
const url = "https://api.deezer.com/chart/0/tracks";
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/musicdb";

// Servir les fichiers statiques (HTML/CSS)
app.use(express.static(path.join(__dirname, "public")));

// API endpoint : retourne les chansons depuis MongoDB
app.get("/api/songs", async (req, res) => {
  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    const db = client.db("musicdb");
    const songs = await db.collection("songs").find({}).toArray();
    await client.close();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function fetchSongs() {
  try {
    console.log("Fetching songs from Deezer API...");

    const response = await axios.get(url);

    const songs = response.data.data.slice(0, 10).map((song) => ({
      title: song.title,
      artist: song.artist.name,
      album: song.album.title,
      duration: song.duration,
      rank: song.rank,
      cover: song.album.cover_medium,
      preview: song.preview,
    }));

    console.log(`Fetched ${songs.length} songs`);

    let client;
    let retries = 10;
    while (retries > 0) {
      try {
        client = new MongoClient(mongoUrl);
        await client.connect();
        console.log("Connected to MongoDB!");
        break;
      } catch (err) {
        console.log(`MongoDB not ready, retrying... (${retries} attempts left)`);
        retries--;
        await new Promise((res) => setTimeout(res, 3000));
      }
    }

    if (!client) {
      throw new Error("Could not connect to MongoDB after multiple retries");
    }

    const db = client.db("musicdb");
    const collection = db.collection("songs");

    await collection.deleteMany({});
    await collection.insertMany(songs);

    console.log("✅ Songs saved to MongoDB:");
    songs.forEach((s, i) => {
      console.log(`  ${i + 1}. "${s.title}" - ${s.artist}`);
    });

    await client.close();
    console.log("Done! Starting web server on port 3000...");

    app.listen(3000, () => {
      console.log("🌐 Web server running at http://localhost:3000");
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

fetchSongs();
