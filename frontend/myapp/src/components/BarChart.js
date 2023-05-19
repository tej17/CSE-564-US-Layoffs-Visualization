import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = ({ props, handleDateChange }) => {
  const ref = useRef();
  const [currentDate, setCurrentDate] = useState([props.start, props.end]);
  const [brushSelection, setBrushSelection] = useState(null);
  useEffect(() => {
    const data = props.histData;
    const margin = { top: 0, right: 10, bottom: 40, left: 60 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const svg = d3
          .select(ref.current)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.date))
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => d.total_laid_off)]);

    const bars = svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.date))
      .attr('y', (d) => yScale(d.total_laid_off))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.total_laid_off))
      .attr('fill', '#69b3a2');

    const xAxis = d3.axisBottom(xScale);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-25)');

    // Add brushing effect
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('end', brushed);

    svg.append('g').attr('class', 'brush').call(brush);

    function onBrush(event) {
      setBrushSelection(d3.event.selection);
    }

    function brushed(event) {
      const selection = d3.event.selection;
      if (selection) {
        const [xStart, xEnd] = selection;
        const selectedDates = data.filter(
          (d) => xScale(d.date) >= xStart && xScale(d.date) + xScale.bandwidth() <= xEnd
        );
        if(selectedDates.length > 0) {
            handleDateChange(selectedDates[0].date, selectedDates[selectedDates.length-1].date);
        }
        // Change the color of the selected bars to green
        svg
          .selectAll('.bar')
          .attr('fill', (d) =>
            selectedDates.includes(d) ? '#8BC34A' : '#69b3a2'
          );
        // Display the value of the selected bars above the bars
        svg
          .selectAll('.bar-text')
          .data(selectedDates)
          .join('text')
          .attr('class', 'bar-text')
          .attr('x', (d) => xScale(d.date) + xScale.bandwidth() / 2)
          .attr('y', (d) => yScale(d.total_laid_off) - 5)
          .attr('text-anchor', 'middle')
          .style('font-size', '10px')
          .text((d) => d.total_laid_off);

      } else {
        svg.selectAll('.bar').attr('fill', '#69b3a2');
        svg.selectAll('.bar-text').remove();
      }
    }
  }, [props]);



  return <svg ref={ref} width={1000} height={250}></svg>;
};

export default BarChart;
