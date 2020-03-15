/**
 * @param config
 * @returns {{transform: (function(): processorVisNetwork), run: run}}
 */
var processorVisNetwork = function () {

    var error = function (msg, data) {
        console.log(data);
        throw new Error('Processing Error, ' + msg);

    }

    var nodes = {
        _ : [],
        validate : function(node, key)
        {
            if ('string' !== typeof node.id)
            {
                error('Node must have string id');
            }
        },
        push : function (node) {
            this.validate(node);

            if (this._.length === 0)
            {
                //node.fixed = {x : true, y : true}
            }

            this._.push(node);
        },
        exists : function (node) {

            this.validate(node, ['id']);

            for (var i = 0; i < this._.length; i++ )
            {
                // Not strict for id as string and int are same
                if (this._[i].id == node.id)
                {
                    return i;
                }
            }
            return -1;
        }
    }

    var edges = {
        _ : [],
        validate : function(edge)
        {
            if ('string' !== typeof edge.id)
            {
                error('Node must have string id', edge);
            }

            // From and to must be there
            if (('string' === typeof edge.from ||
                 'object' === typeof edge.from) === false)
            {
                error('Edge must have valid from: ', edge);
            }
            if (('string' === typeof edge.to ||
                 'object' === typeof edge.to) === false)
            {
                error('Edge must have valid to: ', edge);
            }
        },
        push : function (edge) {
            this.validate(edge);
            this._.push(edge);
        },
        exists : function (edge) {
            this.validate(edge);
            for (var i = 0; i < this._.length; i++ )
            {
                // Not strict for id as string and int are same
                if (this._[i].id == edge.id)
                {
                    return i;
                }
            }
            return -1;
        }
    }

    var drafts = {
        nodes : function (id, _) {
            var label = _.label || ('' + id);

            var draft = {
                id : id,
                label : '  ' + label + '  ',
                title : _.desc && _.desc.replace('\n', "<br>"),
                shape: 'circle',
            };

            switch (_.type) {
                case 'decision':
                    draft.shape = 'box'
                    break;
                case 'terminal':
                    draft.shape = 'ellipse'
            }

            return draft;
        },
        edge : function (id, _) {
            var label = _.label || ('' + id);

            var draft = {
                id : 'edge' + id,
                label : label,
                from : _.from,
                to : _.to,
                title : _.desc && _.desc.replace('\n', "<br>"),
            };

            return draft;
        }
    }

    return {
        transform : function (config) {

            $.each(config.nodes, function (id, _)
            {
                nodes.push(drafts.nodes(id, _));
            });

            $.each(config.edges, function (id, _)
            {
                var draft = drafts.edge(id, _);
                var node;
                var value;
                var index;

                edges.validate(draft);

                // Check and create nodes if needed
                for (var i in {from:1, to:1})
                {
                    index = -1;
                    value = {};
                    node = draft[i];

                    // Means that node is an id to a node
                    if ('string' === typeof node)
                    {
                        // If exists pick that one
                        index = nodes.exists({id : node})
                        if (index > -1)
                        {
                            value = nodes._[index];
                        }
                        // Else create a new draft
                        else
                        {
                            value = drafts.nodes(node, {})
                        }
                    }
                    // Means node is an object
                    else if ('object' === typeof node)
                    {
                        // If there is no id in node, create a new node
                        if (! node.id)
                        {
                            node.id = (i + 'for' + draft.id);
                        }

                        // If the node.id exists, it will point to that node
                        // Else it will create a new mode, and point to it
                        value = drafts.nodes(node.id, node);
                    }
                    else
                    {
                        error(i + 'needs to be sting or object', draft);
                    }

                    nodes.validate(value)

                    if (nodes.exists(value) === -1)
                    {
                        nodes.push(value);
                    }

                    draft[i] = value.id;
                }

                edges.push(draft)
            });

            return this;
        },

        run : function () {
            var container = document.getElementById("mynetwork");

            console.log(nodes._, edges._);
            var data = {
                nodes: new vis.DataSet(nodes._),
                edges: new vis.DataSet(edges._)
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
                edges:{
                    arrows: {
                        to : {
                            enabled : true,
                            type : 'circle',
                        }
                    },
                    color: 'red',
                    font: {
                        align: 'middle',
                        color : '#333333',
                        strokeWidth: 4,
                        strokeColor: "#ffffff"
                    },
                    scaling:{
                        label: true,
                    },
                    smooth: true,
                },
                physics: true,
            };
            var network = new vis.Network(container, data, options);

            return network;
        }
    }
}
