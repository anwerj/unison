var VisNetworkTransformer = function (nodes, edges) {

    var converter = new showdown.Converter({
        simpleLineBreaks: true
    });

    var getSvgDesignOne = function (item, icon, header, body) {

        var svg = '<svg id="svg-' + item.id +'" width="300" height="70" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="0" y="0" width="300" height="70" style="fill:white;opacity:1" />' +
            '<svg width="30" height="30" x="5" y="5" viewBox="'+ icon.viewBox +'" ><path style="fill: #fa8f90" d="'+ icon.pathD +'"></path></svg>' +
            '<text style="fill: #fa8f90" font-size="20" font-family="Verdana" x="60" y="30">' + header + '</text>' +
            (body ? '<text fill="rgb(0,0,0,0.8)" font-size="14" font-family="Verdana" x="6" y="56">' + body + '</text>' : '') +
            '</svg>';

        return svg;
    };

    var getSvgDesignTwo = function (item, icon, header, body) {

        var svg = '<svg id="svg-'+item.id+'" width="300" height="72" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="1" y="25" width="298" height="40" rx="8" ry="8" style="opacity:1;fill: white;stroke:#fa8f90;stroke-width: 2"></rect>' +
            '<text fill="#fa8f90" font-size="13" font-family="monospace" x="10" y="54">'+body+'</text>' +
            '<rect x="0" y="0" width="300" height="40" rx="8" ry="8" style="fill:#fa8f90;opacity:1;"></rect>' +
            '<svg width="26" height="26" x="6" y="6" viewBox="'+icon.viewBox+'">' +
            '   <path style="fill: white" d="'+icon.pathD+'"></path>' +
            '</svg>' +
            '<text style="fill: white" font-size="16" font-family="monospace" x="40" y="25">'+header+'</text>' +
            '<rect x="2" y="37" width="296" height="6"  style="opacity:1;fill: white;"></rect>' +
            '</svg>'

        return svg;
    };

    var getSvgDesignThree = function (id, icon, header, body) {

        var bodyText = '';
        var textCount = 0;
        var headerTop = 22;
        var headerLeft = 5;
        var headerBack = true;
        var width = 0;
        var bodyColor = '#000000';
        var height = 48;

        if (! body)
        {
            body = header;
            header = '';
            bodyColor = '#fa8f90';
            headerBack = false;
            headerLeft = 0;
        }

        if (header)
        {
            width = (header.length * 10);
        }

        var tempDivId = 'temp-div-for-node-' + id;

        $('#node-container').append('<div id="' + tempDivId + '" style="font-size: 16px; font-family:Verdana;display: inline-block;" xmlns="http://www.w3.org/1999/xhtml">'+converter.makeHtml(body)+'</div>')

        width = Math.max($('#'+tempDivId).width() + 20, width);
        height = Math.max($('#'+tempDivId).height(), height);

        bodyText = '<foreignObject x="60" y="25" width="'+width+'" height="'+height+'">' +
            '<div style="font-size: 16px; font-family:Verdana;color: '+bodyColor+'" xmlns="http://www.w3.org/1999/xhtml">'+converter.makeHtml(body)+'</div>' +
            '</foreignObject>';

        //$('#'+tempDivId).remove();

        var svg = '<svg id="svg-'+id+'" width="'+(width+50)+'" height="'+(height+30+4)+'"  xmlns="http://www.w3.org/2000/svg">' +
            (headerBack && '<rect x="0" y="0" width="'+(width+50)+'" height="30" style="fill:#ffffff;opacity:0.8;"></rect>') +
            '<rect x="0" y="30" width="'+(width+50)+'" height="'+(height+2)+'" style="fill:#f6f6f6;opacity:1;"></rect>' +
            '<rect x="0" y="30" width="50" height="'+(height +2)+'" style="fill:#fa8f90;opacity:1;"></rect>' +
            '<svg fill="#fa8f90" width="35" height="'+height+'" x="8" y="30" viewBox="'+icon.viewBox+'">' +
            '<path style="fill:#ffffff;" d="'+icon.pathD+'"></path>' +
            '</svg>' +
            '<text style="fill:#fa8f90;text-align: center;align-content: center" font-size="16" font-family="monospace" x="'+headerLeft+'" y="'+headerTop+'">'+header+'</text>' +
            bodyText +
            '</svg>';

        return svg;
    };

    var toNode = function (item, index) {
        // Default for 1 children
        var shape = 'box';
        var toLength = item.target.all().length;
        var headerIcon  = item.icon     || ((item.ref && item.ref.icon) || 'dice-d6');
        var headerLabel = item.label    || ((item.ref && item.ref.label) || '');
        var bodyLabel   = item.content  || '';

        if (item.target.anomaly('target:' + item.id))
        {
            bodyLabel += ' | t:' + item.target.anomaly();
        }
        if (item.source.anomaly('source:' + item.id))
        {
            bodyLabel += ' | s:' + item.source.anomaly();
        }

        var symbol = document.getElementById('sprites-solid').contentDocument.getElementById(headerIcon);

        if (!symbol)
        {
            symbol = document.getElementById('sprites-solid').contentDocument.getElementById('dice-d6');
        }

        var icon = {
            viewBox : symbol.getAttribute('viewBox'),
            pathD   : symbol.getElementsByTagName('path')[0].getAttribute('d'),
        };

        var svg = getSvgDesignThree(item.id, icon, headerLabel, bodyLabel);

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

                if (item.hidden)
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
