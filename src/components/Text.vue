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

<div id="TEXT">
<p>Lorem ipsum dolor sit amet.</p>
<p>Obcaecati quibusdam tempora sunt dolorum?</p>
<p>Quia sequi dolore tempora maxime?</p>
<p>Consequatur laboriosam minima numquam dicta.</p>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, quisquam!</p>
<p>Voluptatum doloremque provident repellat atque enim ipsum eum eos alias.</p>
<p>Distinctio deleniti dolore maiores possimus, inventore iure nobis illo ipsum.</p>
<p>Mollitia laborum quae aut, excepturi neque natus necessitatibus blanditiis fugiat.</p>
<p>Natus commodi omnis rerum illo, ipsum amet. Accusamus, culpa dolores.</p>
<p>Nesciunt laboriosam vel debitis ea iure mollitia magnam facilis omnis.</p>
<p>Suscipit iusto, aliquid obcaecati maiores voluptatum aspernatur eos perferendis quam.</p>
<p>Suscipit, cupiditate tenetur ab unde libero voluptas. Deleniti, repudiandae facere!</p>
<p>Esse, laborum perferendis maiores repudiandae pariatur libero deleniti minima temporibus?</p>
<p>Illo facilis obcaecati facere blanditiis cum ex aliquid temporibus harum?</p>
</div>
</template>

<style scoped></style>
