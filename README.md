# unison

### Nodes
Nodes are the participants for unison

node.id = Unique Identifier for a node   
node.label = Display text for a node   
node.icon.type = Type for a node icon default,fontawesome    
node.icon.path = for fontawesome shoudl the id

### Edges
Nodes talks to each other via a vertice.   
edge.id = Unique Identifier for the edge   
edge.label = Display text for a edge    
edge.from.id = node.id of the from   
edge.from.* = Overide the properties of from node    
edge.to.id = node.id of the to    
edge.to.* = Overide the properties of from node

### Options
Options for the flow unison, options can be overridden by format options

### Format
Options to override the basic flow for VisJs, D3js or Sequence Diagram.     
visjs = VisJs options       
d3js = D3js options     
sequence = Sequence diagram options     
