import React, { useEffect, Component, useState, useRef } from "react";
import CanvasJSReact from "../canvasjs.react";
import { Button, ButtonGroup, Stack, Input, Select, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function BuildingRnD() {
  const [startDate, setStartDate] = useState();
  const [finishDate, setFinishDate] = useState();
  const [Area, setArea] = useState();
  const [SuhuData, setSuhuData] = useState([]);
  const [RHData, setRHData] = useState([]);
  const [AllDataWH1, setAllDataWH1] = useState([]);
  const ComponentPDF= useRef();
  const [state, setState] = useState(true);
  const [maxSuhu, setmaxSuhu]= useState ([]);
  const [minSuhu, setminSuhu]= useState ([]);
  const [avgSuhu, setavgSuhu]= useState ([]);
  const [maxRH, setmaxRH]= useState ([]);
  const [minRH, setminRH]= useState ([]);
  const [avgRH, setavgRH]= useState ([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isTableVisible, setIsTableVisible] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
  const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
  const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );
         
  const fetchWH1Data = async () => {
    setLoading(true); // Start spinner
    setError(null);   // Clear previous errors

    try {
      let response = await axios.get(
        "http://10.126.15.141:8002/part/BuildingWH1Suhu", 
        {
          params: {
            area: Area,
            start: startDate,
            finish: finishDate,
          },
        }
      );            
        setSuhuData(response.data);

      let response1 = await axios.get(
        "http://10.126.15.141:8002/part/BuildingWH1RH",
        {
          params: {
            area: Area,
            start: startDate,
            finish: finishDate,
          },
        }
      );            
        setRHData(response1.data);

      let response2 = await axios.get(
        "http://10.126.15.141:8002/part/BuildingWH1All",
        {
          params: {
            area: Area,
            start: startDate,
            finish: finishDate,
          },
        }
      );     
        setAllDataWH1(response2.data); 
        setIsTableVisible(true); // Show the table

      if (response.data.length !== 0 && response1.data.length !== 0){
        setState(false);
      } else {
        setState(true);
      }

    const maxSuhu = response.data.reduce ((acc, data) => Math.max (acc, data.y), Number.NEGATIVE_INFINITY);
    var max = Number(maxSuhu.toFixed(2))
    setmaxSuhu(max)

    const minSuhu = Math.min(...response.data.map((data) => data.y));
    var min = Number(minSuhu.toFixed(2))
    setminSuhu(min)

    const totalSuhu = response.data.reduce ((sum, data) => sum + data.y, 0);
    var total = 0
    total = Number(totalSuhu.toFixed(2))
    const averageSuhu = totalSuhu / response.data.length;
    var avgSuhu = Number(averageSuhu.toFixed(2))
    setavgSuhu(avgSuhu);

    const maxRH = response1.data.reduce ((acc, data) => Math.max (acc, data.y), Number.NEGATIVE_INFINITY);
    var max = Number(maxRH.toFixed(2))
    setmaxRH(max)

    const minRH = Math.min(...response1.data.map((data) => data.y));
    var min = Number(minRH.toFixed(2))
    setminRH(min)

    const totalRH = response1.data.reduce ((sum, data) => sum + data.y, 0);
    var total = 0
    total = Number(totalRH.toFixed(2))
    const averageRH = totalRH / response1.data.length;
    var avgRH = Number(averageRH.toFixed(2))
    setavgRH(avgRH);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      const delay = 2000; // 2 seconds in milliseconds
        setTimeout(() => {
          setLoading(false); // Stop spinner
          console.log("Finished fetching data, stopping spinner...");
        }, delay);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(AllDataWH1.length / rowsPerPage)));
  };

  const table = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleData = AllDataWH1.slice(startIndex, startIndex + rowsPerPage);

    if (AllDataWH1.length === 0) {
      return (
        <Tr>
          <Td colSpan={3} className="text-center text-text">
            No data available
          </Td>
        </Tr>
      );
    }

    return visibleData.map((data, index) => (
      <Tr key={startIndex + index}>
        <Td>{startIndex + index + 1}</Td> {/* No column */}
        <Td>{data.tgl}</Td>
        <Td>{data.temp}</Td>
        <Td>{data.RH}</Td>
      </Tr>
    ));
  };
  let dateStart = (e) => {
    var dataInput = e.target.value;
    setStartDate(dataInput);
  };    
  let dateFinish = (e) => {
    var dataInput = e.target.value;
    setFinishDate(dataInput);
  };
  let getArea = (e) => {
    var dataInput = e.target.value;
    setArea(dataInput);
  };

  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(currentTheme === 'dark');
    };
    // Observe attribute changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);
        

  var localeOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "UTC",
    hour12: false
  };
  const options = {
    zoomEnabled: true,
    theme: isDarkMode ? "dark2" : "light2",
    backgroundColor: isDarkMode ? "#171717" : "#ffffff",
    margin: 8,
    title: {
      text: "WAREHOUSE 1 DATA GRAPH",
      fontColor: isDarkMode ? "white" : "black"
    },
    axisY: {
      prefix: "",
    },
    axisX: {
      valueFormatString: "YYYY-MMM-DD HH:mm K",
      labelFormatter: function(e) {
        let date = new Date(e.value);
        let content = date.toLocaleDateString("en-US", localeOptions);
        return content;
      }
    },
    toolTip: {
      shared: true,
    }, 
    data: [
        {
        type: "spline",
        name: "Temperature (°C)",
        showInLegend: true,
        xValueFormatString: "",
        yValueFormatString: "",
        dataPoints: SuhuData,
        // markerType: "none",
      },
      {
        type: "spline",
        name: "RH (%)",
        showInLegend: true,
        xValueFormatString: "",
        yValueFormatString: "",
        dataPoints: RHData,
        // markerType: "none",
      }
    ],
  };

  const generatePDF =  useReactToPrint({
    content: ()=> ComponentPDF.current,
    documentTitle: "Building WH1 "+Area+" Data"
  });

  return(
    <div>
      <Stack
        className="flex flex-row justify-center mb-4  "
        direction="row"
        spacing={4}
        align="center"
        >
        <div>
          <h2 className="mb-1">Area</h2>
            <Select placeholder="Select Area"  onChange={getArea}>
              <option value="RakLayer3-C56WH1">C56 WH1</option>
              <option value="RakLayer3-C64WH1">C64 WH1</option>
              <option value="RakLayer3-C72WH1">C72 WH1</option>
              <option value="PrekursorWH1">Prekursor WH1</option>
            </Select>
        </div>
        <div>
          <h2 className="mb-1">Start Time</h2>
          <Input
            onChange={dateStart}
            placeholder="Select Date and Time"
            size="md"
            type="date"
            css={{
              "&::-webkit-calendar-picker-indicator": {
                color: isDarkMode ? "white" : "black",
                filter: isDarkMode ? "invert(1)" : "none",
              },
            }}
            sx={{
              border: "1px solid",
              borderColor: borderColor,
              borderRadius: "0.395rem",
              background: "var(--color-background)", // background color from Tailwind config
    
              _hover: {
                borderColor: hoverBorderColor,
              },
            }}
          /> 
        </div>
        <div>
          <h2 className="mb-1">Finish Time</h2>
          <Input
            onChange={dateFinish}
            placeholder="Select Date and Time"
            size="md"
            type="date"
            css={{
              "&::-webkit-calendar-picker-indicator": {
                color: isDarkMode ? "white" : "black",
                filter: isDarkMode ? "invert(1)" : "none",
              },
            }}
            sx={{
              border: "1px solid",
              borderColor: borderColor,
              borderRadius: "0.395rem",
              background: "var(--color-background)", // background color from Tailwind config
    
              _hover: {
                borderColor: hoverBorderColor,
              },
            }}
          />
        </div>
        <div>
          <br />
          <Button
            className="m1-4"
            colorScheme="blue"
            onClick={() => fetchWH1Data()}>
            Submit
          </Button>
        </div>
        <div>
          <br />
          <Button
            isDisabled={state}
            className="m1-4"
            colorScheme="green"
            onClick={generatePDF}>
            Export to PDF
          </Button>
        </div>
      </Stack>
      <div className="flex flex-row justify-center mx-12 p-1 ">
      {loading ? (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      ) : error ? (
        <div className="text-red-500">No available data</div>
      ) : (
        <CanvasJSChart className="" options={options} />
      )}
      </div>
      <br />
      <Stack
        className="flex flex-row justify-center mb-4  "
        direction="row"
        spacing={4}
        align="center"
        >
        <div className="mt-3">
          <div className="ml-16 text-text">Avg Suhu = {avgSuhu.toLocaleString()} °C</div>
          <div className="ml-16 text-text">Max Suhu = {maxSuhu.toLocaleString()} °C</div>
          <div className="ml-16 text-text">Min Suhu = {minSuhu.toLocaleString()} °C</div>
        </div>
        <div className="mt-3">
          <div className="ml-16 text-text">Avg RH = {avgRH.toLocaleString()} %</div>
          <div className="ml-16 text-text">Max RH = {maxRH.toLocaleString()} %</div>
          <div className="ml-16 text-text">Min RH = {minRH.toLocaleString()} %</div>
        </div>
      </Stack>
      <br />
      <Stack className="flex flex-row justify-center gap-2"
        direction="row"
        spacing={2}
        align="center">
        <div className="mt-2">
          <Select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            width="80px">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
            <option value={100}>100</option>
          </Select>
        </div>
        <div>
          <Button
            className="w-40 mt-2"
            colorScheme="red"
            onClick={() => setIsTableVisible(!isTableVisible)}>
            {isTableVisible ? "Hide All Data" : "Show All Data"}
          </Button>
        </div>
      </Stack>
      {isTableVisible && (
      <div className="mt-8 bg-card rounded-md mx-20" ref={ComponentPDF}>
        <TableContainer>
          <Table key={colorMode} variant="simple">
            <Thead>
              <Tr>
                <Th sx={{
                color: tulisanColor,
                }}>No</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Date Time</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Temperature (°C)</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Relative Humidity/RH (%)</Th>
              </Tr>
            </Thead>
            <Tbody>{table()}</Tbody>
          </Table>
        </TableContainer>
      </div>
      )}
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <Button
          onClick={handlePrevPage}
          isDisabled={currentPage === 1}
          colorScheme="blue"
        >
          Previous
        </Button>
        <span className="text-text">
          Page {currentPage} of {Math.ceil(AllDataWH1.length / rowsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          isDisabled={currentPage === Math.ceil(AllDataWH1.length / rowsPerPage)}
          colorScheme="blue"
        >
          Next
        </Button>
      </div>
    </div>
  );
}