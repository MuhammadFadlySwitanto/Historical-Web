import React, { useEffect, Component, useState } from "react";
import CanvasJSReact from "../canvasjs.react";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  ButtonGroup,
  Stack,
  Input,
  Select,
  Spinner
} from "@chakra-ui/react";
import Axios from "axios";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import Header from "../components/header";
import { color } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Moisture = () => {
    const [moistureGraph, setMoistureGraph] = useState([]);
    const [inputText, setInputText] = useState("");
    const [submitText, setSubmitText] = useState("");
    const [switchAllData, setSwitchAllData] = useState(false);
    const [dataToFilter, setDataToFilter] = useState([]);
    const [moistureData, setMoistureData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { colorMode } = useColorMode();
    const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
    const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
    const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");

    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.getAttribute("data-theme") === "dark"
    );


  return (
    <div>Moisture</div>
  );
}

export default Moisture;