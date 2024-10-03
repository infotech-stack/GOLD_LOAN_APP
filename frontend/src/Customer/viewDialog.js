import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const ViewDialog = ({ open, onClose, entry }) => {
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

  useEffect(() => {
    console.log(imageUrls); 
  }, [imageUrls]);

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

    // Upload files to the server
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
        // Update the corresponding image URL in state after successful upload
        setImageUrls((prevImageUrls) => ({
          ...prevImageUrls,
          [type]: response.data[type], // Ensure the backend returns the updated image URL
        }));
        setSnackbarMessage("Files uploaded successfully");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error uploading the file:", error);
        setError("Error uploading the file");
      });
  };

  const handleRemoveFile = (type, index) => {
    const updatedImageUrls = { ...imageUrls };
    if (Array.isArray(updatedImageUrls[type])) {
      updatedImageUrls[type].splice(index, 1); // Remove the image from the array
    } else {
      updatedImageUrls[type] = null; // If it's a single file, just nullify it
    }

    // Update state
    setImageUrls(updatedImageUrls);

    // You should also send a request to your backend to delete the file on the server
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/ledger/remove/${loanNumber}`,
        {
          type,
          index,
        }
      )
      .then((response) => {
        setImageUrls(response.data); // Update state with the response from the server
        setSnackbarMessage("File removed successfully");
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error("Error removing the file:", error);
        setError("");
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            border: "6px solid #F6c240", // Border for the Dialog
            borderRadius: "8px", // Rounded corners
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              color: "#D72122",
              fontWeight: 600,
            }}
          >
            CUSTOMER PROOF
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={{
              backgroundColor: "#d34141",
              color: "white",

              "&:hover": {
                backgroundColor: "#b33030",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {imageUrls && (
            <Box>
              {[
                { type: "proof1", label: "Proof 1 (Front)" },
                { type: "proof2", label: "Proof 2 (Back)" },
                { type: "proof3", label: "Jewel Upload" }, // Allows multiple files
                { type: "customerSign", label: "Customer Sign" },
                { type: "customerPhoto", label: "Customer Photo" },
                { type: "thumbImpression", label: "Thumb Impression" },
              ].map(({ type, label }, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 1,
                      textAlign: "center",
                      color: "#34762B",
                      fontWeight: 600,
                    }} // Custom color for labels
                  >
                    {label}
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 1 }}
                  >
                    <input
                      type="file"
                      multiple={type === "proof3"} // Allow multiple files for Jewel Upload
                      onChange={(e) => handleFileChange(e, type)}
                      style={{ marginBottom: "1rem", width: "auto" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      justifyContent: "center",
                    }}
                  >
                    {imageUrls[type] &&
                      (Array.isArray(imageUrls[type]) ? (
                        imageUrls[type].map((url, idx) => (
                          <Box key={idx} sx={{ position: "relative", mb: 1 }}>
                            <img
                                src={`${process.env.REACT_APP_BACKEND_URL}${url}`}
                              alt={`${type} - ${idx}`}
                              style={{
                                width: "300px",
                                height: "300px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Box
                              sx={{
                                height: "2px",
                                backgroundColor: "#e0e0e0", // Gray color for the line
                                marginTop: "8px",
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
                      ) : (
                        <Box sx={{ position: "relative", mb: 1 }}>
                          <img
                              src={`${process.env.REACT_APP_BACKEND_URL}${imageUrls[type]}`}
                            alt={type}
                            style={{
                              width: "300px",
                              height: "300px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Box
                            sx={{
                              height: "2px",
                              backgroundColor: "#e0e0e0",
                              width: "100%",

                              marginTop: "8px",
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
        </DialogContent>

        <DialogActions>
          {/* <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button> */}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ViewDialog;
