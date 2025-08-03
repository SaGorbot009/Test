const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const categories = ["funny", "sad", "romantic", "action", "emotional"];

// Get All Videos of a Category
app.get('/api/videos/:category', (req, res) => {
  const { category } = req.params;
  if (!categories.includes(category)) return res.status(400).json({ message: "Invalid Category" });

  const data = JSON.parse(fs.readFileSync('data.json'));
  res.json(data[category]);
});

// Add New Video to a Category
app.post('/api/videos/:category', (req, res) => {
  const { category } = req.params;
  const { url } = req.body;

  if (!categories.includes(category)) return res.status(400).json({ message: "Invalid Category" });
  if (!url) return res.status(400).json({ message: "URL is required" });

  const data = JSON.parse(fs.readFileSync('data.json'));
  const newVideo = {
    id: (data[category].length + 1).toString(),
    url: url
  };

  data[category].push(newVideo);
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  res.json({ message: `${category} Video Added`, video: newVideo });
});

// Get Specific Video by Category & ID
app.get('/api/videos/:category/:id', (req, res) => {
  const { category, id } = req.params;
  if (!categories.includes(category)) return res.status(400).json({ message: "Invalid Category" });

  const data = JSON.parse(fs.readFileSync('data.json'));
  const video = data[category].find(v => v.id === id);
  if (!video) return res.status(404).json({ message: "Video not found" });
  res.json(video);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Running on Port ${PORT}`));