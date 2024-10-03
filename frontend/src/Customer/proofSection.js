import { Box, Grid } from '@mui/material';
import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const ProofSection = ({ proof1, proof2, proof3, isProofVisible, entry }) => {
  const [loanNumber, setLoanNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (entry && entry.loanNumber) {
      setLoanNumber(entry.loanNumber);
      setLoading(true);

      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/loan/${entry.loanNumber}`)
        .then((response) => response.json())
        .then((data) => {
          setImageUrls(data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching the images");
          setLoading(false);
        });
    }
  }, [entry]);

  const handleFileChange = (event, type) => {
    const files = event.target.files;
    const formData = new FormData();

    if (type === "proof3") {
      Array.from(files).forEach((file) => {
        formData.append(type, file);
      });
    } else {
      formData.append(type, files[0]);
    }

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/update/${loanNumber}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setImageUrls((prevImageUrls) => ({
          ...prevImageUrls,
          [type]: response.data[type],
        }));
        setSnackbarMessage("Files uploaded successfully");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setError("Error uploading the file");
      });
  };

  const handleRemoveFile = (type, index) => {
    const updatedImageUrls = { ...imageUrls };
    if (Array.isArray(updatedImageUrls[type])) {
      updatedImageUrls[type].splice(index, 1);
    } else {
      updatedImageUrls[type] = null;
    }

    setImageUrls(updatedImageUrls);

    axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/api/ledger/remove/${loanNumber}`, {
        type,
        index,
      })
      .then((response) => {
        setImageUrls(response.data);
        setSnackbarMessage("File removed successfully");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setError("");
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleViewClick = (type) => {
    if (imageUrls[type]) {
      const urls = Array.isArray(imageUrls[type]) ? imageUrls[type] : [imageUrls[type]];
      urls.forEach((url) => {
        const fullUrl = `${process.env.REACT_APP_BACKEND_URL}${url}`;
        window.open(fullUrl, "_blank");
      });
    }
  };

  return (
    <Box>
      {isProofVisible && (
        <>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {imageUrls && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                justifyContent: "center",
              }}
            >
              {[
                { type: "proof1", label: "Proof 1 (Front)" },
                { type: "proof2", label: "Proof 2 (Back)" },
                { type: "proof3", label: "Jewel Upload" },
                { type: "customerSign", label: "Customer Sign" },
                { type: "customerPhoto", label: "Customer Photo" },
                { type: "thumbImpression", label: "Thumb Impression" },
              ].map(({ type, label }, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      textAlign: "center",
                      color: "#34762B",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </Typography>
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="file"
                      multiple={type === "proof3"}
                      onChange={(e) => handleFileChange(e, type)}
                      style={{ marginBottom: "1rem", width: "auto" }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#B96500",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "4px",
                        padding: "6px 12px",
                        marginRight: "10px",
                        "&:hover": {
                          backgroundColor: "#753D00",
                        },
                      }}
                      onClick={() => handleViewClick(type)}
                    >
                      View
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    {imageUrls[type] &&
                      (Array.isArray(imageUrls[type])
                        ? imageUrls[type].map((url, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                position: "relative",
                                width: 280,
                                height: 140,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                overflow: "hidden",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.8)",
                              }}
                            >
                              <img
                                src={`${process.env.REACT_APP_BACKEND_URL}${url}`}
                                alt={`${type} - ${idx}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <IconButton
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  color: "red",
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                }}
                                onClick={() => handleRemoveFile(type, idx)}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Box>
                          ))
                        : (
                          <Box
                            sx={{
                              position: "relative",
                              width: 280,
                              height: 140,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "hidden",
                              borderRadius: "8px",
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <img
                              src={`${process.env.REACT_APP_BACKEND_URL}${imageUrls[type]}`}
                              alt={type}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <IconButton
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                color: "red",
                                backgroundColor: "rgba(255, 255, 255, 0.8)",
                              }}
                              onClick={() => handleRemoveFile(type)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}

<Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}  // Positioning at top-left
>
  <Alert onClose={handleCloseSnackbar} severity="success">
    {snackbarMessage}
  </Alert>
</Snackbar>

        </>
      )}
    </Box>
  );
};

export default ProofSection;
