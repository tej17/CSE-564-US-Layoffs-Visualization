import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ScatterPlotCompany = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const margin = { top: 20, right: 20, bottom: 70, left: 70 };
    const width = 300 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);



    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.stage))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.total_laid_off)])
      .range([height, 0]);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-30)');

    svg
      .append('text')
      .attr('x', width / 2 - 20)
      .attr('y', height + margin.top + 45)
      .attr('text-anchor', 'middle')
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .text('Stage');


    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale));

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.stage) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.total_laid_off))
      .attr('r', 5)
      .style('fill', '#7570b3')
      .on('mouseover', (event, d) => {

        d3.select(d3.event.currentTarget)
          .attr('r', 8) // increase the circle size on hover
          .append('title') // add a title element for the on hover text
          .text(`${event.total_laid_off} employees laid off from ${event.stage}`);
      })
      .on('mouseout', (event, d) => {
        d3.select(d3.event.currentTarget)
          .attr('r', 5) // restore the circle size on mouseout
          .select('title') // remove the title element
          .remove();
      });
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default ScatterPlotCompany;
