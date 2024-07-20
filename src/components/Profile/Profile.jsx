import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { FaRegEdit } from "react-icons/fa";
import Footer from "../common/footer/Footer";
import Header from "../common/header/Header";
import { styled } from "@mui/system";
import { Avatar as ReactAvatar } from "react-avatar";
import { ClipLoader } from "react-spinners";

const ProfileContainer = styled(Container)({
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  marginBottom: "20px",
  alignItems: "center",
});

const ProfileCard = styled(Paper)({
  padding: "20px",
  maxWidth: "600px",
  width: "100%",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
});

const ProfileAvatar = styled(Avatar)({
  width: "120px",
  height: "120px",
  marginBottom: "20px",
  cursor: "pointer",
});

const EditIcon = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
});

const ProfileInfo = styled("div")({
  width: "100%",
  marginTop: "20px",
});

const Profile = ({ login }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const url = "http://localhost:9999";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        if (!jwtToken) {
          throw new Error("JWT token not found in localStorage");
        }

        const response = await axios.get(`${url}/api/c3/user/me`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        console.log(response.data.user);
        setUserData(response.data.user);
        setEditData(response.data.user);
        setAvatarUrl(response.data.user.avatar || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoadingSave(true); // Set loading state to true

    try {
      const jwtToken = localStorage.getItem("jwtToken");

      // Create a new object to collect updated data
      const updatedData = {};

      // Check each field and add it to updatedData if it has changed
      if (editData.name !== userData.name) {
        updatedData.name = editData.name;
      }
      if (editData.email !== userData.email) {
        updatedData.email = editData.email;
      }
      if (editData.number !== userData.number) {
        updatedData.number = editData.number;
      }
      if (userData.addresses.length > 0) {
        const latestAddress = userData.addresses[userData.addresses.length - 1];
        if (
          editData.address !== latestAddress?.address ||
          editData.pincode !== latestAddress?.pincode
        ) {
          updatedData.address = {
            address: editData.address,
            pincode: editData.pincode,
          };
        }
      } else if (editData.address || editData.pincode) {
        // Handle case where no addresses exist yet
        updatedData.address = {
          address: editData.address,
          pincode: editData.pincode,
        };
      }

      await axios.put(`${url}/api/c3/user/me/profileupdate`, updatedData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      // Fetch the updated user data
      const response = await axios.get(`${url}/api/c3/user/me`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      setUserData(response.data.user);
      setEditData(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setLoadingSave(false); // Set loading state to false
    }
  };

  const generateRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.multiavatar.com/${randomSeed}.svg`);
  };

  const handleSignout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <ClipLoader size={50} color="#123abc" />
      </Grid>
    );
  }

  if (!userData) {
    return <Typography variant="h6">No user data available</Typography>;
  }

  return (
    <div>
      <Header login={login} />
      <ProfileContainer>
        <ProfileCard elevation={3}>
          <EditIcon onClick={handleEditToggle}>
            <FaRegEdit fontSize={24} />
          </EditIcon>
          <ProfileAvatar
            src={
              avatarUrl ||
              userData.avatar ||
              "https://api.multiavatar.com/Binx Bond.svg"
            }
            alt="Avatar"
            onClick={generateRandomAvatar}
          />
          {isEditing ? (
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              value={editData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          ) : (
            <Typography variant="h5">{userData.name}</Typography>
          )}
          <ProfileInfo>
            <Typography variant="h6">Information</Typography>
            <Divider />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {isEditing ? (
                  <TextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={editData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                ) : (
                  <Typography variant="body1">
                    <strong>Email:</strong> {userData.email}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {isEditing ? (
                  <TextField
                    name="number"
                    label="Phone"
                    variant="outlined"
                    value={editData.number}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                ) : (
                  <Typography variant="body1">
                    <strong>Phone:</strong> {userData.number}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {isEditing ? (
                  <>
                    <TextField
                      name="address"
                      label="Address"
                      variant="outlined"
                      value={
                        editData.address || userData.addresses[0]?.address || ""
                      }
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      name="pincode"
                      label="Zipcode"
                      variant="outlined"
                      value={
                        editData.pincode || userData.addresses[0]?.pincode || ""
                      }
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </>
                ) : (
                  <>
                    {userData.addresses.length > 0 ? (
                      <div>
                        <Typography variant="body1">
                          <strong>Address:</strong>{" "}
                          {userData.addresses[userData.addresses.length - 1]
                            ?.address || "not provided"}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Zipcode:</strong>{" "}
                          {userData.addresses[userData.addresses.length - 1]
                            ?.pincode || "not provided"}
                        </Typography>
                      </div>
                    ) : (
                      <Typography variant="body1">
                        <strong>Address:</strong> not provided
                      </Typography>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
            {isEditing && (
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  {loadingSave ? <ClipLoader size={24} color="#fff" /> : "Save"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
              </div>
            )}
          </ProfileInfo>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#f44336",
              color: "white",
              marginTop: "20px",
            }}
            onClick={handleSignout}
          >
            Sign Out
          </Button>
        </ProfileCard>
      </ProfileContainer>
      <Footer />
    </div>
  );
};

export default Profile;
