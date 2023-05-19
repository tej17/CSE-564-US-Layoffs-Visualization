import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './CirclePackingChart.css';

function CirclePackingChart({ props }) {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const data = props.circlePackingData;
    d3.select(svgRef.current).selectAll("*").remove();
    d3.select(tooltipRef.current).selectAll("*").remove();
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    // Set up the pack layout
    const pack = d3.pack().size([250, 250]).padding(3);

    // Generate the hierarchy of nodes
    const root = d3.hierarchy(data).sum(d => d.size);

    // Apply the pack layout to the hierarchy
    const packedNodes = pack(root).descendants();

    // Set up the color scale
    const colors = ['#cb181d','#fb6a4a','#fcbba1'];
    const colorScale = d3.scaleOrdinal().range(colors);

    // Draw the nodes
    svg
      .selectAll('circle')
      .data(packedNodes)
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', d => colorScale(d.depth))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', (event, d) => {
        if (event.data.size === undefined) {
          tooltip
            .style('opacity', 1)
            .html(`${event.data.name}`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY + 10 + 'px');
        } else {
          tooltip
            .style('opacity', 1)
            .html(`${event.data.name}: ${event.data.size}`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY + 10 + 'px');
        }
      })
      .on('mousemove', event => {
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY + 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    // Draw the labels
    svg
      .selectAll('text')
      .data(packedNodes.filter(d => !d.children))
      .join('text')
      .text(d => d.data.name)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#000')
      .attr('font-size', 9);
  }, [props]);

  return (
    <>
      <div style={{ justifyContent: "space-between"}}>
        <div style={{ flex: "1" }}>
          <svg ref={svgRef} width={280} height={280}>
            <g />
          </svg>
        </div>
        <div style={{ flex: "1" }}>
            <div className="tooltip" ref={tooltipRef} />
        </div>
      </div>
    </>
  );
}

export default CirclePackingChart;
