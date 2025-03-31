from neo4j import GraphDatabase
import networkx as nx

# Neo4j connection details
neo4j_config = {
    "neo4j_url": "neo4j+s://2d7944e8.databases.neo4j.io",
    "neo4j_auth": (
        "neo4j",
        "N40YC9CjGbA7b2ijEvEDHVau5E2rWIDtfzKl-tgw1TU"
    )
}

# Path to GraphML file
graphml_path = "./question_paper_graph.graphml"

# Load GraphML file into NetworkX
G = nx.read_graphml(graphml_path)

# Connect to Neo4j
driver = GraphDatabase.driver(
    neo4j_config["neo4j_url"], 
    auth=neo4j_config["neo4j_auth"]
)

# Helper function to convert node attributes to Cypher parameters
def clean_attributes(attrs):
    return {k: v for k, v in attrs.items() if v is not None}

# Import nodes
with driver.session() as session:
    # Clear existing data (optional)
    session.run("MATCH (n) DETACH DELETE n")
    
    # Create constraint for IDs (optional)
    session.run("CREATE CONSTRAINT IF NOT EXISTS FOR (n:Entity) REQUIRE n.id IS UNIQUE")
    
    # Import nodes
    print("Importing nodes...")
    for node_id in G.nodes():
        node_attrs = clean_attributes(G.nodes[node_id])
        entity_type = node_attrs.get('entity_type', 'Entity')
        
        # Create node with all its properties
        session.run(
            f"CREATE (n:{entity_type} {{id: $id}}) SET n += $attrs",
            id=node_id,
            attrs=node_attrs
        )
    
    # Import relationships
    print("Importing relationships...")
    for source, target, attrs in G.edges(data=True):
        edge_attrs = clean_attributes(attrs)
        relationship_type = edge_attrs.get('type', 'RELATED_TO')
        
        # Create relationship with all its properties
        session.run(
            f"MATCH (a {{id: $source}}), (b {{id: $target}}) "
            f"CREATE (a)-[r:{relationship_type}]->(b) SET r += $attrs",
            source=source,
            target=target,
            attrs=edge_attrs
        )
    
    print("Import completed!")

driver.close() 