var VisNetworkModule = function () {

    var run = function (nodes, edges) {
        var container = document.getElementById("mynetwork");

        var transformer = {
            node: function (item, index) {
                // Default for 1 children
                var shape = 'box';
                var label = ' ' + item.label + ' ';
                var toLength = Object.keys(item.to).length;

                if (item.type === 'decision')
                {
                    if (toLength > 2)
                    {
                        shape = 'box';
                    }
                    else if (toLength === 2)
                    {
                        shape = 'box';
                    }
                    else if (toLength === 0)
                    {
                        shape = 'circle';
                        label = ' ' + label + ' ';
                    }
                }

                var node = {
                    id: item.id,
                    title: item.desc && item.desc.replace('\n', "<br>"),
                    label: label,
                    shape: shape,
                }

                console.log(index, item);
                if (index === 0)
                {
                    node.fixed = true;
                    node.physics =  false
                    node.x     = 0;
                    node.y     = 0;
                }

                return node;
            },
            edge: function (item, index) {
                var label = item.label;

                if (item.from.type === 'decision')
                {
                    if (item.value === '0')
                    {
                        label = 'No';
                    }
                    else if (item.value === '1')
                    {
                        label = 'Yes';
                    }
                }

                return {
                    id: item.id,
                    title: item.desc && item.desc.replace('\n', "<br>"),
                    label: label,
                    from: item.from.id,
                    to: item.to.id,
                }
            },
            nodes : function(items)
            {
                var out = [];
                var fn = this.node;

                items.forEach(function (item, index) {
                    if (item.from.id === undefined)
                    {
                        return;
                    }
                    out.push(fn(item, index));
                });
                return out;
            },
            edges : function(items)
            {
                var out = [];
                var fn = this.edge;

                items.forEach(function (item, index) {
                    out.push(fn(item, index));
                });
                return out;
            },
        }

        var data = {
            nodes: new vis.DataSet(transformer.nodes(nodes)),
            edges: new vis.DataSet(transformer.edges(edges))
        };

        var options = {
            manipulation: {
                editEdge: {
                    editWithoutDrag: function(data, callback) {
                        console.info(data);
                        alert("The callback data has been logged to the console.");
                        // you can do something with the data here
                        callback(data);
                    }
                }
            },
            nodes: {
                font : {
                    size : 14,
                    face : 'courier'
                },
                color: {
                    border  : '#aaaaaa',
                    background : '#ffffff',
                    highlight: {
                        border  : '#3e3e3e',
                        background : '#fefefe',
                    },
                },
                scaling: {
                    min: 10,
                    max: 30
                },
                shapeProperties: {
                    borderRadius : 2,
                },
                physics: false,
            },
            edges:{
                arrows: {
                    middle : {
                        enabled : true,
                        type : 'arrow',
                    }
                },
                color: 'red',
                font: {
                    align: 'horizontal',
                    color : '#333333',
                    strokeWidth: 4,
                    strokeColor: "#ffffff",
                    vadjust : 2,
                },
                smooth: false,
                physics: false,
            },
            physics: false,
            layout: {

            }
        };
        var network = new vis.Network(container, data, options);

        return network;
    }

    return {
        run : run
    }
}
