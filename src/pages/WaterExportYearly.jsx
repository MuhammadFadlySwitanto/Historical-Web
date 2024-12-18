import React, { useEffect, Component, useState } from "react";
import CanvasJSReact from "../canvasjs.react";
import { Button, 
    ButtonGroup,
    Stack, 
    Input, 
    Select, 
    Radio, 
    RadioGroup,
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    TableContainer
} from "@chakra-ui/react";
import axios from "axios";
import { ExportToExcel } from "../ExportToExcel";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

function WaterExportYearly() {
    const [dataExport, setData] = useState([])
    const [startDate, setStartDate] = useState();
    const [finishDate, setFinishDate] = useState();
    const [fileName, setfilename] = useState();

    const { colorMode } = useColorMode();
    const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
    const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
    const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");

    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.getAttribute("data-theme") === "dark"
      );

    const fetchWaterTotalizer = async () => {
        let response1 = await axios.get(
            "http://10.126.15.141:8002/part/ExportWaterTotalizerYearly",
            {
              params: {
                start: startDate,
                finish: finishDate,
              }
            }
          );
          setData(response1.data); 
          setfilename("Water Totalizer Data Yearly")
    };
    const fetchWaterConsumption = async () => {
        let response = await axios.get(
            "http://10.126.15.141:8002/part/ExportWaterConsumptionYearly", 
            {
              params: {
                start: startDate,
                finish: finishDate,
              }
            }
          );
          setData(response.data); 
          setfilename("Water Consumption Data Yearly") 
    };

    let dateStart = (e) =>{
        var dataInput = e.target.value;
        setStartDate(dataInput);
    };
    let dateFinish = (e) =>{
        var dataInput = e.target.value;
        setFinishDate(dataInput);
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

    const previewTable = () => {
        return dataExport.map((data) =>{
            return (
                <Tr>
                    <Td>{data.Tahun}</Td>
                    <Td>{data.pdam}</Td>   
                    <Td>{data.Domestik}</Td>
                    <Td>{data.Chiller}</Td>
                    <Td>{data.Softwater}</Td>
                    <Td>{data.Boiler}</Td>
                    <Td>{data.Inlet_Pretreatment}</Td>
                    <Td>{data.Outlet_Pretreatment}</Td>
                    <Td>{data.Reject_Osmotron}</Td>
                    <Td>{data.Taman}</Td>
                    <Td>{data.Inlet_WWTP_Kimia}</Td>
                    <Td>{data.Inlet_WWTP_Biologi}</Td>
                    <Td>{data.Outlet_WWTP}</Td>
                    <Td>{data.CIP}</Td>
                    <Td>{data.Hotwater}</Td>
                    <Td>{data.Lab}</Td>
                    <Td>{data.Atas_Toilet_Lt2}</Td>
                    <Td>{data.Atas_Lab_QC}</Td>
                    <Td>{data.Workshop}</Td>
                    <Td>{data.Air_Mancur}</Td>
                    <Td>{data.Osmotron}</Td>
                    <Td>{data.Loopo}</Td>
                    <Td>{data.Produksi}</Td>
                    <Td>{data.washing}</Td>
                    <Td>{data.lantai1}</Td>
                </Tr>
            );
        });
    }; 
    return (
        <div>
            <div align="center"><h1 className="text-4xl"><b>Export Yearly Water Data </b></h1></div>
            <br />
            <Stack
                className="flex flex-row justify-center mb-4  "
                direction="row"
                spacing={4}
                align="center"
            >
            <div>
                <h2 className="mb-1">Start Time</h2>
                <Input
                    onChange={dateStart}
                    placeholder="YYYY"
                    size="md"
                    type="number"

                />
            </div>
            <div>
                <h2 className="mb-1">Finish Time</h2>
                <Input
                    onChange={dateFinish}
                    placeholder="YYYY"
                    size="md"
                    type="number"
                />
            </div>
            <div className="text-text"> Data Type : 
                <RadioGroup>
                <Stack direction='row'>
                    <Radio className="text-text" value='1' onClick={() => fetchWaterConsumption()}>Consumption</Radio>
                    <Radio className="text-text" value='2' onClick={() => fetchWaterTotalizer()}>Totalizer</Radio>
                </Stack>
                </RadioGroup>
            </div>
 
        </Stack>
        <Stack
            className="flex flex-row justify-center mb-4  "
            direction="row"
            spacing={4}
            align="center"
        >
            <div>
                <ExportToExcel apiData={dataExport} fileName={fileName} />
            </div>
        </Stack>
        <div align="center"><h1 className="text-2xl"><b>Preview {fileName} :</b></h1></div>
        <TableContainer>
          <Table key={colorMode} variant="simple">
            <Thead>
              <Tr backgroundColor={isDarkMode ? "blue.300" : "lightblue"}>
                <Th sx={{color: tulisanColor,}}>Date Time</Th>
                <Th sx={{color: tulisanColor,}}>PDAM</Th>
                <Th sx={{color: tulisanColor,}}>Domestik</Th>
                <Th sx={{color: tulisanColor,}}>Chiller</Th>
                <Th sx={{color: tulisanColor,}}>Softwater</Th>
                <Th sx={{color: tulisanColor,}}>Boiler</Th>
                <Th sx={{color: tulisanColor,}}>Inlet Pretreatment</Th>
                <Th sx={{color: tulisanColor,}}>Outlet Pretreatment</Th>
                <Th sx={{color: tulisanColor,}}>Reject Osmotron</Th>
                <Th sx={{color: tulisanColor,}}>Taman</Th>
                <Th sx={{color: tulisanColor,}}>Inlet WWTP Kimia</Th>
                <Th sx={{color: tulisanColor,}}>Inlet WWTP Biologi</Th>
                <Th sx={{color: tulisanColor,}}>Outlet WWTP</Th>
                <Th sx={{color: tulisanColor,}}>CIP</Th>
                <Th sx={{color: tulisanColor,}}>Hotwater</Th>
                <Th sx={{color: tulisanColor,}}>Lab</Th>
                <Th sx={{color: tulisanColor,}}>Atas Toilet Lt2</Th>
                <Th sx={{color: tulisanColor,}}>Atas Lab QC</Th>
                <Th sx={{color: tulisanColor,}}>Workshop</Th>
                <Th sx={{color: tulisanColor,}}>Air Mancur</Th>
                <Th sx={{color: tulisanColor,}}>Osmotron</Th>
                <Th sx={{color: tulisanColor,}}>Loopo</Th>
                <Th sx={{color: tulisanColor,}}>Produksi</Th>
                <Th sx={{color: tulisanColor,}}>Washing</Th>
                <Th sx={{color: tulisanColor,}}>Lantai 1</Th>
              </Tr>
            </Thead>
            <Tbody>{previewTable()}</Tbody>
          </Table>
        </TableContainer>
        </div>
    );
}
export default WaterExportYearly;