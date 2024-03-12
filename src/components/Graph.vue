<script setup>
import * as d3 from "d3";
import { ref, onMounted } from "vue";


function addNodes(){
  let svg = d3.select("#container_graph");
  let temp_data = [{ "name": "A" }, { "name": "B" }, { "name": "C" }, { "name": "D" }];
  let node = svg.append("g")
  .selectAll("nodes")
  .data(temp_data)
  .enter()

  let circles = node.append("circle")
  .attr("cx", ()=>{return Math.random()*500})
  .attr("cy", ()=>{return Math.random()*500})
  .attr("r", 40)
  .style("fill", "rgb(239, 192, 80)")
}

function creatSVG() {
  var width = 500;
  var height = 500;

  //Create SVG element
  var svg = d3.select("#container_graph");

  //Create and append rectangle element
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 200)
    .attr("height", 100);
  console.log("imdone");
}
onMounted(() => {
  // creatSVG();
  addNodes()
});
</script>

<template>
  <h1>d3_graph</h1>
  <svg id="container_graph" width="500" height="500"></svg>
</template>

<style scoped></style>
