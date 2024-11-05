"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Container, Paper, List, ListItem, ListItemText } from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000");

const CommentsPage = () => {
  const [username, setUsername] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      window.location.href = "/login";
      return;
    }
    setUsername(storedUsername);

    const fetchComments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/comments");
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();

    const handleNewComment = (comment) => {
      // Check if the comment is already in the state to prevent duplicates
      if (!comments.some((c) => c.id === comment.id)) {
        setComments((prevComments) => [comment, ...prevComments]);
      }
    };

    socket.on("newComment", handleNewComment);

    socket.on("userTyping", (user) => {
      setTypingUser(user);
      setIsTyping(true);
    });

    socket.on("stopTyping", () => {
      setIsTyping(false);
      setTypingUser("");
    });

    return () => {
      socket.off("newComment", handleNewComment);
      socket.off("userTyping");
      socket.off("stopTyping");
    };
  }, [comments]); // Dependency array updated to listen to comments changes

  const handleCommentSubmit = async () => {
    if (newComment.trim()) {
      const commentPayload = { username, comment: newComment };
      try {
        const response = await axios.post("http://localhost:4000/api/comments", commentPayload);
        // Emit the new comment only after confirming the backend received it
        socket.emit("newComment", { ...commentPayload, id: response.data.id, timestamp: new Date().toISOString() });
        setNewComment(""); // Clear the input after successful post
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    } else {
      alert("Comment cannot be empty.");
    }
  };

  const handleTyping = () => {
    socket.emit("userTyping", username);
    setTimeout(() => socket.emit("stopTyping"), 1000);
  };

  return (
    <Container component="main" maxWidth="md">
      {isTyping && <Typography variant="body2" color="textSecondary">{`${typingUser} is typing...`}</Typography>}
      <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 1, width: "100%" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a comment..."
          value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value);
            handleTyping();
          }}
          multiline
          rows={2}
        />
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleCommentSubmit}
        >
          Post Comment
        </Button>
      </Box>
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Comments
        </Typography>
        <Paper elevation={3} sx={{ p: 2, width: "100%", mb: 2 }}>
          <List>
            {comments.map((comment) => (
              <ListItem key={`${comment.id}-${comment.timestamp}`} divider>
                <ListItemText
                  primary={`${comment.username} says:`}
                  secondary={comment.comment}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default CommentsPage;
