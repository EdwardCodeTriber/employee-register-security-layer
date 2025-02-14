import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EmployeeList from "./Components/EmployeeList";
import Login from "./Components/Login";
import DeletedEmployees from "./Components/DeletedEmployees";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import AdminAdd from "./Components/AdminAdd";
import AdminManage from "./Components/AdminMnange";


const App = () => {
  // State for authenticated admin and SuperAdmin status
  const [admin, setAdmin] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Function to handle login with Firebase custom token
  const handleLogin = async (token) => {
    try {
      // Use Firebase auth to sign in with custom token
      await auth.signInWithCustomToken(token);
      const user = auth.currentUser;

      if (user) {
        // Fetch user data from Firestore to check if they are a SuperAdmin
        const userDoc = await getDoc(doc(db, "admins", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        // Update state if user exists
        setAdmin({ username: user.email });
        setIsSuperAdmin(userData?.SuperAdmin === "Yes");
      }
    } catch (error) {
      console.error("Error during Firebase Auth:", error);
    }
  };

  // Listen for authentication state changes and update the admin state accordingly
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Set admin state
        setAdmin({ username: user.email });

        // Fetch the user's SuperAdmin status
        const userDoc = await getDoc(doc(db, "admins", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        // Update SuperAdmin status if user data exists
        setIsSuperAdmin(userData?.SuperAdmin === "Yes");
      } else {
        // User is logged out, clear admin state and SuperAdmin status
        setAdmin(null);
        setIsSuperAdmin(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const ProtectedAdminRoute = ({ children, isSuperAdmin }) => {
    if (!isSuperAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* If admin is logged in, show EmployeeList, else redirect to Login */}
        <Route
          path="/"
          element={
            admin ? (
              <EmployeeList admin={admin} setAdmin={setAdmin} />
            ) : (
              <Login setAdmin={handleLogin} />
            )
          }
        />
        <Route path="/login" element={<Login setAdmin={handleLogin} />} />

        {/* Only allow SuperAdmins to access AdminAdd and AdminManage */}
        {/* {isSuperAdmin && (
          <>
            <Route path="/AdminAdd" element={<AdminAdd />} />
            <Route path="/AdminManage" element={<AdminManage />} />
          </>
        )} */}
        {isSuperAdmin && (
          <>
            <Route
              path="/AdminAdd"
              element={
                <ProtectedAdminRoute isSuperAdmin={isSuperAdmin}>
                  <AdminAdd />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/AdminManage"
              element={
                <ProtectedAdminRoute isSuperAdmin={isSuperAdmin}>
                  <AdminManage />
                </ProtectedAdminRoute>
              }
            />
          </>
        )}
        <Route path="/deleted" element={<DeletedEmployees />} />
      </Routes>
    </Router>
  );
};

export default App;
