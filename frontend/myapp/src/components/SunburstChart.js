import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";


const SIZE = 290;
const RADIUS = SIZE / 2;

export const SunburstChart = ( {data} ) => {
    const svgRef = useRef(null);

    const [sunburstData, setSunburstData] = useState({});

    const partition = (data) =>
        d3.partition().size([2 * Math.PI, RADIUS])(
          d3
            .hierarchy(data)
            .sum((d) => d.size)
            .sort((a, b) => b.size - a.size)
        );

    const color = d3.scaleOrdinal(
           d3.quantize(d3.interpolateRainbow, 38)
       );

    const format = d3.format(",d");

    const arc = d3
        .arc()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(RADIUS / 2)
        .innerRadius((d) => d.y0)
        .outerRadius((d) => d.y1 - 1);

    const getAutoBox = () => {
        if (svgRef.current === null) {
          return "";
        }
        const { x, y, width, height } = svgRef.current.getBBox();
        return [x, y, width, height].toString();
      };

    useEffect(()=>{
        const obj = {
            "name": "US Layoffs",
            "children": data
        };
        setSunburstData(obj);

        const root = partition(obj);
        const svg = d3.select(svgRef.current);

        svg
          .append("g")
          .attr("fill-opacity", 0.6)
          .selectAll("path")
          .data(root.descendants().filter((d) => d.depth))
          .join("path")
          .attr("fill", (d) => {
            while (d.depth > 1) d = d.parent;
            return color(d.data.name);
          })
          .attr("d", arc)
          .on("click", (event, d) => {
              svg
                .selectAll("path")
                .attr("opacity", 1)
                .attr("stroke-width", 0);
              d3.select(event.currentTarget)
                .attr("opacity", 0.8)
                .attr("stroke", "white")
                .attr("stroke-width", 2);
            })
          .append("title")
          .text(
            (d) =>
              `${d
                .ancestors()
                .map((d) => d.data.name)
                .reverse()
                .join("/")}\n${format(d.value)}`
          );

        svg
          .append("g")
          .attr("pointer-events", "none")
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .attr("font-family", "sans-serif")
          .selectAll("text")
          .data(
            root
              .descendants()
              .filter((d) => d.depth && ((d.y0 + d.y1) / 2) *
              (d.x1 - d.x0) > 10)
          )
          .join("text")
          .attr("transform", function (d) {
            const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${
              x - 90
            }) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
          })
          .attr("dy", "0.35em")
          .text((d) => d.data.name);
        svg.attr("viewBox", getAutoBox);

    }, [data]);

    return (
        <svg style={{marginLeft: '25%'}} width={SIZE} height={SIZE} ref={svgRef} />
    );
};