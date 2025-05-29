import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { getToken } from "@/features/selectors/auth.selector";
import EmployeeRoutes from "./employeeRoutes";

const Login = lazy(() => import("../pages/auth/login"));

const AppRoutes = () => {
  const token = useSelector(getToken);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {token ? (
            <Route path="/*" element={<EmployeeRoutes />} />
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
