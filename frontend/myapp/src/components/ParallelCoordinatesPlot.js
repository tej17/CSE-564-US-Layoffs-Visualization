import React, { useEffect, useRef } from "react";
import Parcoords from "parcoord-es";
import "parcoord-es/dist/parcoords.css";
import * as d3 from 'd3';

const ParallelCoordinatesPlot = ({ props }) => {
    const chartRef = useRef(null);
    const colors = ["#4c78a8","#f58518","#54a24b","#e45756"];
    useEffect(() => {
        d3.select(chartRef.current).selectAll("*").remove();
        const loadData = async () => {
            if (chartRef !== null) {
                const pcp_data = props.parallelData;
                const chart = Parcoords()("#chart-id")
                    .data(pcp_data)
                    .hideAxis(["color"])
                    .color(function (d, i) {
                        return colors[i%4];
                    })
                    .render()
                    .brushMode("1D-axes")
                    .interactive()
                    .reorderable();
            }
        };
        loadData();
    }, [props]);

    return (
        <div
            ref={chartRef}
            id={"chart-id"}
            style={{ width: 900, height: 300 }}
            className={"parcoords"}
        >
        </div>
    );
};

export default ParallelCoordinatesPlot;