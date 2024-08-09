import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Footer from "../common/footer/Footer";
import Header from "../common/header/Header";

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          "https://oneapp.trivedagroup.com/api/c3/user/me/wishlist",
          config
        );
        setFavourites(response.data.data);
      } catch (error) {
        console.error("Error fetching favourites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [token]);

  const handleCardClick = (serviceId) => {
    history.push(`/details/${serviceId}`);
  };

  if (loading) {
    return (
      <>
        {" "}
        <Header />
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh"
          >
            <CircularProgress />
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container style={{marginTop:'20px',marginBottom:'20px'}}>
        <Typography variant="h4" gutterBottom align="center">
          Favourites
        </Typography>
        {favourites.length === 0 ? (
          <Typography variant="h6" align="center">
            No favourites found.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {favourites.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card
                  onClick={() => handleCardClick(item._id)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.name}
                    style={{
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                    <Typography variant="body2">
                      Service: {item.service}
                    </Typography>
                    <Typography variant="body2">
                      Amount: ${item.amount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default FavouritesPage;
