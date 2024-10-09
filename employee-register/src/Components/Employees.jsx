import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Fab,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AddIcon from "@mui/icons-material/Add";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [employee, setEmployee] = useState({
    name: "",
    surname: "",
    position: "",
    email: "",
    idNumber: "",
    picture: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [errors, setErrors] = useState({ email: "" });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      showAlert("Failed to fetch employees", "error");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let emailError = "";

    if (!validateEmail(employee.email)) {
      emailError = "Invalid email format";
    }

    setErrors({ email: emailError });

    return !emailError;
  };

  const handleAddEmployee = async () => {
    if (!validateForm()) {
      showAlert("Please correct the form errors", "error");
      return;
    }

    setLoading(true);

    try {
      const { name, surname, position, email, idNumber, picture } = employee;

      if (editIndex > -1) {
        await axios.put(
          `http://localhost:5000/api/employees/${employees[editIndex].id}`,
          {
            name,
            surname,
            position,
            email,
            idNumber,
            picture,
          }
        );
        showAlert("Employee updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/employees", {
          name,
          surname,
          position,
          email,
          idNumber,
          picture,
        });
        showAlert("Employee added successfully");
      }

      setOpenDialog(false);
      fetchEmployees();
    } catch (error) {
      showAlert("Failed to save employee", "error");
    } finally {
      setLoading(false);
      setEmployee({
        name: "",
        surname: "",
        position: "",
        email: "",
        idNumber: "",
        picture: "",
      });
      setEditIndex(-1);
    }
  };

  const handleEdit = async (index) => {
    setEditIndex(index);
    setEmployee(employees[index]);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      showAlert("Employee deleted successfully", "error");
      fetchEmployees();
    } catch (error) {
      showAlert("Failed to delete employee", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEmployee({ ...employee, picture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleOpenDialog = async () => {
    setEmployee({
      name: "",
      surname: "",
      position: "",
      email: "",
      idNumber: "",
      picture: "",
    });
    setEditIndex(-1);
    setOpenDialog(true);
  };

  const handleCloseDialog = async () => {
    setOpenDialog(false);
  };

  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((emp) =>
        emp.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Employee Registration System
      </Typography>

      <TextField
        label="Search by Employee ID"
        variant="outlined"
        fullWidth
        margin="dense"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle align="center">
          {editIndex > -1 ? "Edit Employee" : "Add Employee"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={employee.name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Surname"
            name="surname"
            value={employee.surname}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Position"
            name="position"
            value={employee.position}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            name="email"
            value={employee.email}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="ID Number"
            name="idNumber"
            value={employee.idNumber}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<AddPhotoAlternateIcon />}
            >
              Upload Picture
            </Button>
          </label>
          {employee.picture && (
            <img src={employee.picture} alt="Employee" width="100" />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddEmployee} color="primary">
            {loading ? (
              <CircularProgress size={24} />
            ) : editIndex > -1 ? (
              "Update Employee"
            ) : (
              "Add Employee"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>ID Number</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((emp, index) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.id}</TableCell>
                <TableCell>{emp.name}</TableCell>
                <TableCell>{emp.surname}</TableCell>
                <TableCell>{emp.position}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.idNumber}</TableCell>
                <TableCell>
                  {emp.picture && (
                    <img src={emp.picture} alt={emp.name} width="50" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(emp.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}


      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>

      <Fab
        color="primary"
        onClick={handleOpenDialog}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "green",
          color: "white",
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Employees;
