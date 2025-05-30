import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "@/features/auth/useAuth";
import EmployeeRoutes from "./employeeRoutes";
import SuperAdminRoutes from "./superAdminRoutes";

const Login = lazy(() => import("../pages/auth/login"));

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const isSuperAdmin = user?.role == "SUPERADMIN";

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {isAuthenticated ? (
            isSuperAdmin ? (
              <Route path="/*" element={<SuperAdminRoutes />} />
            ) : (
              <Route path="/*" element={<EmployeeRoutes />} />
            )
          ) : (
            <>
              <Route path="/login" Component={Login} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
