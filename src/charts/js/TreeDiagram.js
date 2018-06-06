import * as d3 from 'd3';
import * as $ from 'jquery';

import '../css/binaryTree.css'

export default function TreeDiagram(chart) {
    chart.drawTreeDiagram = function () {
        var me = this;
        $('#' + me.divId).empty();
        me.currType = 0;
        // chart.initSVG();
        // chart.svg.attr('height', this.VisHeight); //.attr('width',this);

        var margin = { top: 50, right: 300, bottom: 50, left: 300 },
            width = window.innerWidth - margin.left - margin.right,
            height = window.innerHeight - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        var svg = d3.select("#" + me.divId)
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)


        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var tree = d3.tree()
            .size([width, height]);


        function buildHeap(inData) {

            var newsource = { name: inData[0], children: getChildren(0, inData) }
            //   console.log('dl', newsource)

            root = d3.hierarchy(newsource, function (d) { return d.children; });

            root.x0 = 0;
            root.y0 = width / 2;

            update(root)
        }


        // just leaving this global so i can mess with it in the console
        var nodes;
        me.nodes = nodes;
        function update(source) {
            //  root = d3.hierarchy(newsource, function(d) { return d.children; });

            var treeData = tree(root)
            nodes = treeData.descendants();
            var links = treeData.descendants().slice(1);

            // ****************** Nodes section ***************************
            // Update the nodes...
            var node = g.selectAll('g.node')
                .data(nodes, function (d) { return d.id || (d.id = ++i); });

            // Enter any new modes at the parent's previous position.
            var nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr("transform", function (d) {
                    return "translate(" + source.x0 + "," + source.y0 + ")";
                })
                .on('click', click);

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
                // .attr("dy", ".35em")
                // .attr("x", function (d) {
                //     return d.children || d._children ? -13 : 13;
                // })
                .attr("text-anchor", function (d) {
                    // return d.children || d._children ? "end" : "start";
                    return 'middle';
                })
                .text(function (d) { return d.data.name; });


            nodeEnter.append('text')
                .transition()
                .duration(5000)
                .attr("dy", ".35em")
                .attr("x", function (d) {
                    return d.children || d._children ? -13 : 13;
                })
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function (d) {
                    // setTimeout(function (d) {
                    let index = me.data.indexOf(d.data.name);
                    return ++index;
                    // }, 3000)
                });

            var groups = svg.selectAll("groups")
                .data(me.updatedTraversal)
                .enter()
                .append("g")
                .attr("transform", (d, i) => "translate(" + (width / 2) + "," + (height / 2) + ")");

            groups.selectAll("texts")
                .data(me.updatedTraversal)
                .enter()
                .append("text")
                .attr("x", (d, i) => 30 * i + 600)
                .attr("y", 0)
                .text(d => d + ',');

            // UPDATE
            var nodeUpdate = nodeEnter.merge(node);

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


            // Remove any exiting nodes
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.x + "," + source.y + ")";
                })
                .remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            // Update the links...
            var link = g.selectAll('path.link')
                .data(links, function (d) { return d.id; });

            // Enter any new links at the parent's previous position.
            var linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                .attr('d', function (d) {
                    var o = { y: source.y0, x: source.x0 }
                    return diagonal(o, o)

                });

            // UPDATE
            var linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr('d', function (d) { return diagonal(d, d.parent) });

            // Remove any exiting links
            link.exit().transition()
                .duration(duration)
                .attr('d', function (d) {
                    var o = { x: source.x, y: source.y }
                    return diagonal(o, o)
                })
                .remove();

            // Store the old positions for transition.
            nodes.forEach(function (d, i) {
                //   console.log(d)
                d.x0 = d.x;
                d.y0 = d.y;
            });

            me.nodes = nodes;
        }

        // Takes an index and an array and finds all the children.
        // returns an array which can be added to children of the root node to
        // make a json thing which can be used to make a d3.hierarchy();
        function getChildren(i, arr) {
            var childs = [];

            if (arr[i + 1 + i]) {
                childs[0] = { name: arr[i * 2 + 1], children: [] }
                if (arr[i + i + 2]) {
                    //  console.log(arr[i+1+ i], arr[i+i+2])
                    childs[1] = { name: arr[i * 2 + 2], children: [] };
                }
            }

            var nextin = i * 2 + 1;
            if (arr[nextin * 2 + 1]) {
                //  console.log('more children')
                childs[0].children = getChildren(nextin, arr)
                childs[0]._children = null;

                if (arr[nextin * 2 + 2]) {
                    childs[1].children = getChildren(nextin + 1, arr);
                    childs[1]._children = null;
                }
            }
            return childs;
        }


        // not called but kind of what I might use to annimate the swap thing while
        // balancing binary heaps
        function expandChildren(index, chi) {
            setTimeout(function () {
                if (nodes[index].children === null) {
                    nodes[0].children = [nodes[0]._children[chi]]
                }
                else {
                    console.log(typeof nodes[0].children)
                    nodes[index].children.push(nodes[index]._children[1])
                }
                update(nodes[index])
                if (chi < 1) {
                    expandChildren(0, 1)
                }
            }, 3000);

        }

        // Creates a curved (diagonal) path from parent to the child nodes
        // switched around all the x's and y's from orig so it's verticle
        function diagonal(s, d) {
            //console.log('in diag and s = ', s);
            //console.log('d = ', d)

            let path = `M ${s.x} ${s.y}
          C ${(s.x + d.x) / 2} ${s.y},
            ${(s.x + d.x) / 2} ${d.y},
            ${d.x} ${d.y}`

            return path;

        }


        // Toggle children on click.
        function click(d) {
            // use the following to superficially change the text of the node.
            //  this.getElementsByTagName('text')[0].textContent = "clicked all over"

            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }

            update(d);
        }

        // will make all the children null and store the real vals in _children
        function collapse(d) {
            if (d.children) {
                d._children = d.children
                d.children = null;
                d._children.forEach(collapse)

            }
        }


        buildHeap(this.data);

        // let types = ['Breadth First', 'Pre Order', 'In Order', 'Post Order'];
        // $('#' + this.divId).prepend('<form id="binaryTreeControls_' + this.divId + '" style="padding-left: 5px;"></form>');
        // for (let i = 0; i < types.length; i++) {
        //     $('#binaryTreeControls_' + this.divId).append(
        //         '<label style="margin: 5px;"><input type="radio" name="dataset" id="dataset' +
        //         this.divId +
        //         i +
        //         '" value="' +
        //         i +
        //         '">  ' +
        //         types[i] +
        //         ' </label>'
        //     );
        // }
        // // Select first pie by default
        // d3.select('input[id="dataset' + this.divId + me.currType + '"]').property('checked', true);

        // // On change of input change the pie
        // d3.selectAll('#binaryTreeControls_' + this.divId + ' input').on('change', selectDataset);

        // function selectDataset() {
        //     var value = this.value;
        //     // change(pie_data[value]);
        //     me.currType = value;
        //     me.drawVisualizationBinaryTree();
        // }


    }
}
