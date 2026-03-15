import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import Map from "../Map";   // ✅ add this

const Home = () => {

  const navigate = useNavigate();

  return (
    <>
      <div className="hero">

        <div className="badge">
          ● AI-Powered Travel Planner
        </div>

        <h1>
          Design Your Dream <br />
          Getaway in Seconds
        </h1>

        <p>
          Tell us where you want to go, and let our advanced AI craft the
          perfect itinerary tailored to your budget and interests.
        </p>

        <button 
          className="plan-btn"
          onClick={() => navigate("/create-trip")}
        >
          Start Planning →
        </button>

        <div className="features">
          <div>
            ✈️
            <span>Smart Routes</span>
          </div>

          <div>
            💰
            <span>Budget Control</span>
          </div>

          <div>
            ❤
            <span>Personalized</span>
          </div>
        </div>

      </div>

      {/* ✅ Map Section */}
      <div style={{ padding: "40px" }}>
        <h2>Explore Destinations</h2>
        <Map />
      </div>
    </>
  );
};

export default Home;