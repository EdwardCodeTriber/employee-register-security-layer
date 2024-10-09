import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeList from './Components/EmployeeList';
import Login from './Components/Login';
import DeletedEmployees from './Components/DeletedEmployees';
import { auth } from './firebase'; // Import the auth
import AdminAdd from "./Components/AdminAdd";
import AdminManage from "./Components/AdminMnange";

const App = () => {
  // State for authenticated admin
  const [admin, setAdmin] = useState(null); 

  // Function to handle login with Firebase custom token
  const handleLogin = async (token) => {
    try {
      // Use Firebase auth to sign in with custom token
      await auth.signInWithCustomToken(token);
      const user = auth.currentUser;

      // Set the admin state with user details
      setAdmin({ username: user.email });
    } catch (error) {
      console.error('Error during Firebase Auth:', error);
    }
  };

  // Listen for authentication state changes and update the admin state accordingly
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, set admin with user details
        setAdmin({ username: user.email });
      } else {
        // User is logged out, clear admin state
        setAdmin(null);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to handle sign out
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Clear admin state after logging out
      setAdmin(null); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Router>
      
        <Routes>
          {/* If admin is logged in, show EmployeeList, else redirect to Login */}
          <Route
            path="/"
            element={admin ? (
              <EmployeeList admin={admin} setAdmin={setAdmin} />
            ) : (
              <Login setAdmin={handleLogin} />
            )}
          />
          <Route path="/login" element={<Login setAdmin={handleLogin} />} />
          <Route path="/AdminAdd" element={<AdminAdd/>}/>
          <Route path="/AdminManage" element={<AdminManage/>}/>
          <Route path="/deleted" element={<DeletedEmployees />} />
        </Routes>
    </Router>
  );
};

export default App;
