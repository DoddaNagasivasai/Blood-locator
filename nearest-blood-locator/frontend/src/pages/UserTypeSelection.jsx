import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserTypeSelection.css"; // Optional: for styling

export default function UserTypeSelection() {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    // Redirect to different registration forms based on type
    switch (type) {
      case "donor":
        navigate("/register/donor");
        break;
      case "recipient":
        navigate("/register/recipient");
        break;
      case "bloodbank":
        navigate("/register/bloodbank");
        break;
      default:
        break;
    }
  };

  return (
    <div className="user-type-container">
      <h2>Choose Registration Type</h2>
      <div className="user-type-cards">
        <div className="card" onClick={() => handleSelect("donor")}>
          🩸 <h3>Register as Donor</h3>
          <p>Help save lives by donating blood.</p>
        </div>

        <div className="card" onClick={() => handleSelect("recipient")}>
          ❤️ <h3>Register as Recipient</h3>
          <p>Request blood when you need it.</p>
        </div>

        <div className="card" onClick={() => handleSelect("bloodbank")}>
          🏥 <h3>Register as Blood Bank</h3>
          <p>Manage blood availability in your bank.</p>
        </div>
      </div>
    </div>
  );
}
