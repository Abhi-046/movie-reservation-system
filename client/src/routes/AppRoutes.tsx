import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/movies/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import SeatSelectionPage from "../pages/reservations/SeatSelectionPage";
import PaymentWrapper from "../pages/payments/PaymentWrapper";



const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/seats/:showtimeId" element={<SeatSelectionPage />} />

        
        <Route path="/payment/:reservationId" element={<PaymentWrapper />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
