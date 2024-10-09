import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Employees from "./Employees";
import Footer from "./Footer";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { auth } from "../firebase"; 
import { updateEmail, updatePassword, sendPasswordResetEmail } from "firebase/auth";

const EmployeeList = ({ admin, setAdmin }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [profilePicture, setProfilePicture] = useState(admin?.picture || "");
  const [newName, setNewName] = useState(admin?.username || "");
  const [newEmail, setNewEmail] = useState(admin?.email || ""); 
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Check if admin is logged in; if not, redirect to login page
  useEffect(() => {
    if (!admin) {
      navigate("/");
    }
  }, [admin, navigate]);

  useEffect(() => {
    if (admin?.picture) {
      setProfilePicture(admin.picture);
    }
  }, [admin?.picture]);

  const handleOpenProfile = () => {
    setOpenProfile(true);
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  // Update admin's email
  const handleUpdateEmail = async () => {
    if (newEmail !== admin?.email) {
      try {
        await updateEmail(auth.currentUser, newEmail);
        setAdmin((prev) => ({
          ...prev,
          email: newEmail,
        }));
        setAlert({
          open: true,
          message: "Email updated successfully",
          severity: "success",
        });
      } catch (error) {
        console.error("Error updating email:", error);
        setAlert({
          open: true,
          message: "Failed to update email",
          severity: "error",
        });
      }
    }
  };

  // Update admin's password
  const handleUpdatePassword = async () => {
    if (newPassword) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        setAlert({
          open: true,
          message: "Password updated successfully",
          severity: "success",
        });
      } catch (error) {
        console.error("Error updating password:", error);
        setAlert({
          open: true,
          message: "Failed to update password",
          severity: "error",
        });
      }
    }
  };

  // Send password reset email
  const handleSendResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, newEmail);
      setAlert({
        open: true,
        message: "Password reset email sent",
        severity: "success",
      });
    } catch (error) {
      console.error("Error sending reset email:", error);
      setAlert({
        open: true,
        message: "Failed to send password reset email",
        severity: "error",
      });
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = () => {
    setLoading(true);
    setTimeout(() => {
      setAdmin((prev) => ({
        ...prev,
        username: newName,
        picture: profilePicture,
      }));
      setLoading(false);
      handleCloseProfile();
    }, 1000);
  };

  const handleOpenLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await auth.signOut();
      // Clear admin state after logging out
      setAdmin(null); 
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#475569" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            Welcome, {admin?.username || "Guest"}
            {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile"
                width="50"
                style={{
                  borderRadius: "50%",
                  marginLeft: "10px",
                }}
              />
            )}
          </Typography>
          <Button color="inherit" onClick={handleOpenProfile}>
            Profile
          </Button>
          <Button color="inherit" component={Link} to="/deleted">
            Deleted Employees
          </Button>
          <Button color="inherit" onClick={handleOpenLogoutDialog}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          width: "100%",
        }}
      >
        <Container
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {loading ? <CircularProgress /> : <Employees />}
        </Container>
      </Box>

      <Footer />

      {/* Profile Dialog */}
      <Dialog open={openProfile} onClose={handleCloseProfile}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            id="profile-picture-upload"
            style={{ display: "none" }}
            onChange={handleProfilePictureUpload}
          />
          <label htmlFor="profile-picture-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<AddPhotoAlternateIcon />}
              sx={{ mt: 2 }}
            >
              Upload Picture
            </Button>
          </label>
          {profilePicture && (
            <img
              src={profilePicture}
              alt="Profile"
              width="100"
              style={{ marginTop: "10px" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfile} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateProfile} color="primary">
            Update Profile
          </Button>
          <Button onClick={handleUpdateEmail} color="primary">
            Update Email
          </Button>
          <Button onClick={handleUpdatePassword} color="primary">
            Update Password
          </Button>
          <Button onClick={handleSendResetEmail} color="primary">
            Reset Password via Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={handleCloseLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            color="white"
            sx={{ backgroundColor: "red" }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeList;
