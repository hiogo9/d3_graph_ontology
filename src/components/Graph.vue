<script setup>
import * as d3 from "d3";
import { onMounted } from "vue";

let tempLink = []
let nodes = []
let links = []

let id = 0

function buildGraphSpace() {
    // set the dimensions and margins of the graph
    let margin = { top: 10, right: 30, bottom: 30, left: 40 }
        // width = 600 - margin.left - margin.right,
        // height = 600 - margin.top - margin.bottom;
        let width = "1600" 
        let height = "1600"

    let svg = d3.select("#graph-svg")
        // .style("position", "relative")
        // .style("height", height)
        // .style("width", width)
        .style("border", "dashed red");

    let g_links = svg.append("g")
        .attr("id", "g-links");

    let g_nodes = svg.append("g")
        .attr("id", "g-nodes");

    return [g_links, g_nodes]
}

async function saveGraph() {
    if (nodes || links) {
        let body = {
            "task_id": 1,
            "user_id": 1,
            "date": new Date(),
            "data": {
                "id": 1,
                "name": "name1",
                "graph": {},
                "ontology": {},
                "text": {}
            }
        }

        body.data.graph = {
            "nodes": nodes,
            "links": links
        }

        await fetch("http://127.0.0.1:8000/answers/1", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
    }
}

async function loadGraph() {
    let response = await fetch("http://127.0.0.1:8000/answers/1?user_id=1", {
        method: "GET"
    })
    response = await response.json()
    nodes = response.data.graph.nodes
    links = response.data.graph.links
    d3.select("#g-links").remove()
    d3.select("#g-nodes").remove()
    drawGraph()
}

function drawGraph() {
    let [g_links, g_nodes] = buildGraphSpace()

    g_nodes.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("id", d => d.id)
        .attr("cx", d => d.cx)
        .attr("cy", d => d.cy)
        .attr("r", 20)
        .style("fill", "green")
        .on("click", (event) => addLink(event))
        .on("contextmenu", (event) => deleteNode(event))

    id = Math.max(...nodes.map((x) => Number(x.id))) + 1

    links.forEach(function(link) {
        let from = g_nodes.select(`circle[id="${link.from}"]`)
        let to = g_nodes.select(`circle[id="${link.to}"]`)
        
        g_links.append("line")
        .attr("x1", from.attr("cx"))
        .attr("y1", from.attr("cy"))
        .attr("x2", to.attr("cx"))
        .attr("y2", to.attr("cy"))
        .attr("from", from.attr("id"))
        .attr("to", to.attr("id"))
        .style("stroke", "red")
        .style("stroke-width", "3px")
        .on("contextmenu", (event) => deleteLink(event))
    })
    
    g_links.selectAll("circle")
        .data(links)
        .enter()
}

function addNode(event) {
    let svg = d3.select(event.currentTarget)

    let g_nodes = svg.select("#g-nodes")

    let node = g_nodes
        .append("circle")
        .attr("id", id++)
        .attr("cx", event.offsetX)
        .attr("cy", event.offsetY)
        .attr("r", 20)
        .style("fill", "rgb(0, 200, 0)")
        .on("click", (event) => addLink(event))
        .on("contextmenu", (event) => deleteNode(event))

    nodes.push({ id: node.attr("id"), cx: node.attr("cx"), cy: node.attr("cy") })
}

function addLink(event) {
    if (tempLink.length < 2) {
        let target = d3.select(event.currentTarget)
        tempLink.push({ id: target.attr("id"), cx: target.attr('cx'), cy: target.attr('cy') })
    }

    if (tempLink.length == 2) {
        let select1 = d3.select(`line[from="${tempLink[0]["id"]}"][to="${tempLink[1]["id"]}"]`)._groups[0][0]
        let select2 = d3.select(`line[from="${tempLink[1]["id"]}"][to="${tempLink[0]["id"]}"]`)._groups[0][0]

        if ((select1 == null) && (select2 == null)) {
            if (tempLink[0]['cx'] != tempLink[1]['cx'] || tempLink[0]['cy'] != tempLink[1]['cy']) {
                let g_links = d3.select("#g-links")

                let link = g_links
                    .append("line")
                    .attr("x1", tempLink[0]['cx'])
                    .attr("y1", tempLink[0]['cy'])
                    .attr("x2", tempLink[1]['cx'])
                    .attr("y2", tempLink[1]['cy'])
                    .attr("from", tempLink[0]["id"])
                    .attr("to", tempLink[1]["id"])
                    .style("stroke", "rgb(0, 255, 0)")
                    .style("stroke-width", "3px")
                    .on("contextmenu", (event) => deleteLink(event))

                links.push({
                    from: tempLink[0]["id"],
                    to: tempLink[1]["id"]
                })
            }
        }
        tempLink = []
    }
}

function deleteLink(event) {
    d3.select(event.currentTarget).remove()
}

function deleteNode(event) {
    let linksToDelete = links.map(function(x) {
        if (x.from == d3.select(event.currentTarget).attr("id") || x.to == d3.select(event.currentTarget).attr("id")) {
            return x
        }
    })

    links = links.filter((link, i) => linksToDelete.map((x) => x == undefined)[i])

    linksToDelete = linksToDelete.filter(val => { return val != undefined; })

    linksToDelete.forEach(function(link) {
        let linkToDelete = d3.select(`line[from="${link.from}"][to="${link.to}"]`)

        linkToDelete.remove()
    })

    d3.select(event.currentTarget).remove()
}



onMounted(() => { buildGraphSpace() })
</script>

<template>
    <div id="Graph">
    <div>
        <p>Doubleclick to create node</p>
        <p>Click on one node, then on another to create link</p>
        <p>Right click on link to delete</p>
    </div>
    <div id="graph-space">
        <svg id="graph-svg" width="500" height="500" @dblclick="(event) => addNode(event)"></svg>
    </div>
    <div id="buttons">
        <button type="button" @click="saveGraph()">Save Graph</button>
        <button type="button" @click="loadGraph()">Load Graph</button>
    </div>
</div>
</template>
