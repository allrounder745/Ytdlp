const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/api/info", async (req, res) => {
  const videoURL = req.query.url;
  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: "Invalid URL" });
  }
  try {
    const info = await ytdl.getInfo(videoURL);
    const formats = ytdl.filterFormats(info.formats, "audioandvideo");
    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop(),
      formats: formats.map(f => ({
        quality: f.qualityLabel,
        url: f.url
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
