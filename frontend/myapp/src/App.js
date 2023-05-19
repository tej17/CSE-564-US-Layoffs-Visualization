import logo from './logo.svg';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import {SunburstChart} from './components/SunburstChart.js';
import ChoroplethMap from './components/ChoroplethMap.js';
import ParallelCoordinatesPlot from './components/ParallelCoordinatesPlot.js';
import BarChart from './components/BarChart.js';
import NavBar from './components/NavBar.js';
import CirclePackingChart from './components/CirclePackingChart.js';
import ScatterPlotCompany from './components/ScatterPlotCompany.js';
import ScatterPlotIndustry from './components/ScatterPlotIndustry.js';
import ScatterPlotFunding from './components/ScatterPlotFunding.js';

const App = () => {

    const [data, setData] = useState({
      state: "US",
      start: "2020-03-01",
      end: "2023-03-29",
      choroplethMap: null,
      histData: null,
      parallelData: null,
      circlePackingData: null,
      scatterplotDataFunding: null,
      scatterplotDataCompany: null,
      scatterplotDataIndustry: null,
    });


    useEffect(() => {
        fetch("http://localhost:5000/getMapData",{
             method: 'POST',
             body: JSON.stringify(data)
         })
        .then(response =>response.json())
        .then(data => {
            setData((prevState) => ({
              ...prevState,
              choroplethMap: data,
            }));
        });

        fetch("http://localhost:5000/getDatesData")
        .then(response =>response.json())
        .then(data => {
            setData((prevState) => ({
              ...prevState,
              histData: data,
            }));
        });

        fetch("http://localhost:5000/getPcpData",{
             method: 'POST',
             body: JSON.stringify(data)
         })
        .then(response => response.json())
        .then(data => {
            setData((prevState) => ({
              ...prevState,
              parallelData: data,
            }));
        });

        fetch("http://localhost:5000/getCirclePackingChartData",{
             method: 'POST',
             body: JSON.stringify(data)
         })
        .then(response => response.json())
        .then(data => {
            const obj = {
                name: "US",
                children: data
            };
            setData((prevState) => ({
              ...prevState,
              circlePackingData: obj,
            }));
        });

        fetch("http://localhost:5000/getScatterPlotA", {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            setData((prevState) => ({
              ...prevState,
              scatterplotDataFunding: data,
            }));
        });

        fetch("http://localhost:5000/getScatterPlotB", {
             method: 'POST',
             body: JSON.stringify(data)
         })
        .then(response => response.json())
        .then(data => {
            setData((prevState) => ({
              ...prevState,
              scatterplotDataCompany: data,
            }));
        });

        fetch("http://localhost:5000/getScatterPlotC", {
              method: 'POST',
              body: JSON.stringify(data)
          })
        .then(response => response.json())
        .then(data => {
            setData((prevState) => ({
              ...prevState,
              scatterplotDataIndustry: data,
            }));
        });

    }, [data.state, data.start, data.end]);

    const handleStateChange = (state) => {
        console.log(state);
        setData({...data, state: state});
    };

    const handleDateChange = (start, end) => {
        setData({...data, start: start, end: end});
    };

    return (
        <>
            <NavBar />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4%" }}>
                <div style={{ flex: "1", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "10px", marginBottom: "10px" }}>
                    <div style={{ textAlign: "center", fontSize: "15px", fontWeight: "bold", marginBottom: "10px" }}>
                      STATEWISE LAYOFFS
                    </div>
                    {data.choroplethMap !== null && (
                        <ChoroplethMap props={data} handleStateChange={handleStateChange} />
                    )}
                </div>
                <div style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "10px", marginBottom: "10px", marginLeft: "10px" }}>
                  <div style={{ textAlign: "center", fontSize: "15px", fontWeight: "bold", marginBottom: "10px" }}>
                    LAYOFF CATEGORIES
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ flex: "1" }}>
                      {data.scatterplotDataCompany !== null && (
                        <ScatterPlotCompany data={data.scatterplotDataCompany} />
                      )}
                    </div>
                    <div style={{ flex: "1" }}>
                      {data.scatterplotDataIndustry !== null && (
                        <ScatterPlotIndustry data={data.scatterplotDataIndustry} />
                      )}
                    </div>
                    <div style={{ flex: "1" }}>
                      {data.scatterplotDataFunding !== null && (
                        <ScatterPlotFunding data={data.scatterplotDataFunding} />
                      )}
                    </div>
                  </div>
                </div>

            </div>
            <div style={{ display: "flex", justifyContent: "space-between"}}>
                <div style={{ flex: "1", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "10px", marginBottom: "10px" }}>
                    <div style={{ textAlign: "center", fontSize: "15px", fontWeight: "bold", marginBottom: "0px" }}>
                      PARALLEL COORDINATES PLOT
                    </div>
                    <div style={{ marginLeft:'1%', flex: "1" }}>
                        {data.parallelData !== null && (
                            <ParallelCoordinatesPlot props={data} />
                        )}
                    </div>
                </div>
                <div style={{ flex: "1", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "10px", marginBottom: "10px", marginLeft: '10px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <div style={{ textAlign: "center", fontSize: "15px", fontWeight: "bold", marginBottom: "20px" }}>
                    INDUSTRY WIDE LAYOFFS
                  </div>
                  <div style={{ flex: "1" }}>
                    {data.circlePackingData !== null && (
                      <CirclePackingChart props={data} />
                    )}
                  </div>
                </div>

            </div>
            <div>
                <div style={{ flex: "1", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "10px", marginBottom: "10px", display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <div style={{ textAlign: "center", fontSize: "15px", fontWeight: "bold", marginBottom: "0px" }}>
                      TIME SERIES CHART
                    </div>
                    <div style={{ flex: "1" }}>
                        {data.histData !== null && (
                            <BarChart props={data} handleDateChange={handleDateChange}/>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
