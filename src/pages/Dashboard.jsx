import React from "react";
import Header from "../components/header";
import City from '../assets/3dcity.png';
import { Box, Flex, Image, Text, VStack, Circle } from "@chakra-ui/react";

function Dashboard() {
  const labels = [
    "WATER CONSUMPTION",
    "GAS CONSUMPTION",
    "POWER CONSUMPTION",
    "WATER COST",
    "GAS COST",
    "POWER COST",
    "UTILITY MACHINE",
    "ENVIRONMENT SYSTEM",
    "HVAC MACHINE",
    "MASTERBOX OUTPUT"
  ];
  
  return (
    <div>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-b from-[#040724] via-[#0f1a8a] to-[#040726] px-8 py-12">
        {/* Section Title */}
        <div className="text-white text-4xl font-sans font-bold mb-8 text-center">
          KALBE CONSUMER HEALTH OVERVIEW
        </div>

        {/* Main Wrapper */}
        <div className="flex justify-between items-start w-full max-w-[1280px] mx-auto">
          {/* Left Section: Boxes and Labels */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
          {labels.map((label, index) => (
              <div key={index}>
                {/* Label */}
                <div className="text-white text-sm font-medium mb-2">
                  {label}
                </div>
                {/* Box Wrapper */}
                <div className="relative w-[245px] h-[105px] bg-white rounded-md shadow-md p-4 flex items-center">
                  {/* Box Content */}
                  <p className="text-gray-700">Box Content {index + 1}</p>
                  {/* Circle Icon */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm text-gray-600">Icon</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Section: City Image */}
          <div className="flex justify-center items-center">
            <img
              src={City}
              alt="City"
              className="w-[400px] h-auto rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
