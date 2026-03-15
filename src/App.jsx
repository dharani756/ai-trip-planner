import React from "react";
import Header from "./components/shared/Header";
import Home from "./pages/Home";
import CreateTrip from "./pages/CreateTrip";
import { Routes, Route } from "react-router-dom";
import Map from "./Map";

const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-trip" element={<CreateTrip />} />
      </Routes>
    </>
  );
};

export default App;