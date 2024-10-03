import React, { useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
  Paper,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const AddedAdm = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    branch: "",
    phoneNumber: "",
    adminId: "",
    password: "",
    permissions: [],
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    designation: "",
    branch: "",
    phoneNumber: "",
    adminId: "",
    password: "",
    permissions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    let hasErrors = false;

    if (!formData.name) {
      errors.name = "Name is required";
      hasErrors = true;
    }

    if (!formData.designation) {
      errors.designation = "Designation is required";
      hasErrors = true;
    }

    if (!formData.branch) {
      errors.branch = "Branch is required";
      hasErrors = true;
    }

    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
      hasErrors = true;
    }

    if (!formData.adminId) {
      errors.adminId = "Admin ID is required";
      hasErrors = true;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      hasErrors = true;
    }

    if (formData.permissions.length === 0) {
      errors.permissions = "Select at least one permission";
      hasErrors = true;
    }

    setFormErrors(errors);

    if (!hasErrors) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admins/register`,
          formData
        );
        console.log("Admin data saved:", response.data);

        Swal.fire({
          title: "Success!",
          text: "Sub admin stored successfully",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error saving admin data:", error.message);
      }
    }
  };

  const permissionOptions = [
    "Dashboard",
    "Ledger Entry",
    "Customer Management",
    "Branch Management",
    //"Appraisal Schema",
    "Voucher",
    "Repledge",
    "Expenses",
    "Day Book",
    "MD Voucher",
    "Bill Book",
  ];

  return (
    <div style={{ padding: "20px", marginTop: "80px" }}>
      <Paper
        style={{ padding: "20px", width: "700px", margin: "auto" }}
        className="paperbg"
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "#D72122", fontWeight: "550", textAlign: "center" }}
        >
          ADD ADMINISTRATOR
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={!!formErrors.designation}
                helperText={formErrors.designation}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                error={!!formErrors.branch}
                helperText={formErrors.branch}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admin ID"
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
                error={!!formErrors.adminId}
                helperText={formErrors.adminId}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.permissions}>
                <InputLabel id="permissions-label">Permissions</InputLabel>
                <Select
                  labelId="permissions-label"
                  id="permissions"
                  multiple
                  value={formData.permissions}
                  onChange={handleChange}
                  name="permissions"
                  renderValue={(selected) => selected.join(", ")}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "black",
                      },
                      "&:hover fieldset": {
                        borderColor: "black",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "black",
                      },
                    },
                  }}
                >
                  {permissionOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      <Checkbox
                        checked={formData.permissions.indexOf(option) > -1}
                      />
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formErrors.permissions}</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="sub-green"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default AddedAdm;
