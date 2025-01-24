import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Close icon
import ChatBot from "react-simple-chatbot";
import axios from "axios"; // Import Axios
import small from '../../../images/small.png';
import {createQuote} from "../services/ApiService";

const TravelChatbot = ({ onClose }) => {
  const [userData, setUserData] = useState({
    email: "",
    phone: "",
    destination: "",
    startDate: "",
    duration: "",
  });

  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [stepTriggered, setStepTriggered] = useState(false); // Prevent multiple step triggers

  const steps = [
    {
      id: "1",
      message: "Hi! Welcome to our travel booking service. How can I assist you today?",
      trigger: "2",
    },
    {
      id: "2",
      message: "Could you please provide your email address?",
      trigger: "email",
    },
    {
      id: "email",
      user: true,
      validator: (value) => {
        if (!/\S+@\S+\.\S+/.test(value)) {
          return "Please enter a valid email address.";
        }
        setUserData((prevData) => ({ ...prevData, email: value }));
        return true;
      },
      trigger: "phone",
    },
    {
      id: "phone",
      message: "What is your phone number?",
      trigger: "phone-input",
    },
    {
      id: "phone-input",
      user: true,
      validator: (value) => {
        if (!/^\d{10}$/.test(value)) {
          return "Please enter a valid phone number.";
        }
        setUserData((prevData) => ({ ...prevData, phone: value }));
        return true;
      },
      trigger: "destination",
    },
    {
      id: "destination",
      message: "Where would you like to travel?",
      trigger: "destination-input",
    },
    {
      id: "destination-input",
      user: true,
      validator: (value) => {
        setUserData((prevData) => ({ ...prevData, destination: value }));
        return true;
      },
      trigger: "startDate",
    },
    {
      id: "startDate",
      message: "When would you like to start your trip?",
      trigger: "startDate-input",
    },
    {
        id: "startDate-input",
        user: true,
        validator: (value) => {
          // Ensure that value is a valid number representing the day of the month
          const day = parseInt(value, 10);
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-based index
  
          if (isNaN(day) || day < 1 || day > 31) {
            return "Please provide a valid day between 1 and 31.";
          }
  
          // Create the full date string (e.g., "2025-01-20")
          const formattedDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
          // Convert it to the ISO format
          const isoDate = new Date(formattedDate).toISOString();
  
          setUserData((prevData) => ({ ...prevData, startDate: isoDate }));
          return true;
        },
        trigger: "duration", // Proceed to duration step
      },
    {
      id: "duration",
      message: "How many days would you like your trip to be?",
      trigger: "duration-input",
    },
    {
      id: "duration-input",
      user: true,
      validator: (value) => {
        setUserData((prevData) => ({ ...prevData, duration: value }));
        setIsFormCompleted(true); // Mark the form as completed
        return "Thank you for providing the details! We will contact you soon.";
      },
    },
  ];

  // Handle the POST request
  const handlePostRequest = async () => {
    if (isFormCompleted && !stepTriggered) {  // Check if the form is completed and step is not triggered yet
      const { email, phone, destination, startDate, duration } = userData;

      // Prepare data for POST request
      const requestData = {
        email,
        phone,
        destination,
        startDate,
        duration,
      };

      try {
        const response = await createQuote(requestData);
        console.log("Response Data:", response.data);
        setStepTriggered(true); // Prevent re-triggering of the step
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
  };

  // Call the POST request when form is completed
  useEffect(() => {
    if (isFormCompleted) {
      handlePostRequest();
    }
  }, [isFormCompleted]);

  // Custom header component
  const headerComponent = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#6e48aa",
        color: "white",
        padding: "10px",
        borderRadius: "8px 8px 0 0",
      }}
    >
      <h4>Travel Booking Assistant</h4>
      <FontAwesomeIcon
        icon={faTimes}
        onClick={onClose}
        style={{
          cursor: "pointer",
          fontSize: "20px",
          color: "white",
        }}
      />
    </div>
  );

  return (
    <div>
      <ChatBot
        steps={steps}
        headerTitle="" // Remove the default header title
        headerComponent={headerComponent} // Use the custom header component
        botAvatar={small} // Optional bot avatar
      />
    </div>
  );
};

export default TravelChatbot;
