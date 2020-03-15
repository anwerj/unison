var VisNetworkTransformer = function (nodes, edges) {

    var toNode = function (item, index) {
        // Default for 1 children
        var shape = 'box';
        var label = ' ' + item.label + ' ';
        var toLength = item.target.all().length;

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

        if (item.ref && item.ref.label)
        {
            label = item.ref.label + ' |     ' + label
        }

        if (item.target.anomaly('target:' + item.id))
        {
            label += ' | t:' + item.target.anomaly();
        }
        if (item.source.anomaly('source:' + item.id))
        {
            label += ' | s:' + item.source.anomaly();
        }

        var node = {
            id: item.id,
            title: item.desc && item.desc.replace('\n', "<br>"),
            label: label,
            shape: shape,
        }

        if (index === 0)
        {
            node.fixed = true;
            node.physics =  false
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
