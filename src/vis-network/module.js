var VisNetworkModule = function (config) {

    var def = {
        physics: false,
        manipulation: {
            enabled : true,
        },
        nodes : {
            font : {
                size : 14,
                face : 'courier'
            },
            shapeProperties: {
                borderRadius : 2,
                useImageSize : true,
                useBorderWithImage : true,
            },
            physics: false,
            borderWidth: 1,
            imagePadding: { left: 2, top: 2, right: 2, bottom: 2},
            color: {
                border: "rgba(0,0,0,0.1)",
                background: "white",
                highlight: {
                    border: "black",
                    background: "white"
                },
                hover: {
                    border: "orange",
                    background: "grey"
                }
            },
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
        layout: {
            hierarchical: {
                enabled: true,
                levelSeparation : 150,
                nodeSpacing : 800,
                treeSpacing : 200,
                blockShifting: true,
                edgeMinimization : true,
                parentCentralization : true,
                direction: 'UD',
                sortMethod: 'directed',
                shakeTowards: 'roots'
            }
        }
    }

    var options = $.extend(true, {}, def, (config.vis || {}))

    var run = function (nodes, edges) {
        var container = document.getElementById("mynetwork");

        var transformer = new VisNetworkTransformer(nodes, edges);

        var data = {
            nodes: new vis.DataSet(transformer.nodes()),
            edges: new vis.DataSet(transformer.edges())
        };

        var network = new vis.Network(container, data, options);

        console.debug('VisOptions', options, def, config.vis);
        return network;
    }

    return {
        run : run
    }
}
