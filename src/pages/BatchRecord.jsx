import { React, useState, useEffect } from "react";
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
  Box,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import Header from "../components/header";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

function BatchRecord() {
  const [fetchLineData, setFetchLineData] = useState([]);
  const [fetchProcesData, setFetchProcesData] = useState([]);
  const [fetchMachineData, setFetchMachineData] = useState([]);
  const [newLine, setNewLine] = useState("");
  const [newProces, setNewProces] = useState("");
  const [newMachine, setNewMachine] = useState("");
  const [noBatch, setNoBatch] = useState("");
  const [mainData, setMainData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
  const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
  const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  const fetchLine = async () => {
    let response = await axios.get("http://10.126.15.141:8002/part/lineData");
    setFetchLineData(response.data);
  };

  const fetchProces = async (line) => {
    let response = await axios.get(
      "http://10.126.15.141:8002/part/procesData",
      {
        params: {
          line_name: line,
        },
      }
    );

    setFetchProcesData(response.data);
  };

  const fetchMachine = async (line, proces) => {
    let response = await axios.get(
      "http://10.126.15.141:8002/part/machineData",
      {
        params: {
          line_name: line,
          proces_name: proces,
        },
      }
    );
    setFetchMachineData(response.data);
  };

  const getDataWithMachine = async () => {
    let response = await axios.get(
      "http://10.126.15.141:8002/part/PmaGetData",
      {
        params: {
          machine: newMachine,
          batch: noBatch,
        },
      }
    );

    console.log(response.data);
    setMainData(response.data);
  };

  const renderLine = () => {
    return fetchLineData.map((lineCategory) => {
      return (
        <option value={lineCategory.line_name}>{lineCategory.line_name}</option>
      );
    });
  };

  const renderProces = () => {
    return fetchProcesData.map((procesCategory) => {
      return (
        <option value={procesCategory.proces_name}>
          {procesCategory.proces_name}
        </option>
      );
    });
  };

  const renderMachine = () => {
    return fetchMachineData.map((machineCategory) => {
      return (
        <option value={machineCategory.machine_name}>
          {machineCategory.machine_name}
        </option>
      );
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(mainData.length / rowsPerPage)));
  };

  const renderData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleData = mainData.slice(startIndex, startIndex + rowsPerPage);

    if (mainData.length === 0) {
      return (
        <Tr>
          <Td colSpan={12} className="text-center text-text">
            No data available
          </Td>
        </Tr>
      );
    }

    return visibleData.map((ebr, index) => (
      <Tr key={index}>
        <Td>{ebr.data_index}</Td>
        <Td>{ebr.data_format_0_string}</Td>
        <Td>{ebr.data_format_1_string}</Td>
        <Td>{ebr.label}</Td>
        <Td>{ebr.data_format_2}</Td>
        <Td>{ebr.data_format_3}</Td>
        <Td>{ebr.data_format_4}</Td>
        <Td>{ebr.data_format_5}</Td>
        <Td>{ebr.data_format_6}</Td>
        <Td>{ebr.data_format_7}</Td>
      </Tr>
    ));
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

  //========================HENDELER========================================
  const lineHendeler = (event) => {
    setNewLine(event.target.value);
    fetchProces(event.target.value);
    //console.log(event.target.value);
  };

  const procesHendeler = (event) => {
    setNewProces(event.target.value);
    fetchMachine(newLine, event.target.value);
    //console.log(event.target.value);
  };

  const machineHendeler = (event) => {
    setNewMachine(event.target.value);
    //console.log(event.target.value);
  };

  const submitHendeler = (even) => {
    getDataWithMachine();
    console.log(newMachine);
  };

  const batchHendeler = (even) => {
    setNoBatch(even.target.value);
    console.log(even.target.value);
  };

  useEffect(() => {
    fetchLine();
  }, []);

  return (
    <div>
      <Header />
      <div>
        <h1 className="text-center text-text text-4xl antialiased hover:subpixel-antialiased p-8">
          BATCH RECORD
        </h1>
      </div>

      <div className="flex flex-row justify-center items-center">
        <div className="main flex flex-row gap-x-6">
          <div>
            <label
              htmlFor="line"
              className="block text-sm font-medium leading-6 text-text"
            >
              Start Date
            </label>
            <Input
              //onChange={dateStart}
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
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
            <label
              htmlFor="line"
              className="block text-sm font-medium leading-6 text-text"
            >
              Finish Date
            </label>
            <Input
              //onChange={dateFinish}
              placeholder="Select Date and Time"
              size="md"
              type="datetime-local"
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
            <label
              htmlFor="line"
              className="block text-sm font-medium leading-6 text-text"
            >
              Search Batch
            </label>
            <div className="search">
              <Input
                id="outlined-basic"
                label="Search"
                autocomplete="off"
                width="160px"
                onChange={batchHendeler}
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
          </div>
          <div>
            <label
              htmlFor="line"
              className="block text-sm font-medium leading-6 text-text"
            >
              Line Area
            </label>
            <div className="mt-2">
              <Select placeholder="All Line" id="line" onChange={lineHendeler}
                sx={{
                  border: "1px solid",
                  borderColor: borderColor,
                  borderRadius: "0.395rem",
                  background: "var(--color-background)", // background color from Tailwind config
        
                  _hover: {
                    borderColor: hoverBorderColor,
                  },
                }}>
                {renderLine()}
              </Select>
            </div>
          </div>
          <div>
            <label
              htmlFor="proces"
              className="block text-sm font-medium leading-6 text-text"
            >
              Process
            </label>
            <div className="mt-2">
              <Select placeholder="All Process" onChange={procesHendeler}
                sx={{
                  border: "1px solid",
                  borderColor: borderColor,
                  borderRadius: "0.395rem",
                  background: "var(--color-background)", // background color from Tailwind config
        
                  _hover: {
                    borderColor: hoverBorderColor,
                  },
                }}>
                {renderProces()}
              </Select>
            </div>
          </div>
          <div>
            <label
              htmlFor="machine"
              className="block text-sm font-medium leading-6 text-text"
            >
              Machine
            </label>
            <div className="mt-2">
              <Select placeholder="All Machine" onChange={machineHendeler}>
                {renderMachine()}
              </Select>
            </div>
          </div>

          <div className="no-print">
            <Button
              className="w-40 mt-8 no-print"
              colorScheme="blue"
              onClick={() => submitHendeler()}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
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
      </Stack>
      <Box className="scroll-box whitespace-nowrap mt-8 bg-card rounded-md mx-2">
        <TableContainer>
          <Table key={colorMode} variant="simple" className="scroll-table" >
            <TableCaption sx={{
                color: tulisanColor,
                }}>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th sx={{
                color: tulisanColor,
                }}>No</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Batch-ID</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Process</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Date</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Data1</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Data2</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Data3</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Data4</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Data5</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Data6</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Data7</Th>
                <Th sx={{
                color: tulisanColor,
                }}>Data8</Th>
              </Tr>
            </Thead>
            <Tbody>{renderData()}</Tbody>
          </Table>
        </TableContainer>
      </Box>
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
          Page {currentPage} of {Math.ceil(mainData.length / rowsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          isDisabled={currentPage === Math.ceil(mainData.length / rowsPerPage)}
          colorScheme="blue"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default BatchRecord;
