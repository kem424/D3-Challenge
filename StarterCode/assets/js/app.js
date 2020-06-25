// Define SVG width

var svgWidth = 1000;
var svgHeight = 600;

// Define the chart's margins 

var margin = { 
  top: 60, 
  right: 60, 
  bottom: 60, 
  left: 60 
};
// Define dimensions 
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

// Append a group area, then set its margins
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// append tooltip
var toolTip =d3.select("#scatter")
.append("div")
.attr("class", "tooltip")

// Read CSV
d3.csv("assets/data/data.csv").then(function(Data) {
  console.log(Data)
  

  Data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

// Create scales 
  var xLinearScale = d3.scaleLinear()
    .domain([7, d3.max(Data, d => d.poverty)])
    .range([0, chartWidth])

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(Data, d => d.healthcare)])
    .range([chartHeight, 0]);

  
// Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append axes
  chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);
  chartGroup.append("g")
      .call(leftAxis);

  
  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(Data)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", "15")
  .attr("fill", "lightblue")
  .attr("stroke-width", "1")
  .attr("stroke", "black")
  .attr("opacity", ".5")
  .select("text")
  .data(Data)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .attr("text-anchor", "middle")
  .attr("font-size", 10)  
  .attr('fill', 'black')
  .text(function(d) {
      return d.abbr
    })

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {return (`<br>${d.poverty}<br>Age: ${d.healthcare}`)})
      
    
    chartGroup.call(toolTip);

  // Event listener 
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

 // Create axes labels
 chartGroup.append("text")
 .attr("transform", "rotate(-90)")
 .attr("y", 0 - margin.left +10)
 .attr("x", 0 - (chartHeight / 2))
 .attr("dy", "1em")
 .attr("class", "axisText")
 .text("Lack of health care");

chartGroup.append("text")
 .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top -5})`)
 .attr("class", "axisText")
 .text("Poverty (%)");
}).catch(function(error) {
console.log(error);
});
