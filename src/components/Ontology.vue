<script setup>
import { ref, onMounted } from "vue";

class Atr {
  constructor(id, data, type) {
    this.id = id;
    this.data = data;
    this.type = type;
  }
}

class Node {
  atrs = [];
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }
}

class Link {
  atrs = [];
  constructor(id, start, end, type) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.type = type;
  }
}
let atr = new Atr(0, "simple_text", "string");
let node_0 = new Node(0, "node_type_0");
node_0.atrs.push(atr);
let node_1 = new Node(1, "node_type_0");
node_1.atrs.push(atr);
let link_0 = new Link(0, node_0, node_1, "link_type_0");
link_0.atrs.push(atr);
let link_1 = new Link(1, node_0, node_1, "link_type_0");
link_1.atrs.push(atr);
let items = [node_0, node_1, link_0, link_1];

const ontology = ref(items);


function eventHandler(event){
  alert(event.target.innerText)
  console.log(item)
}
</script>

<template>
  <h1>ontology component</h1>
  <div class="row" id="onto">
    <div class="column" id="item" v-for="item in items" :key="item.id">
      <div v-on:click="eventHandler" class="item">{{ item }}</div>
    </div>
  </div>
  <button>add new object</button>
</template>

<style scoped>
.column{
  float: left;
  width: 25%;
  padding: 0 10px;
}


</style>
