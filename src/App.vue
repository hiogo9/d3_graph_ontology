<script setup>
import Graph from "./components/Graph.vue";
import Ontology from "./components/Ontology.vue";
import Text from "./components/Text.vue";
</script>

<template>
  <h1>Main</h1>
  <div class="grid-container">
  <Text class="float-child"></Text>
  <Graph class="float-child"></Graph>
</div>
  <Ontology></Ontology>
</template>

<style scoped>
h1 {
  font-size: 1em;
}
/* .float-container {
    border: 3px solid #fff;
    padding: 20px;
} */
.grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}
</style>
