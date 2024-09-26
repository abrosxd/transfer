import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";

import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import Cookie from "./widgets/Cookie/Cookie";

import Home from "./pages/Home/Home";
import Transfer from "./pages/Transfer/Transfer";
import Parcel from "./pages/Parcel/Parcel";
import Currency from "./pages/Currency/Currency";
import NotFound from "./pages/NotFound/NotFound";

export default function App() {
  const location = useLocation();
  return (
    <>
      <Navigation />
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/parcel" element={<Parcel />} />
        <Route path="/currency" element={<Currency />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <Cookie />
    </>
  );
}
