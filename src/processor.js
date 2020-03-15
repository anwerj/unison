/**
 *
 * @param module
 * @returns {{load: (function(*): processorVisNetwork)}}
 */
var Processor = function (module) {

    var nodes = {
        _ : [],
        validate : function(node, key)
        {
            if ('string' !== typeof node.id)
            {
                error('Node must have string id');
            }
        },
        push : function (node, ) {
            this.validate(node);
            if (this.exists(node) === -1)
            {
                this._.push(node);
            }
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
            if ('number' !== typeof edge.id)
            {
                error('Edge must have integer id', edge);
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
        push : function (edge)
        {
            this.validate(edge);
            this._.push(edge);
        },
        exists : function (edge)
        {
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
        node : function (i, d) {

            console.log(i, d);
            var draft = {
                _       : 'node',
                id      : i.id,
                label   : (i.label  || d.label) || i.id,
                desc    : i.desc    || d.desc,
                type    : i.type    || d.type,
                to      : {},
                from    : {},
            };

            return draft;
        },
        edge : function (i, d) {

            console.log(i, d);
            var draft = {
                _       : 'edge',
                id      : i.id,
                to      : i.to      || {},
                from    : i.from    || {},
                label   : (i.label  || d.label) || i.id,
                desc    : i.desc    || d.desc,
                type    : i.type    || d.type,
                value   : (i.value === undefined) ? null : (new String(i.value)).toString(),
            };

            return draft;
        }
    }

    var error = function (msg, data) {
        console.log(data, nodes._, edges._);
        throw new Error('Processing Error, ' + msg);
    }

    return {

        load : function (config) {

            $.each(config.nodes, function (id, _)
            {
                _.id = id;

                nodes.push(drafts.node(_, {}));
            });

            config.edges.forEach(function (_, id)
            {
                _.id = id;

                var node;
                var to;
                var from;
                var index;
                var value;
                var draft = drafts.edge(_, {});

                edges.validate(draft);

                // Means that to is an id to a node
                if ('string' === typeof draft.to)
                {
                    // If exists pick that one
                    index = nodes.exists({id : draft.to})
                    if (index > -1)
                    {
                        to = nodes._[index];
                    }
                    // Else create a new draft
                    else
                    {
                        to = drafts.node({id : draft.to}, {})
                    }
                }
                // Means node is an object
                else if ('object' === typeof draft.to)
                {
                    // Check if id is missing in overridden node
                    if ('string' !== typeof draft.to.id)
                    {
                        draft.to.id = '_node_from_' + id;
                    }

                    if (nodes.exists({id : draft.to.id}) > -1)
                    {
                        error('Can not create edge.to with duplicate id', draft);
                    }

                    // If there is no id in node, create a new node
                    if ('string' === typeof draft.to.$ref)
                    {
                        // If draft.to.node is string it must exists already
                        index = nodes.exists({id : draft.to.$ref});
                        if (index < 0)
                        {
                            error('to.$ref must be already defined', draft);
                        }

                        to = drafts.node(draft.to, nodes._[index]);
                    }
                    // There is no reference in draft.to
                    else
                    {
                        to = drafts.node(draft.to, {})
                    }
                }
                else
                {
                    error('edge.to needs to be sting or object', draft);
                }

                // Means that from is an id from a node
                if ('object' === typeof draft.from)
                {
                    if (draft.id === 0)
                    {
                      error('First edge must have from defined');
                    }
                    var prevEdge = edges._[draft.id - 1];

                    // Considering this is not a choice
                    if (draft.value === null)
                    {
                      from = prevEdge.to;
                    }
                    // Now the edge is actually a choice
                    // And we will try to find the right question
                    else
                    {
                        // Dark times requires dark measures
                        while (true)
                        {
                            // We have found fist decision by traversing back
                            if (prevEdge.to.type === 'decision')
                            {
                                from = prevEdge.to;

                                break;
                            }

                            prevEdge = prevEdge.from && prevEdge.from.from;

                            // Meaning we have found another previous edge
                            if ('number' === typeof prevEdge.id)
                            {
                                continue;
                            }

                            // We could not found any decision in the tree
                            // Thus attaching it back root node is one option
                            from = prevEdge.to;
                            break;
                        }
                    }
                }
                else if ('string' === typeof draft.from)
                {
                    // If exists pick that one
                    index = nodes.exists({id : draft.from})
                    if (index > -1)
                    {
                        from = nodes._[index];
                    }
                    // Else create a new draft
                    else
                    {
                        error('edge.from does not exists');
                        //from = drafts.node({id : draft.from}, {})
                    }
                }
                // Means node is an object
                // else if ('object' === typeof draft.from)
                // {
                //     // Check if id is missing in overridden node
                //     if ('string' !== typeof draft.from.id)
                //     {
                //         draft.from.id = '_node_from_' + id;
                //     }
                //
                //     if (nodes.exists({id : draft.from.id}))
                //     {
                //         error('Can not create edge.from with duplicate id', draft);
                //     }
                //
                //     // If there is no id in node, create a new node
                //     if ('string' === typeof draft.from.$ref)
                //     {
                //         // If draft.from.node is string it must exists already
                //         index = nodes.exists({id : draft.from.$ref});
                //         if (index < 0)
                //         {
                //             error('from.$ref must be already defined', draft);
                //         }
                //
                //         from = drafts.node(draft.from, nodes._[draft.from.$ref]);
                //     }
                //     // There is no reference in draft.from
                //     else
                //     {
                //         from = drafts.node(draft.from, {})
                //     }
                // }
                else
                {
                    error('edge.from needs from be sting or object', draft);
                }

                draft.from = from;
                draft.to = to;

                // At this point we have all ids defined
                // edge.id, edge.from.id and edge.to.id

                edges.push(draft);

                // Set Edge as node.from to edge.to
                draft.to.from = draft;
                nodes.push(draft.to);

                // Set Edge as node.to to edge.from

                console.log(draft.from);
                draft.from.to[(new String(draft.value || draft.id)).toString()] = draft;
                nodes.push(draft.from);

            });

            console.log(nodes._, edges._);

            return this;
        },

        run : function () {
            module.run(nodes._, edges._);
        }
    }
}
