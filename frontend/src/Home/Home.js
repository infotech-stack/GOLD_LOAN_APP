import React from "react";
import { Container, Grid, Button, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "../Navbar/KRT Gold Finance Logo PNG File.png";

const ContentBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: theme.spacing(3),
}));

const InnerBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  borderRadius: "20px",
  backgroundColor: "#F8E38E",
  padding: theme.spacing(3),
  boxShadow: "inset 0 0 0 16px #e6b30d",
}));

const Home = () => {
  const navigate = useNavigate();

  const goToSignup = () => {
    navigate("/signup");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home_bg">
      <Container
        maxWidth="lg"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          sx={{ height: "350px", mb: 3, justifyContent: "center" }}
          className="home-cont"
        >
          <Grid item xs={12} md={6} className="home-cont">
            <InnerBox>
              <img
                src={logo}
                alt="Logo"
                className="logo"
                style={{ height: "160px", width: "240px", marginTop: "90px" }}
              />
              <ContentBox sx={{ mb: 12 }}>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ mb: 5, textAlign: "center" }}
                  className="heads"
                >
                  GOLD LOAN APPLICATION
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={
                    <FontAwesomeIcon icon={faUserShield} className="icon" />
                  }
                  className="button1"
                  onClick={goToLogin}
                  sx={{ mb: 2 }}
                >
                  Admin Login
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<FontAwesomeIcon icon={faUser} className="icon" />}
                  className="button2"
                  onClick={goToSignup}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  User Login
                </Button>
              </ContentBox>
            </InnerBox>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
