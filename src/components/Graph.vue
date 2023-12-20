<script setup>
import * as d3 from "d3";
import { ref, onMounted } from "vue";

const svgRef = ref(null);
function creatSVG() {
  var width = 500;
  var height = 500;

  //Create SVG element
  var svg = d3.select(svgRef.value);

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
  creatSVG();
});
</script>

<template>
  <h1>d3_graph</h1>
  <svg ref="container_graph" width="500" height="500"></svg>
</template>

<style scoped></style>
