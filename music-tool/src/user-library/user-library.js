import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Library from "../library/library";
import "./user-library.css";
import { useParams } from "react-router-dom";

const UserLibrary = () => {
  const { userUid } = useParams(); // Use 'userUid' to match the route definition
  const [user, setUser] = useState(null);
  const { uid } = useParams();
  const [loading, setLoading] = useState(true);
  const [showAudioFiles, setShowAudioFiles] = useState(false);

  useEffect(() => {
    console.log("Received UID from route:", userUid); // Debugging
    if (userUid) {
      fetchUserData(userUid);
    }
  }, [userUid]);

  const fetchUserData = async (userId) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.error("User not found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      className="all-audio-container"
      sx={{
        width: "80%",
        maxWidth: "none",
        margin: "20px auto",
      }}
    >
      <Typography
        variant="h4"
        className="all-audio-title"
        mb={4}
        fontFamily={"Montserrat, sans-serif"}
        fontWeight="bold"
      >
        {user ? `${user.username || "User"}'s Library` : "User Library"}
      </Typography>

      <Box className="profile-header" mb={4}>
        <AccountCircleIcon sx={{ fontSize: 80, color: "##FFFFFF" }} />
        <Typography variant="h4" className="profile-title" mt={2}>
          {user ? user.username || "Anonymous" : "No User Found"}
        </Typography>
        {user && (
          <Typography variant="subtitle1" color="textSecondary">
            {user.email || "Email not available"}
          </Typography>
        )}
      </Box>

      <Card className="user-info">
        <CardContent>
          <Typography variant="h5" className="user-info-title" gutterBottom>
            Profile Overview
          </Typography>
          {user ? (
            <Box className="user-info-details">
              <Box className="user-info-row">
                <Typography variant="subtitle1" className="user-info-label">
                  Name:
                </Typography>
                <Typography variant="body1" className="user-info-value">
                  {user.username || "N/A"}
                </Typography>
              </Box>
              <Box className="user-info-row">
                <Typography variant="subtitle1" className="user-info-label">
                  Email:
                </Typography>
                <Typography variant="body1" className="user-info-value">
                  {user.email || "N/A"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" color="error">
              No user data available.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="primary"
        sx={{
          marginTop: "20px",
          fontWeight: "bold",
          background: "#6a11cb",
          maxWidth: "200px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        }}
        onClick={() => setShowAudioFiles(!showAudioFiles)}
      >
        {showAudioFiles ? "Hide Audio Files" : "Show Audio Files"}
      </Button>

      {showAudioFiles && (
        <Box className="audio-files" mt={4}>
          {/* Use Library component to display audio files */}
          <Library ownerUid={uid} />
        </Box>
      )}
    </Box>
  );
};

export default UserLibrary;
