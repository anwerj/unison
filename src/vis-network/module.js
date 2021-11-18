var VisNetworkModule = function (config) {

    var def = {
      interaction: {
        zoomView: true,
        keyboard: {
          enabled: true,
          speed: { x: 10, y: 10, zoom: 0.02 },
          bindToWindow: false,
        },
        navigationButtons: true,
      },
      physics: {
        hierarchicalRepulsion: {
          avoidOverlap: 1,
        },
      },
      manipulation: {
        enabled: false,
      },
      nodes: {
        font: {
          size: 14,
          face: "courier",
        },
        shapeProperties: {
          borderRadius: 12,
          useImageSize: true,
          useBorderWithImage: false,
        },
        physics: false,
        color: {
          highlight: {
            background: "#ffffff",
          },
        },
        chosen: {
          node: function (values, id, selected, hovering) {
            console.log(values, id, selected, hovering);
            values.shadow = true;
            values.shadowColor = "rgba(0,0,0,0.1)";
          },
        },
      },
      edges: {
        arrows: {
          to: {
            enabled: true,
            type: "arrow",
          },
        },
        color: "#6a6a6a",
        font: {
          align: "horizontal",
          color: "#333333",
          strokeWidth: 4,
          strokeColor: "#ffffff",
          vadjust: 2,
        },
        smooth: false,
        physics: false,
      },
      layout: {
        hierarchical: {
          enabled: true,
          levelSeparation: 150,
          nodeSpacing: 500,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: false,
          parentCentralization: true,
          direction: "UD",
          sortMethod: "hubsize",
          shakeTowards: "roots",
        },
      },
    };

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
