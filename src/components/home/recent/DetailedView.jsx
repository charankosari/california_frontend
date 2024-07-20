import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  IconButton,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import Carousel from "react-material-ui-carousel"; // MUI Carousel
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";
import "./DetailedView.css";

const DetailedView = () => {
  const history = useHistory();
  const { id } = useParams(); // Get the ID from URL params
  const [userData, setUserData] = useState(null); // State to store user data
  const [service, setService] = useState(null); // State to store service data
  const [isFavorited, setIsFavorited] = useState(false);
  const [bookingSlots, setBookingSlots] = useState({});
  const [availableDates, setAvailableDates] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/api/c3/user/getservice/${id}`
        );
        setService(response.data.data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchServiceData();
  }, [id]);

  useEffect(() => {
    if (!service) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9999/api/c3/user/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        const data = response.data.user;
        setUserData(data);
        const favoriteServiceIds = data.wishList.map((item) => item.service._id);
        setIsFavorited(favoriteServiceIds.includes(service._id));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    const fetchBookingSlots = async () => {
      const slotsData = service.bookingIds || {};
      setBookingSlots(slotsData);
      setAvailableDates(Object.keys(slotsData));
    };

    fetchBookingSlots();
  }, [service]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const handlePaymentSuccess = () => {
      history.push("/success");
    };

    const stripeButton = document.querySelector("stripe-buy-button");
    if (stripeButton) {
      stripeButton.addEventListener("paymentSuccess", handlePaymentSuccess);
    }

    return () => {
      if (stripeButton) {
        stripeButton.removeEventListener(
          "paymentSuccess",
          handlePaymentSuccess
        );
      }
    };
  }, [history]);

  const handleToggleFavorite = async () => {
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:9999/api/c3/user/me/wishlist/${service._id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setIsFavorited(!isFavorited);
      setAlertMessage(
        isFavorited ? "Removed from favorites" : "Added to favorites"
      );
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setAlertMessage("Failed to update favorites");
      setAlertSeverity("error");
    } finally {
      setLoading(false);
      setAlertOpen(true);
    }
  };

  const handleBookNow = (date) => {
    sessionStorage.setItem(
      "userDetails",
      JSON.stringify({
        name: userData.name,
        email: userData.email,
        number: userData.number,
        serviceId: service._id,
        amount: service.amount,
        date: date,
      })
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  if (!service) {
    return (
      <>
        <Header />
        <Container style={{ padding: "20px" }}>
          <Typography variant="h3" gutterBottom>
            Service Details
          </Typography>
          <Typography variant="body1" style={{ marginTop: 20 }}>
            Service data not found.
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container style={{ marginTop: "30px" }}>
        <Card style={{ maxWidth: "800px", margin: "auto" }}>
          <CardContent>
            <Box style={{ position: "relative", textAlign: "center" }}>
              <IconButton
                onClick={handleToggleFavorite}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: isFavorited ? "#f44336" : "#808080",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : isFavorited ? (
                  <FaHeart size={24} />
                ) : (
                  <FaRegHeart size={24} />
                )}
              </IconButton>
              <CardHeader
                title={
                  service.service.charAt(0).toUpperCase() +
                  service.service.slice(1)
                }
                subheader={`Price: $${service.amount}`}
              />
              <img
                src={service.image || "https://via.placeholder.com/800x400"}
                alt={service.name}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginTop: "20px",
                }}
              />
              <Typography variant="body1" style={{ marginTop: "20px" }}>
                {service.description}
              </Typography>
              <Divider style={{ margin: "20px 0" }} />
              <Typography variant="body2" color="textSecondary">
                <strong>Email:</strong> {service.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Phone:</strong> {service.number}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Address:</strong>{" "}
                {service.addresses.map((addr, index) => (
                  <span key={index}>{`${addr.address}, ${addr.pincode}`}</span>
                ))}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                style={{ marginTop: "20px" }}
              >
                <strong>Available Times:</strong> 9 AM to 4 PM
              </Typography>
              <Divider style={{ margin: "20px 0" }} />
              <Typography variant="h6" style={{ marginBottom: "10px" }}>
                <strong>Available Dates</strong>
              </Typography>
              <Carousel
                navButtonsAlwaysVisible
                indicators={false}
                autoPlay={false}
                style={{ marginTop: "20px" }}
              >
                {availableDates.map((date) => {
                  const slots = bookingSlots[date];
                  const availableSlots = Object.values(slots).filter(
                    (slot) => slot.id === null
                  ).length;
                  return (
                    <Box
                      key={date}
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography variant="h6">{date}</Typography>
                      <Typography
                        variant="body2"
                        color={
                          availableSlots > 0 ? "textPrimary" : "textSecondary"
                        }
                      >
                        {availableSlots > 0
                          ? `${availableSlots} slots remaining`
                          : "No slots available"}
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleBookNow(date)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </Box>
                  );
                })}
              </Carousel>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Payment Options</DialogTitle>
        <DialogContent>
          <section className="add-card page">
            <stripe-buy-button
              buy-button-id="buy_btn_1Pe9hNJskBab91Snge0Jtuq6"
              publishable-key="pk_test_51Pe9aMJskBab91SnmTlz9dpWAZK8aOevsmj8eeZ5hj3GxI10GFbNlYtRA8chHi2sBorFGqBtOLEVurBAMFE0ePAj00P2npoi4F"
            ></stripe-buy-button>
          </section>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default DetailedView;