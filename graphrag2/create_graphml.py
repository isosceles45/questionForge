from nano_graphrag import GraphRAG
from export_graphml import GraphMLExporter

# Initialize GraphRAG without Neo4j connection
graph_func = GraphRAG(working_dir="./educational_graph")

# Create GraphML exporter
exporter = GraphMLExporter(graph_func)

# Process your documents
syllabus_path = "/Users/atharvanawadkar/Documents/Cursor/Projects/Major Project sem8/questionForge/stock-graph/Output/Processed/RL_syllabus.txt"
pyq_paths = [
    "/Users/atharvanawadkar/Documents/Cursor/Projects/Major Project sem8/questionForge/stock-graph/Output/Processed/SEM 8 PYQ P1_pyq.txt",
    "/Users/atharvanawadkar/Documents/Cursor/Projects/Major Project sem8/questionForge/stock-graph/Output/Processed/SEM 8 PYQ P2_pyq.txt"
]

exporter.process_document(syllabus_path)
for pyq_path in pyq_paths:
    exporter.process_document(pyq_path)

# Export to GraphML
graphml_path = "./question_paper_graph.graphml"
exporter.export_graphml(graphml_path) 