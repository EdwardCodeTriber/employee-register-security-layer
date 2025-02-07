import { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import moment from "moment";

const DeletedEmployees = () => {
  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchDeletedEmployees = async () => {
      try {
        const response = await axios.get("https://employee-register-security-layer.onrender.com/api/deletedEmployees");
        const employees = response.data.map((employee) => ({
          ...employee,
          deletedAt: employee.deletedAt
            ? moment(employee.deletedAt).format("MM/DD/YYYY")
            : "N/A",
        }));
        setDeletedEmployees(employees);
      } catch (error) {
        console.error("Error fetching deleted employees:", error);
      }
    };

    fetchDeletedEmployees();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ backgroundColor: "#475569" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Left/Previous Employees
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Employee List
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <main style={{ flex: 1 }}>
        <br />
        <Container>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", justifyContent: "center" }}>
            Left/Previous Employees
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Surname</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>ID Number</TableCell>
                <TableCell>Deleted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deletedEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.surname}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.idNumber}</TableCell>
                  <TableCell>{employee.deletedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default DeletedEmployees;
