from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from collections import defaultdict, deque

app = FastAPI()

# Allow the React dev server to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# Strict-but-minimal request schema. React Flow sends many extra fields
# (position, data, width, etc.) — Pydantic ignores them by default.
class Node(BaseModel):
    id: str


class Edge(BaseModel):
    source: str
    target: str


class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph formed by nodes + edges is a directed acyclic graph
    using Kahn's algorithm.

    The idea:
    1. Build an adjacency list and compute in-degree of every node.
    2. Repeatedly remove a node with in-degree 0, decrementing in-degrees
       of its neighbors. Track how many nodes we've successfully removed.
    3. If we removed all nodes, the graph is a DAG. If we got stuck before
       finishing, the remaining nodes are in a cycle.
    """
    node_ids = {node.id for node in nodes}
    adjacency = defaultdict(list)
    in_degree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        # Skip edges referencing unknown nodes — defensive, shouldn't happen.
        if edge.source not in node_ids or edge.target not in node_ids:
            continue
        adjacency[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    # Start with all nodes that have no incoming edges.
    queue = deque([node_id for node_id, deg in in_degree.items() if deg == 0])
    removed_count = 0

    while queue:
        current = queue.popleft()
        removed_count += 1
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return removed_count == len(node_ids)


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': is_dag(pipeline.nodes, pipeline.edges),
    }
