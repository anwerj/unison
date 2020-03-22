var VisNetworkTransformer = function (nodes, edges) {

    var toNode = function (item, index) {
        // Default for 1 children
        var shape = 'box';
        var toLength = item.target.all().length;
        var headerIcon = (item.ref && item.ref.icon) ? item.ref.icon : (item.icon || 'bell');
        var headerLabel = (item.ref && item.ref.label) ? item.ref.label : item.label;
        var bodyLabel = (item.ref && item.ref.label) ? item.label : null;

        if (item.target.anomaly('target:' + item.id))
        {
            bodyLabel += ' | t:' + item.target.anomaly();
        }
        if (item.source.anomaly('source:' + item.id))
        {
            bodyLabel += ' | s:' + item.source.anomaly();
        }

        var symbol = document.getElementById('sprites-solid').contentDocument.getElementById('cube');

        if (!symbol)
        {
            console.log(symbol, headerIcon);
        }
        else
        {
            var viewBox = symbol.getAttribute('viewBox');
            var pathD   = symbol.getElementsByTagName('path')[0].getAttribute('d');
        }

        var svg = '<svg id="svg-' + item.id +'" width="300" height="70" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="0" y="0" width="300" height="70" style="fill:white;opacity:1" />' +
            '<svg width="30" height="30" x="5" y="5" viewBox="'+ viewBox +'" ><path style="fill: #fa8f90" d="'+ pathD +'"></path></svg>' +
            '<text style="fill: #fa8f90" font-size="20" font-family="Verdana" x="60" y="30">' + headerLabel + '</text>' +
            (bodyLabel ? '<text fill="rgb(0,0,0,0.8)" font-size="14" font-family="Verdana" x="6" y="56">' + bodyLabel + '</text>' : '') +
            '</svg>';

        $('#node-container').append(svg);

        var img = window.btoa((new XMLSerializer().serializeToString(document.getElementById('svg-' + item.id))));

        console.debug(svg, img);
        var node = {
            id: item.id,
            title: item.desc && item.desc.replace('\n', "<br>"),
            shape: 'image',
            image: 'data:image/svg+xml;base64,' + img,
        };

        if (index === 0)
        {
            node.fixed = true;
            node.physics =  false;
            node.x     = 0;
            node.y     = 0;
        }

        return node;
    };

    var toEdge = function (item, index) {
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
    };

    return {

        nodes : function()
        {
            var out = [];

            nodes.forEach(function (item, index) {
                if ((item.source.length() === 0) && (item.target.length() === 0))
                {
                    return;
                }
                out.push(toNode(item, index));
            });
            return out;
        },
        edges : function()
        {
            var out = [];

            edges.forEach(function (item, index) {
                out.push(toEdge(item, index));
            });
            return out;
        },
    }
}
