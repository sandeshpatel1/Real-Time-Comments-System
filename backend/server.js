const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Adjust based on frontend URL
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  const sessionId = Math.random().toString(36).substring(7); // Simple session ID generation
  res.json({ sessionId, username });
});

// Get comments
app.get('/api/comments', (req, res) => {
  db.query('SELECT * FROM comments ORDER BY timestamp DESC', (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).json({ error: 'Error fetching comments' });
    } else {
      res.json(results);
    }
  });
});

// Post a comment and emit it via Socket.IO
app.post('/api/comments', (req, res) => {
    const { username, comment } = req.body;
  
    if (!comment || comment.trim() === '') {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }
  
    const sql = 'INSERT INTO comments (username, comment) VALUES (?, ?)';
    db.query(sql, [username, comment], (err, result) => {
      if (err) {
        console.error('Error saving comment:', err);
        return res.status(500).json({ error: 'Error saving comment' });
      } else {
        const newComment = { id: result.insertId, username, comment, timestamp: new Date() };
        io.emit('newComment', newComment); // Broadcast the new comment to all clients
        res.json(newComment);
      }
    });
  });

// Socket.IO connection for real-time events
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("userTyping", (username) => {
    socket.broadcast.emit("userTyping", username); // Notify others
  });

  socket.on("stopTyping", (username) => {
    socket.broadcast.emit("stopTyping", username); // Notify others to stop
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
