import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import image from "../../src/Navbar/KRT Gold Finance Logo PNG File.png";

const Branch = () => {
  const [admins, setAdmins] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [adminData, setAdminData] = useState({
    name: "",
    designation: "",
    branch: "",
    phoneNumber: "",
    adminId: "",
    password:"",
  });

  const fetchAdmins = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/admins/all`
      );
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setAdminData({ ...admin });
    setOpenModal(true);
  };

 

  const handleModalClose = () => {
    setOpenModal(false);
    setAdminData({
      name: "",
      designation: "",
      branch: "",
      phoneNumber: "",
      adminId: "",
      password:"",
    });
    setSelectedAdmin(null);
  };

  const handleDelete = async (adminId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {
      try {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admins/${adminId}`, {
          method: 'DELETE',
        });
        fetchAdmins(); // Refresh admin list
        Swal.fire('Deleted!', 'The admin has been deleted.', 'success');
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };
  
  const handleSave = async () => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admins/${adminData.adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });
      fetchAdmins(); 
      handleModalClose();
      Swal.fire('Updated!', 'The admin details have been updated.', 'success');
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };
  

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, backgroundColor: "#FFF2D0", borderRadius: 2, mt: 3 }}>
        <Grid container spacing={2} sx={{ textAlign: "center" }}>
          <Grid item xs={12}>
            <img
              src={image}
              alt="KRT Gold Finance Logo"
              style={{ maxWidth: "170px", height: "auto", marginTop: "-10px" }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", my: 1, mt: -2, color: "#D72122" }}
            >
              KRT GOLD FINANCE
            </Typography>
            <Typography variant="subtitle1">
              Cell No: 9042425142, 9042425642
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              135/5 Velavan Complex, Near (MGN) Lodge, Salem Main Road,
              Komarapalayam-638183
            </Typography>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    backgroundColor: "#1784CC",
                   color:'white',
                    fontWeight: "bold",
                }}
                >
                  Name
                </TableCell>
                <TableCell
                   sx={{
                    border: "1px solid #ddd",
                    backgroundColor: "#1784CC",
                   color:'white',
                    fontWeight: "bold",
                }}
                >
                  Designation
                </TableCell>
                <TableCell
                   sx={{
                    border: "1px solid #ddd",
                    backgroundColor: "#1784CC",
                   color:'white',
                    fontWeight: "bold",
                }}
                >
                  Branch
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                    backgroundColor: "#1784CC",
                   color:'white',
                    fontWeight: "bold",
                }}
                >
                  Admin ID
                </TableCell>
                <TableCell
                   sx={{
                    border: "1px solid #ddd",
                    backgroundColor: "#1784CC",
                   color:'white',
                    fontWeight: "bold",
                }}
                >
                  Password
                </TableCell>
                <TableCell
                    sx={{
                      border: "1px solid #ddd",
                      backgroundColor: "#1784CC",
                     color:'white',
                      fontWeight: "bold",
                  }}
                >
                  Phone Number
                </TableCell>
                <TableCell align="center"
                   sx={{
                    border: "1px solid #ddd",
                    backgroundColor: "#1784CC",
                   color:'white',
                    fontWeight: "bold",
                    
                }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.adminId}>
                  <TableCell sx={{  border: "1px solid #ddd"}}>{admin.name}</TableCell>
                  <TableCell sx={{  border: "1px solid #ddd"}}>{admin.designation}</TableCell>
                  <TableCell sx={{  border: "1px solid #ddd"}}>{admin.branch}</TableCell>
                  <TableCell sx={{  border: "1px solid #ddd"}}>{admin.adminId}</TableCell>
                  <TableCell sx={{  border: "1px solid #ddd"}}>{admin.password}</TableCell>
                  <TableCell sx={{  border: "1px solid #ddd"}}>{admin.phoneNumber}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEdit(admin)}
                      sx={{mr:2}}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(admin.adminId)}
                      sx={{mr:2}}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for editing admin */}
        <Modal open={openModal} onClose={handleModalClose}>
          <Paper sx={{ padding: 2, width: "400px", margin: "200px auto" }}>
            <Typography variant="h6" align="center">
              Edit Admin
            </Typography>
            <TextField
              label="Name"
              fullWidth
              value={adminData.name}
              onChange={(e) =>
                setAdminData({ ...adminData, name: e.target.value })
              }
              margin="normal"
            />
            <TextField
              label="Designation"
              fullWidth
              value={adminData.designation}
              onChange={(e) =>
                setAdminData({ ...adminData, designation: e.target.value })
              }
              margin="normal"
            />
            <TextField
              label="Branch"
              fullWidth
              value={adminData.branch}
              onChange={(e) =>
                setAdminData({ ...adminData, branch: e.target.value })
              }
              margin="normal"
            />
             <TextField
              label="Admin Id"
              fullWidth
              value={adminData.adminId}
              onChange={(e) =>
                setAdminData({ ...adminData, adminId: e.target.value })
              }
              margin="normal"
            />
             <TextField
              label="Password"
              fullWidth
              value={adminData.password}
              onChange={(e) =>
                setAdminData({ ...adminData, password: e.target.value })
              }
              margin="normal"
            />
            <TextField
              label="Phone Number"
              fullWidth
              value={adminData.phoneNumber}
              onChange={(e) =>
                setAdminData({ ...adminData, phoneNumber: e.target.value })
              }
              margin="normal"
            />
            <Grid align="center">
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                sx={{ mt: 2, mr: 2 }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleSave}
                sx={{ mt: 2, mr: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Paper>
        </Modal>
      </Paper>
    </Container>
  );
};

export default Branch;
