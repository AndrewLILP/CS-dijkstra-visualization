/**
 * @file dijkstra.js
 * @description Implementation of Dijkstra's algorithm for finding the shortest path in a graph
 * @author CS Student: Andrew Leary
 * @version 1.0.0
 */

/**
 * A class representing a priority queue used by Dijkstra's algorithm
 * to efficiently select the next node with the minimum distance.
 */
class PriorityQueue {
  /**
   * Initializes an empty priority queue
   */
  constructor() {
    this.values = [];
  }

  /**
   * Adds a node with its priority (distance) to the queue
   * @param {string|number} node - The node identifier
   * @param {number} priority - The priority/distance value (lower = higher priority)
   */
  enqueue(node, priority) {
    this.values.push({ node, priority });
    this.sort();
  }

  /**
   * Removes and returns the node with the highest priority (lowest distance)
   * @returns {Object|undefined} The node with highest priority or undefined if queue is empty
   */
  dequeue() {
    return this.values.shift();
  }

  /**
   * Sorts the queue by priority (distance)
   * For a production implementation, you might want to use a binary heap instead
   * of sorting the entire array for better performance.
   */
  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Checks if the queue is empty
   * @returns {boolean} True if the queue is empty, false otherwise
   */
  isEmpty() {
    return this.values.length === 0;
  }

  /**
   * Updates the priority of a node if it already exists in the queue
   * @param {string|number} node - The node to update
   * @param {number} priority - The new priority value
   * @returns {boolean} True if the node was found and updated, false otherwise
   */
  updatePriority(node, priority) {
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].node === node) {
        this.values[i].priority = priority;
        this.sort();
        return true;
      }
    }
    return false;
  }
}

/**
 * A class representing a graph on which Dijkstra's algorithm can be run.
 * The graph is represented as an adjacency list.
 */
class Graph {
  /**
   * Initializes an empty graph
   */
  constructor() {
    this.adjacencyList = {};
  }

  /**
   * Adds a vertex to the graph
   * @param {string|number} vertex - The vertex identifier
   */
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  /**
   * Adds an edge between two vertices with a given weight
   * @param {string|number} vertex1 - The first vertex
   * @param {string|number} vertex2 - The second vertex
   * @param {number} weight - The weight/distance of the edge
   */
  addEdge(vertex1, vertex2, weight) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    // For an undirected graph, uncomment the following line:
    // this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  /**
   * Gets all neighbors of a vertex with their weights
   * @param {string|number} vertex - The vertex to get neighbors for
   * @returns {Array} Array of objects with 'node' and 'weight' properties
   */
  getNeighbors(vertex) {
    return this.adjacencyList[vertex] || [];
  }

  /**
   * Gets all vertices in the graph
   * @returns {Array} Array of vertex identifiers
   */
  getVertices() {
    return Object.keys(this.adjacencyList);
  }
}

/**
 * Implementation of Dijkstra's algorithm to find the shortest path from a source
 * vertex to all other vertices in a weighted graph.
 * 
 * @param {Graph|Object} graph - The graph on which to run the algorithm (either a Graph object or an adjacency list object)
 * @param {string|number} startVertex - The source vertex
 * @returns {Object} An object containing:
 *   - distances: Object mapping each vertex to its shortest distance from the start
 *   - previousVertices: Object mapping each vertex to its predecessor in the shortest path
 *   - visitOrder: Array showing the order in which vertices were processed (for visualization)
 */
function dijkstra(graph, startVertex) {
  // Handle both Graph objects and plain adjacency list objects
  const isGraphObject = graph instanceof Graph;
  
  // Initialize data structures
  const distances = {};
  const previousVertices = {};
  const visitOrder = [];
  const priorityQueue = new PriorityQueue();
  
  // Get vertices based on the graph type
  const vertices = isGraphObject ? graph.getVertices() : Object.keys(graph);
  
  // Initialize all distances as Infinity except the start vertex
  for (const vertex of vertices) {
    if (vertex === startVertex) {
      distances[vertex] = 0;
      priorityQueue.enqueue(vertex, 0);
    } else {
      distances[vertex] = Infinity;
      priorityQueue.enqueue(vertex, Infinity);
    }
    previousVertices[vertex] = null;
  }
  
  // Main algorithm loop
  while (!priorityQueue.isEmpty()) {
    // Get the vertex with the smallest distance
    const currentVertex = priorityQueue.dequeue().node;
    
    // Record the order of visited vertices for visualization
    visitOrder.push(currentVertex);
    
    // If we've reached a vertex with Infinity distance, there are no more reachable vertices
    if (distances[currentVertex] === Infinity) break;
    
    // Get neighbors based on the graph type
    const neighbors = isGraphObject ? 
      graph.getNeighbors(currentVertex) : 
      Object.entries(graph[currentVertex]).map(([node, weight]) => ({ node, weight }));
    
    // Check all neighbors of the current vertex
    for (const neighbor of neighbors) {
      // Calculate new distance to neighbor through current vertex
      const potentialDistance = distances[currentVertex] + neighbor.weight;
      
      // If we found a shorter path to the neighbor
      if (potentialDistance < distances[neighbor.node]) {
        // Update the distance
        distances[neighbor.node] = potentialDistance;
        
        // Update the previous vertex
        previousVertices[neighbor.node] = currentVertex;
        
        // Update priority in the queue
        priorityQueue.updatePriority(neighbor.node, potentialDistance);
      }
    }
  }
  
  return { 
    distances, 
    previousVertices,
    visitOrder
  };
}

/**
 * Reconstructs the shortest path from start to end vertices using the previousVertices map
 * @param {Object} previousVertices - Map of vertices to their predecessors
 * @param {string|number} endVertex - The target vertex
 * @returns {Array} Array of vertices representing the shortest path (in order)
 */
function reconstructPath(previousVertices, endVertex) {
  const path = [];
  let currentVertex = endVertex;
  
  // Reconstruct the path by working backwards from the end vertex
  while (currentVertex) {
    path.unshift(currentVertex);
    currentVertex = previousVertices[currentVertex];
  }
  
  return path;
}

/**
 * Runs Dijkstra's algorithm and returns the shortest path from start to end
 * @param {Graph|Object} graph - The graph on which to run the algorithm
 * @param {string|number} startVertex - The source vertex
 * @param {string|number} endVertex - The target vertex
 * @returns {Object} An object containing:
 *   - path: Array of vertices in the shortest path
 *   - distance: The total distance of the path
 *   - visitOrder: Array showing the order in which vertices were processed
 */
function findShortestPath(graph, startVertex, endVertex) {
  try {
    const { distances, previousVertices, visitOrder } = dijkstra(graph, startVertex);
    const path = reconstructPath(previousVertices, endVertex);
    
    return {
      path,
      distance: distances[endVertex],
      visitOrder,
      previousVertices
    };
  } catch (error) {
    console.error('Error in findShortestPath:', error);
    return {
      path: [],
      distance: Infinity,
      visitOrder: [],
      previousVertices: {}
    };
  }
}

// Export the functions and classes for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    Graph,
    PriorityQueue,
    dijkstra,
    reconstructPath,
    findShortestPath
  };
} else {
  // Browser environment
  window.Graph = Graph;
  window.PriorityQueue = PriorityQueue;
  window.dijkstra = dijkstra;
  window.reconstructPath = reconstructPath;
  window.findShortestPath = findShortestPath;
}