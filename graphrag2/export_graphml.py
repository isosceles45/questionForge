from nano_graphrag import GraphRAG
import networkx as nx

class GraphMLExporter:
    def __init__(self, graph_func):
        self.graph_func = graph_func
        self.G = nx.DiGraph()  # Create a directed graph
    
    def process_document(self, file_path):
        """Process a document and add its content to the graph"""
        with open(file_path) as f:
            # Insert into GraphRAG but don't worry about Neo4j errors
            try:
                self.graph_func.insert(f.read())
            except Exception as e:
                print(f"Warning: Error while processing {file_path}, but continuing: {str(e)}")
    
    def extract_graph_data(self):
        """Extract entities and relationships from GraphRAG's internal structures"""
        # This is a simplified approach - you'll need to access your graph_func's internal data
        # The actual implementation depends on how GraphRAG stores entities and relationships
        entities = []
        relationships = []
        
        # TODO: Access entities and relationships from graph_func
        # This might require modifying GraphRAG to expose this data
        
        return entities, relationships
    
    def build_networkx_graph(self, entities, relationships):
        """Build a NetworkX graph from entities and relationships"""
        # Add nodes with all attributes
        for entity in entities:
            node_id = entity.get('id')
            self.G.add_node(node_id, **{k: v for k, v in entity.items() if k != 'id'})
        
        # Add edges with all attributes
        for rel in relationships:
            source = rel.get('source')
            target = rel.get('target')
            if source and target:
                self.G.add_edge(source, target, **{k: v for k, v in rel.items() 
                                              if k not in ['source', 'target']})
    
    def export_graphml(self, output_path):
        """Export the NetworkX graph to GraphML format"""
        entities, relationships = self.extract_graph_data()
        self.build_networkx_graph(entities, relationships)
        nx.write_graphml(self.G, output_path)
        print(f"GraphML file created at: {output_path}")
        return output_path 