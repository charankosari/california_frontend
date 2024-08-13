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
  TextField,
  Rating,
} from "@mui/material";
import moment from "moment";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import Carousel from "react-material-ui-carousel";
import Header from "../../common/header/Header";
import Footer from "../../common/footer/Footer";
import "./DetailedView.css";

const DetailedView = () => {
  const history = useHistory();
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [service, setService] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [bookingSlots, setBookingSlots] = useState({});
  const [availableDates, setAvailableDates] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const fetchServiceData = async () => {
    try {
      const response = await axios.get(
        `https://oneapp.trivedagroup.com/api/c3/user/getservice/${id}`
      );
      setService(response.data.data);
    } catch (error) {
      console.error("Error fetching service data:", error);
    }
  };
  useEffect(() => {
  

    fetchServiceData();
  }, [id]);

  useEffect(() => {
    if (!service) return;
if(localStorage.getItem('jwtToken')===null){      
  alert('please login to book a service');
  history.push('/login')
  return;
};
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://oneapp.trivedagroup.com/api/c3/user/me",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        const data = response.data.user;
        setUserData(data);
        const favoriteServiceIds = data.wishList.map((item) => item.service);
        setIsFavorited(favoriteServiceIds.includes(service._id));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    const fetchBookingSlots = async () => {
      const slotsData = service.bookingIds || {};
    
      // Get the current date and time using moment
      const currentDate = moment();
      const currentTime = currentDate.hour();
    
      // Filter the slotsData to remove past dates and the current date if the time crosses 12 PM
      const filteredSlotsData = Object.keys(slotsData).reduce((acc, date) => {
        const slotDate = moment(date);
    
        if (
          slotDate.isAfter(currentDate, 'day') || 
          (slotDate.isSame(currentDate, 'day') && currentTime < 12)
        ) {
          acc[date] = slotsData[date]; 
        }
    
        return acc;
      }, {});
      setBookingSlots(filteredSlotsData);
      setAvailableDates(Object.keys(filteredSlotsData));
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
        `https://oneapp.trivedagroup.com/api/c3/user/me/wishlist/${service._id}`,
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

  const handleReviewOpen = () => {
    setReviewOpen(true);
  };

  const handleReviewClose = () => {
    setReviewOpen(false);
  };

    const handleSubmitReview = async () => {
      setLoading(true);
      try {
        await axios.post(
          "https://oneapp.trivedagroup.com/api/c3/user/createreview",
          {
            rating,
            comment,
            serviceId: service._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        setAlertMessage("Review submitted successfully");
        setAlertSeverity("success");
        fetchServiceData();
        setReviewOpen(false);
      } catch (error) {
        console.error("Error submitting review:", error);
        setAlertMessage("Failed to submit review");
        setAlertSeverity("error");
      } finally {
        setLoading(false);
        setAlertOpen(true);
      }
    };

  if (!service) {
    return (
      <>
        <Header />
        <Container style={{ padding: "20px" }}>
          <Typography variant="h3" gutterBottom>
            Service Details
          </Typography>
          <Typography variant="body1" style={{ marginTop: 20 }} sx={{minHeight:'40vh'}}>
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
                 'Selected Service : '+ service.service.charAt(0).toUpperCase() +
                  service.service.slice(1)
                }
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
                <strong>Name:</strong> {service.name}
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
                      <Typography variant="body1">
                        {new Date(date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {availableSlots} slots available
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "10px" }}
                        onClick={() => handleBookNow(date)}
                      >
                        Book Now
                      </Button>
                    </Box>
                  );
                })}
              </Carousel>
              <Divider style={{ margin: "20px 0" }} />
          

             
            </Box>
          </CardContent>
        </Card>

        <Box
  style={{
    marginTop: "40px",
    padding: "20px",
    borderRadius: "12px",
    backgroundColor: "#f5f5f5",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  }}
>
  <Typography
    variant="h4"
    style={{
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333",
      textAlign: "center",
    }}
  >
    User Reviews
  </Typography>
  <Box style={{ maxHeight: "400px", overflowY: "auto" }}>
    {service.reviews.length > 0 ? (
      service.reviews.map((review, index) => (
        <Box
          key={index}
          style={{
            backgroundColor: "#fff",
            marginBottom: "15px",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <Box display="flex" alignItems="center" marginBottom="10px">
            <Box
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#4A90E2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                marginRight: "10px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {review.username.charAt(0)}
            </Box>
            <Typography variant="h6" style={{ color: "#333", fontWeight: "500" }}>
              {review.username}
            </Typography>
          </Box>
          <Box marginBottom="10px">
            <Rating value={review.rating} readOnly size="medium" />
          </Box>
          <Typography
            variant="body1"
            style={{
              color: "#555",
              lineHeight: "1.6",
            }}
          >
            {review.comment}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography variant="body1" style={{ textAlign: "center", color: "#999" }}>
        No reviews yet. Be the first to leave a review!
      </Typography>
    )}
  </Box>
  <Button
    variant="contained"
    color="primary"
    style={{
      marginTop: "20px",
      display: "block",
      width: "100%",
      padding: "10px",
      backgroundColor: "#4A90E2",
      color: "#fff",
      fontWeight: "bold",
      borderRadius: "8px",
      textTransform: "none",
    }}
    onClick={handleReviewOpen}
  >
    Leave a Review
  </Button>
</Box>
      </Container>






      <Footer />

      {/* Review Modal */}
      <Dialog open={reviewOpen} onClose={handleReviewClose}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Rating
              name="user-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            <TextField
              label="Comment"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              style={{ marginTop: "20px" }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
              onClick={handleSubmitReview}
              disabled={loading || rating === 0 || !comment}
            >
              {loading ? <CircularProgress size={24} /> : "Submit Review"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
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
    </>
  );
};

export default DetailedView;
