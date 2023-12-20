<script setup>
import { ref, onMounted } from "vue";
import * as d3 from "d3";
onMounted(() => {
  // Specify the dimensions of the chart.
  const width = 928;
  const height = 600;

  // Create the SVG container.
  var svg = d3.select("onto");
  svg
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");
});
</script>

<template>
  <h1>d3_ontology</h1>
  <div id="onto"></div>
</template>

<style scoped></style>
