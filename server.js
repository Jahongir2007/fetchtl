const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/time', (req, res) => {
  res.json({ time: new Date().toLocaleTimeString() });
});

app.listen(3000, ()=> console.log(`Server running at PORT 3000`));
