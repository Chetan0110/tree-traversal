import * as d3 from 'd3';
import * as $ from 'jquery';

import '../css/binaryTree.css'
const VISIT = 'visit';
const SELECT = 'select';
export default function TreeDiagram(chart) {

    // Initialize the variables
    this.init = function (divId, data, selectedType) {
        this.divId = divId;
        this.data = data;
        this.selectedType = selectedType;
    }

    this.drawTreeDiagram = function () {
        var me = this;
        // Empty the div and then proceed to append the svg and all
        // Otherwise multiple svgs will be appended and always first svg will 
        // be visible on the screen resulting in no update in the tree based on selection of
        // various types
        $('#' + me.divId).empty();

        var margin = { top: 100, right: 300, bottom: 100, left: 300 },
            width = window.innerWidth - margin.left - margin.right,
            height = window.innerHeight - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        //Create SVG
        this.svg = d3.select("#" + me.divId)
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)

        var g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // By defaut no type is selected, so no need to display any color coding
        if (this.selectedType.length !== 0) {
            this.svg.append('text')
                .attr('x', 100)
                .attr('y', 70)
                .attr("text-anchor", function (d) {
                    return 'start';
                })
                .text(function (d) {
                    return "V = visited";
                })
                .style('fill', 'green');

            this.svg.append('text')
                .attr('x', 100)
                .attr('y', 100)
                .attr("text-anchor", function (d) {
                    return 'start';
                })
                .text(function (d) {
                    return "S = selected";
                })
                .style('fill', 'red');
        }

        var tree = d3.tree()
            .size([width, height]);

        buildTree(this.data, this.svg, this.selectedType);

        // method decides which kind of animation to show based on selected
        // traversal type
        function buildTree(inData, svg, selectedType) {
            var newsource = { name: inData[0], children: getChildren(0, inData) }
            root = d3.hierarchy(newsource, function (d) { return d.children; });
            root.x0 = 0;
            root.y0 = width / 2;
            var treeData = update(root, svg);

            if (selectedType.length !== 0) {
                switch (selectedType) {
                    case 'preorder':
                        animatePreorder(treeData, svg);
                        break;
                    case 'inorder':
                        animateInorder(treeData, svg);
                        break;
                    case 'postorder':
                        animatePostorder(treeData, svg);
                        break;
                    default:
                        animateBridthFirst(treeData, svg);
                }
            }
        }

        // Takes an index and an array and finds all the children.
        // returns an array which can be added to children of the root node to
        // make a json thing which can be used to make a d3.hierarchy();
        function getChildren(i, arr) {
            var childs = [];
            if (arr[i + 1 + i]) {
                childs[0] = { name: arr[i * 2 + 1], children: [] }
                if (arr[i + i + 2]) {
                    childs[1] = { name: arr[i * 2 + 2], children: [] };
                }
            }
            var nextin = i * 2 + 1;
            if (arr[nextin * 2 + 1]) {
                childs[0].children = getChildren(nextin, arr)
                childs[0]._children = null;
                if (arr[nextin * 2 + 2]) {
                    childs[1].children = getChildren(nextin + 1, arr);
                    childs[1]._children = null;
                }
            }
            return childs;
        }

        /** 
         *This func creates all the nodes and links joining those nodes
         *Based on the root node and children passed to it as an argument called source
         * @param {*} source 
         * @param {*} svg 
         */
        function update(source, svg) {

            let treeData = tree(root)
            let nodes = treeData.descendants();
            let links = treeData.descendants().slice(1);

            // ****************** Nodes section ***************************
            // Update the nodes...
            let node = g.selectAll('g.node')
                .data(nodes, function (d) { return d.id || (d.id = ++i); });

            // Enter any new modes at the parent's previous position.
            let nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr("transform", function (d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                })

            // Add Circle for the nodes
            nodeEnter.append('circle')
                .data(me.data)
                .attr('class', 'node')
                .attr('r', 1e-6)
                .style("fill", (function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                }));

            // Add labels for the nodes
            nodeEnter.append('text')
                .attr("dy", ".35em")
                .attr("x", function (d) {
                    return d.children || d._children ? -23 : 23;
                })
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .attr("text-anchor", function (d) {
                    return 'middle';
                })
                .text(function (d) { return d.data.name; })
                .style('font-size', '20px')
                .style('font-weight', 'bold');

            // UPDATE
            let nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

            // Update the node attributes and style
            nodeUpdate.select('circle.node')
                .attr('r', 10)
                .style("fill", function (d) {
                    return d._children ? "lightsteelblue" : "#fff";
                })
                .attr('cursor', 'pointer');

            // ****************** links section ***************************

            // Update the links...
            let link = g.selectAll('path.link')
                .data(links, function (d) { return d.id; });

            // Enter any new links at the parent's previous position.
            let linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                .attr('d', function (d) {
                    var o = { y: source.y0, x: source.x0 }
                    return diagonal(o, o)

                });

            // UPDATE
            let linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr('d', function (d) { return diagonal(d, d.parent) });

            return treeData;
        }

        // Creates a curved (diagonal) path from parent to the child nodes
        // switched around all the x's and y's from orig so it's verticle
        function diagonal(s, d) {
            let path = `M ${s.x} ${s.y}
          C ${(s.x + d.x) / 2} ${s.y},
            ${(s.x + d.x) / 2} ${d.y},
            ${d.x} ${d.y}`

            return path;
        }

        //Breadth First Animation implementation
        async function animateBridthFirst(root, svg) {
            await sleep(1000);
            drawCircle(root, svg, VISIT);
            if (root.children) {
                await sleep(1000);
                await drawCircle(root, svg, SELECT);
                animateBridthFirst(root.children[0], svg);
                await sleep(1000);
                if (root.children[1])
                    await animateBridthFirst(root.children[1], svg);
            }
            else {
                await drawCircle(root, svg, SELECT);
                await sleep(1000);
            }
        }

        //Pre order Animation implementation
        async function animatePreorder(root, svg) {
            await sleep(1000);
            await drawCircle(root, svg, VISIT);
            if (root.children) {
                await drawCircle(root, svg, SELECT);
                await animatePreorder(root.children[0], svg);
                await sleep(1000);
                if (root.children[1])
                    await animatePreorder(root.children[1], svg);
                await sleep(1000);
            } else {
                await drawCircle(root, svg, SELECT);
            }
        }

        //In order Animation implementation
        async function animateInorder(root, svg) {
            await sleep(1000);
            await drawCircle(root, svg, VISIT);
            if (root.children) {
                await animateInorder(root.children[0], svg);
                await drawCircle(root, svg, SELECT);
                if (root.children[1])
                    await animateInorder(root.children[1], svg);
                await sleep(1000);
            } else {
                await drawCircle(root, svg, SELECT);
            }
        }

        //Post order Animation implementation
        async function animatePostorder(root, svg) {
            await sleep(1000);
            await drawCircle(root, svg, VISIT);
            if (root.children) {
                await animatePostorder(root.children[0], svg);
                await sleep(1000);
                if (root.children[1])
                    await animatePostorder(root.children[1], svg);
                await sleep(1000);
                await drawCircle(root, svg, SELECT);
            } else {
                await drawCircle(root, svg, SELECT);
            }
        }

        // Append the circles and fill the colors
        // Based on passed type
        // Type could be "visit" or "select"
        var xLoc = 800;
        async function drawCircle(root, svg, type) {
            // Add Circle for the nodes
            svg.append('circle')
                .data(me.data)
                .attr('class', 'node')
                .attr("transform", function (d) {
                    return "translate(" + (root.x + 300) + "," + (root.y + 100) + ")";
                })
                .attr('r', 10)
                .attr('stroke', function (d) {
                    return type === 'visit' ? "green" : "red";
                })
                .style("fill", (function (d) {
                    return type === 'visit' ? "green" : "red";
                }));

            xLoc += 30;
            // Add V or S based on node being visited or selected
            // over nodes label
            svg.append('text')
                .attr('x', xLoc)
                .attr('y', 70)
                .attr('text-anchor', function (d) {
                    return 'middle';
                })
                .text(function (d) {
                    return type === 'visit' ? 'V' : 'S';
                })
                .style('fill', function (d) {
                    return type === 'visit' ? 'green' : 'red'
                });

            // Add selected node's label 
            svg.append('text')
                .attr('x', xLoc)
                .attr('y', 100)
                .attr("text-anchor", function (d) {
                    return 'middle';
                })
                .text(function (d) { return root.data.name; })
                .style('fill', function (d) {
                    return type === 'visit' ? 'green' : 'red'
                });

            await sleep(1000);
        }

        // Func which pause the execution by resolving 
        // the dummy Promise after wait of passed miliseconds
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
}
