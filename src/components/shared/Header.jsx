import React from "react";

const Header = () => {
  return (
    <div style={{
      display:"flex",
      justifyContent:"space-between",
      padding:"15px 40px",
      alignItems:"center"
    }}>
      <h2 style={{color:"#5a3cff"}}>✈ TripBuddy</h2>

      <div>
        <button style={{
          padding:"8px 15px",
          marginRight:"10px",
          borderRadius:"20px",
          border:"1px solid #ddd"
        }}>
          + Create Trip
        </button>

        <button style={{
          padding:"8px 15px",
          borderRadius:"20px",
          background:"#5a3cff",
          color:"white",
          border:"none"
        }}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Header;