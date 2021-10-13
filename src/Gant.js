import {
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  createRef,
} from "react";
import * as d3 from "d3";

const dataSet = [
  {
    task: "Hannah kristiania",
    type: "Kai A",
    startTime: 8,
    endTime: 21,
    details: "This actually didn't take any conceptualization",
  },

  {
    task: "",
    type: "Lossing dekkslast",
    startTime: 12,
    endTime: 15,
    details: "No sketching either, really",
  },

  {
    task: "",
    type: "Lossing Bulk Brine",
    startTime: 15,
    endTime: 19,
  },

  {
    task: "",
    type: "Lasting dekkslast",
    startTime: 13,
    endTime: 14,
    details: "all three lines of it",
  },

  {
    task: "",
    type: "lasting Bulk Brine",
    startTime: 19,
    endTime: 20.5,
  },

  {
    task: "Hannah Kristiania",
    type: "Kai B",
    startTime: 8,
    endTime: 16.5,
    details: "This counts, right?",
  },
];

// const svgWidth = 500;
// const svgHeight = 500;

// const gap = 20;
// const width = 400
// const paddingBottom = 10;
// const padding = 10;
export const GantContainer = () => {
  const elementRef = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const setDim = () => {
      if (elementRef.current) {
        const { current } = elementRef;
        setWidth(current.getBoundingClientRect().width);
        setHeight(current.getBoundingClientRect().height);
        console.log("w: ", current.getBoundingClientRect().width);
        console.log("h: ", current.getBoundingClientRect().height);
      }
    };
    setDim();
    window.addEventListener("resize", setDim);
  }, []);

  return (
    <div ref={elementRef} style={{ height: "100%", width: "100%" }}>
      {width > 0 && height > 0 && <Gant width={width} height={height} />}
    </div>
  );
};
export const Gant = (props) => {
  const { width = 500, height = 300, padding = 15 } = props;

  const ref = useRef();
  const [data, setData] = useState(dataSet);

  const numData = data.length;
  const diagramWidth = Math.floor(width - padding * 2);
  const diagramHeight = Math.floor(height - padding * 2);
  const gap = Math.floor(diagramHeight / numData);

  useLayoutEffect(() => {
    const svgElement = d3.select(ref.current);
    svgElement.selectAll("g").remove();
    const xScale = d3
      .scaleLinear()
      .domain([7, 23])
      .range([padding, diagramWidth + padding]);

    const xAxisGenerator = d3
      .axisBottom(xScale)
      .ticks(17)
      .tickSize(numData * gap);

    const yScale = d3
      .scaleLinear()
      .domain([0, numData])
      .range([padding, diagramHeight + padding]);

    const yAxisGenerator = d3
      .axisLeft(yScale)
      .ticks(numData - 1)
      .tickSize(diagramWidth);

    // xAxis
    svgElement
      .append("g")
      .attr("class", "x-axis")
      .call(xAxisGenerator)
      .attr("transform", `translate(0,${padding})`)
      .attr("stroke", "#fefefe");
    // //yAxis
    svgElement
      .append("g")
      .attr("class", "y-axis")
      .call(yAxisGenerator)
      .attr("transform", `translate(${diagramWidth + padding},0)`)
      .attr("stroke", "#fefefe");

    // grid
    // svgElement
    //   .append("g")
    //   .selectAll("rect")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("x", padding)
    //   .attr("y", (_, i) => padding + i * gap)
    //   .attr("width", diagramWidth)
    //   .attr("height", gap)
    //   .attr("stroke", "#fefefe")
    //   .attr("fill", "none");

    // data
    svgElement
      .selectAll("rect")
      .data(data)
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("rx", 3)
            .attr("ry", 3)
            .attr("x", (d) =>
              xScale(d.startTime + (d.endTime - d.startTime) / 2)
            )
            .attr("y", (_, i) => yScale(i))
            .attr("height", gap)
            .attr("stroke", "white")
            .attr("fill", "rgba(16, 151, 199,0.7)")
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).transition().duration(200).attr("fill", "rgb(16, 151, 199)");
            })
            .on("mouseout", (event, d) => {
                  d3.select(event.currentTarget).transition().duration(200).attr("fill", "rgba(16, 151, 199,0.7)");
              })
            .call((enter) =>
              enter
                .transition()
                .duration(500)
                .attr("width", (d) => xScale(d.endTime) - xScale(d.startTime))
                .attr("x", (d) => xScale(d.startTime))
            ),
        (update) =>
          update
            .attr("width", (d) => xScale(d.endTime) - xScale(d.startTime))
            .attr("x", (d) => xScale(d.startTime))
      );
  }, [data, diagramHeight, diagramWidth, gap, numData, padding, width]);

  return (
    <>
      <svg ref={ref} height={height} width={width} />
    </>
  );
};

export const Circles = () => {
  const ref = useRef();
  const [data, setData] = useState(dataSet);

  const addCircle = () => {
    const cpy = [...data];
    cpy.push({
      x: Math.floor(Math.random() * 40),
      y: Math.floor(Math.random() * 40),
    });
    setData(cpy);
  };
  const removeCircle = () => {
    const [_, ...rest] = data;
    setData([...rest]);
  };

  useEffect(() => {
    const svgElement = d3.select(ref.current);
    svgElement
      .selectAll("circle")
      .data(data, (d) => d.x && d.y)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", 0)
            .attr("fill", "cornflowerblue")
            .call((enter) =>
              enter.transition().duration(1200).attr("r", 6).style("opacity", 1)
            ),
        (update) => update.attr("fill", "lightgrey"),
        (exit) =>
          exit
            .attr("fill", "tomato")
            .call((exit) =>
              exit
                .transition()
                .duration(1200)
                .attr("r", 0)
                .style("opacity", 0)
                .remove()
            )
      );
  }, [data]);
  return (
    <>
      <svg ref={ref} viewBox="0 0 100 50" />
      <>
        <button onClick={() => addCircle()}>add</button>
        <button onClick={() => removeCircle()}>remove</button>
      </>
    </>
  );
};
