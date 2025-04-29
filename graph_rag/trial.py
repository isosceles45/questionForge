from nano_graphrag import GraphRAG, QueryParam
import os

graph_func = GraphRAG(working_dir="./Graph")

print(os.getcwd())  # Check the current working directory

# with open(os.path.abspath("Output/Processed/RL_syllabus.txt")) as f:
#     graph_func.insert(f.read())

# with open(os.path.abspath("Output/Processed/P1_pyq.txt")) as f:
#     graph_func.insert(f.read())

# with open(os.path.abspath("Output/Processed/P2_pyq.txt")) as f:
#     graph_func.insert(f.read())

# Perform global graphrag search
print(graph_func.query("Create a 60 Marks Question Paper using your knowledge of RL and PYQs"))

# Perform local graphrag search 
print(graph_func.query("Is this question present in PYQs? if yes, when? Question: 'Explore Upper-Confidence-Bound (UCB) Action Selection in multi-armed bandits. Analyze UCB's formula and address potential application challenges.'", param=QueryParam(mode="local")))