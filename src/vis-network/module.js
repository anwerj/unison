var VisNetworkModule = function () {

    var run = function (nodes, edges) {
        var container = document.getElementById("mynetwork");

        var transformer = new VisNetworkTransformer(nodes, edges);

        var data = {
            nodes: new vis.DataSet(transformer.nodes()),
            edges: new vis.DataSet(transformer.edges())
        };

        var options = {
            manipulation: {
                enabled : true,
                editEdge: {
                    editWithoutDrag: function(data, callback) {
                        console.info(data);
                        // you can do something with the data here
                        callback(data);
                    }
                },
                editNode: function(data, callback) {
                    console.info(data);
                    // you can do something with the data here
                    callback(data);
                }
            },
            nodes: {
                font : {
                    size : 14,
                    face : 'courier',
                    multi : 'md',
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
                hierarchical: {
                    enabled: true,
                    levelSeparation : -100,
                    nodeSpacing : 600,
                    treeSpacing : 200,
                    blockShifting: true,
                    edgeMinimization : true,
                    parentCentralization : true,
                    direction: 'UD',
                    sortMethod: 'directed',
                    shakeTowards: 'roots'
                }
            }
        };
        var network = new vis.Network(container, data, options);

        return network;
    }

    return {
        run : run
    }
}
