import {
  useCallback,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  createRef,
  useMemo,
} from "react";
import * as d3 from "d3";

const gridLineColor = "#684550";
const white = "#F7ECE1";
const dataBlue = "#14BBF0";
// const svgWidth = 500;
// const svgHeight = 500;

// const gap = 20;
// const width = 400
// const paddingBottom = 10;
// const padding = 10;

// var dateFormat = d3.time.format("%Y-%m-%d %H:%M");

export const Gant = (props) => {
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
      {width > 0 && height > 0 && <GantD width={width} height={height} {...props}/>}
    </div>
  );
};

export const GantD = (props) => {
  const { width = 500, height = 300, xPadding = 100, padding = 15, data } = props;

  const ref = useRef();

  const numData = data.length;
  const diagramWidth = Math.floor(width - padding * 2);
  const diagramHeight = Math.floor(height - padding * 2);
  const gap = diagramHeight / numData;

  //List of unique categories
  const categories = data.reduce(
    (acc, data) =>
      acc.includes(data.category) ? acc : [...acc, data.category],
    []
  );

  const categorizedData = data.reduce(
    (acc, data) =>
      acc[data.category] === undefined
        ? { ...acc, [data.category]: [{ ...data }] }
        : { ...acc, [data.category]: [...acc[data.category], { ...data }] },
    {}
  );

  const categoryRange = categories.reduce(
    (acc, cat, i) => {
      const prevCats = categories.reduce(
        (acc, c, id) => (id < i ? acc + categorizedData[c].length : acc),
        0.0
      );

      const numThisCat = categorizedData[cat].length;

      console.log(prevCats, numThisCat, gap);

      return [...acc, (prevCats + numThisCat) * gap + padding];
    },
    [padding]
  );

  console.log(categoryRange);

  useLayoutEffect(() => {
    const svgElement = d3.select(ref.current);
    // svgElement.selectAll("g").remove();

    //Draw container
    svgElement
      .select(".container")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("x", padding)
      .attr("y", padding)
      .attr("height", diagramHeight)
      .attr("width", diagramWidth)
      .attr("fill", "#332025")
      .attr("stroke", gridLineColor);

    // Scale for x-axis
    const xScale = d3
      .scaleTime()
      .domain([
        new Date("2013-02-02 08:00:00"),
        new Date("2013-02-02 24:00:00"),
      ])
      .range([padding + xPadding, diagramWidth + padding]);

    // Generator for x-axis ticks
    const xAxisGenerator = d3
      .axisTop(xScale)
      .tickSize(-(numData * gap))
      .tickFormat(d3.timeFormat("%H:%S"));

    // Call x-axis generator and transform placement
    svgElement
      .select(".x-axis")
      .attr("color", "transparent")
      .call(xAxisGenerator)
      .attr("transform", `translate(0,${padding})`);

    // Set color of x-axis grid line
    svgElement.selectAll(".x-axis line").attr("color", gridLineColor);

    // Set color and font for x-axis labels
    svgElement
      .selectAll(".x-axis text")
      .attr("stroke", "none")
      .attr("font-size", "12px")
      .attr("color", white);

    //Remove line from last x-axis tick
    svgElement.selectAll(".x-axis .tick:last-of-type line").remove();

    // y-axis scale for data
    const yScale = d3
      .scaleLinear()
      .domain([0, numData])
      .range([padding, diagramHeight + padding]);

    // y axis scale for categories
    const yScaleCategories = d3
      .scaleOrdinal()
      .domain(categories)
      .range(categoryRange);

    //Generator for y-axis ticks (Categories)
    const yAxisGenerator = d3.axisLeft(yScaleCategories).tickSize(diagramWidth);

    // Call y-axis generator and transform placement
    svgElement
      .select(".y-axis")
      .attr("color", "transparent")
      .call(yAxisGenerator)
      .attr("transform", `translate(${diagramWidth + padding},0)`);

    //Set color of y-axis grid line
    svgElement.selectAll(".y-axis line").attr("color", gridLineColor);

    //Set color and font for y-axis labels
    //TODO: placement
    svgElement
      .selectAll(".y-axis text")
      .attr("text-anchor", "start")
      .attr("stroke", "none")
      .attr("font-size", "12px")
      .attr("fill", white);

    //Remove line from last y-axis tick
    svgElement.selectAll(".y-axis .tick:first-of-type line").remove();

    //Draw data
    svgElement
      .selectAll(".data")
      .data(data,d => d.id)
      .join(
        (enter) =>
          enter
            .append("rect")
            .classed("data", true)
            .attr("rx", 3)
            .attr("ry", 3)
            .attr(
              "x",
              (d) =>
                xScale(d.startTime) +
                (xScale(d.endTime) - xScale(d.startTime)) / 2 +
                2
            )
            .attr("y", (d, i) => yScale(d.sortId) + 2)
            .attr("height", gap - 4)
            .attr("stroke", dataBlue)
            .attr("fill", "rgba(16, 151, 199,0.5)")
            .on("mouseover", (event, d) => {
              d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .attr("fill", "rgb(16, 151, 199)");
            })
            .on("mouseout", (event, d) => {
              d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .attr("fill", "rgba(16, 151, 199,0.5)");
            })
            .call((enter) =>
              enter
                .transition()
                .duration(500)
                .attr(
                  "width",
                  (d) => xScale(d.endTime) - xScale(d.startTime) - 4
                )
                .attr("x", (d) => xScale(d.startTime) + 2)
            ),
        (update) =>
          update
            .attr("width", (d) => xScale(d.endTime) - xScale(d.startTime) - 4)
            .attr("x", (d) => xScale(d.startTime) + 2)
            .attr("y", (d, i) => yScale(d.sortId) + 2)
            .attr("height", gap - 4)
      );

    //Set data labels
    svgElement
      .selectAll(".label")
      .data(data, d => d.id)
      .join(
        (enter) =>
          enter
            .append("text")
            .text((d) => d.task)
            .classed("label", true)
            .attr("x", (d) => xScale(d.startTime) + padding)
            .attr("font-size", 16)
            .attr("text-anchor", "right")
            .attr("text-height", gap)
            .attr("fill", "#fff")
            .attr("opacity", "0")
            .attr("y", (d, i) => yScale(d.sortId) + gap / 2 + 8)
            .call((enter) =>
              enter.transition().duration(1500).attr("opacity", "1")
            ),
        (update) =>
          update
            .text((d) => d.task)
            .attr("x", (d) => xScale(d.startTime) + padding)
            .attr("y", (d, i) => yScale(d.sortId) + gap / 2 + 8)
      );
  }, [
    categories,
    categoryRange,
    data,
    diagramHeight,
    diagramWidth,
    gap,
    numData,
    padding,
    width,
    xPadding,
  ]);

  
  return (
    <>
      <svg ref={ref} height={height} width={width}>
        <rect className="container" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </>
  );
};
