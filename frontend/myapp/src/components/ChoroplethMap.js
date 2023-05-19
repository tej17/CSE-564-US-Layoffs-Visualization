import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ChoroplethMap = ( {props, handleStateChange} ) => {
  const ref = useRef(null);


  useEffect(() => {
    const usStates = props.choroplethMap;
    const svg = d3.select(ref.current);
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const projection = d3.geoAlbersUsa().fitSize([width, height], usStates);

    const colorScale = d3
      .scaleLog()
      .domain([1, d3.max(usStates.features, d => d.value)])
      .range(['#41b6c4','#225ea8','#0c2c84']);

    const path = d3.geoPath().projection(projection);

    const handleClick = (event, d) => {

      const statePath = svg.select(`#${event.properties.name.replace(/\s+/g, '')}`);
      const fillColor = statePath.attr('fill');
      const newFillColor = fillColor === '#238443' ? colorScale(event.value) : '#238443';
      statePath.attr('fill', newFillColor);

      if (newFillColor === '#238443') {
        handleStateChange(event.properties.name); // call handleStateChange method here
      } else {
        handleStateChange("US");
      }
    };

    svg
      .selectAll('path')
      .data(usStates.features)
      .join('path')
      .attr('id', d => d.properties.name.replace(/\s+/g, ''))
      .attr('d', path)
      .attr('fill', d => colorScale(d.value))
      .on('click', handleClick)
      .append('title')
      .text(d => d.properties.name + " " + d.value);
  }, [props.start, props.end]);

  return (
    <svg ref={ref} width={500} height={280}>
    </svg>
  );
};

export default ChoroplethMap;
