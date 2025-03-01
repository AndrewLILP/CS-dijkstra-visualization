/**
 * @file graphData.js
 * @description Provides sample graph data and utilities for loading graph data
 * @author CS Student
 * @version 1.0.0
 */

/**
 * Creates a sample graph for testing Dijkstra's algorithm
 * @returns {Object} A graph in adjacency list format
 */
function createSampleGraph() {
    // Example graph: A-B-C-D-E-F with various weights
    // Visual representation:
    //       A
    //     1/ \4
    //    B --- C
    //   /|     |\
    //  2 |     | 1
    //  / 3     3 \
    // D---E-----F
    //    1    1
    return {
      A: { B: 1, C: 4 },
      B: { A: 1, C: 3, D: 2, E: 3 },
      C: { A: 4, B: 3, E: 3, F: 1 },
      D: { B: 2, E: 1 },
      E: { B: 3, C: 3, D: 1, F: 1 },
      F: { C: 1, E: 1 }
    };
  }
  
  /**
   * Example predefined graph that represents a road network
   */
  const roadNetworkGraph = {
    "City A": { "City B": 5, "City C": 10, "City D": 15 },
    "City B": { "City A": 5, "City E": 7, "City F": 12 },
    "City C": { "City A": 10, "City F": 8, "City G": 11 },
    "City D": { "City A": 15, "City G": 9, "City H": 6 },
    "City E": { "City B": 7, "City F": 4, "City I": 14 },
    "City F": { "City B": 12, "City C": 8, "City E": 4, "City G": 3, "City I": 8 },
    "City G": { "City C": 11, "City D": 9, "City F": 3, "City H": 5, "City J": 7 },
    "City H": { "City D": 6, "City G": 5, "City J": 9 },
    "City I": { "City E": 14, "City F": 8, "City J": 10 },
    "City J": { "City G": 7, "City H": 9, "City I": 10 }
  };
  
  /**
   * Example graph that resembles a computer network topology
   */
  const networkTopologyGraph = {
    "Router1": { "Router2": 2, "Router3": 4, "Router4": 3 },
    "Router2": { "Router1": 2, "Router5": 5, "Router6": 1 },
    "Router3": { "Router1": 4, "Router6": 3, "Router7": 2 },
    "Router4": { "Router1": 3, "Router7": 4, "Router8": 1 },
    "Router5": { "Router2": 5, "Router9": 2 },
    "Router6": { "Router2": 1, "Router3": 3, "Router9": 5, "Router10": 3 },
    "Router7": { "Router3": 2, "Router4": 4, "Router10": 2 },
    "Router8": { "Router4": 1, "Router10": 4 },
    "Router9": { "Router5": 2, "Router6": 5 },
    "Router10": { "Router6": 3, "Router7": 2, "Router8": 4 }
  };
  
  /**
   * Example graph that represents a grid/maze with weighted paths
   */
  const gridMazeGraph = {
    "A1": { "A2": 1, "B1": 2 },
    "A2": { "A1": 1, "A3": 3, "B2": 1 },
    "A3": { "A2": 3, "A4": 1, "B3": 4 },
    "A4": { "A3": 1, "B4": 2 },
    "B1": { "A1": 2, "B2": 2, "C1": 1 },
    "B2": { "A2": 1, "B1": 2, "B3": 5, "C2": 3 },
    "B3": { "A3": 4, "B2": 5, "B4": 1, "C3": 2 },
    "B4": { "A4": 2, "B3": 1, "C4": 5 },
    "C1": { "B1": 1, "C2": 2, "D1": 3 },
    "C2": { "B2": 3, "C1": 2, "C3": 1, "D2": 4 },
    "C3": { "B3": 2, "C2": 1, "C4": 2, "D3": 1 },
    "C4": { "B4": 5, "C3": 2, "D4": 3 },
    "D1": { "C1": 3, "D2": 1 },
    "D2": { "C2": 4, "D1": 1, "D3": 3 },
    "D3": { "C3": 1, "D2": 3, "D4": 2 },
    "D4": { "C4": 3, "D3": 2 }
  };
  
  /**
   * Example graph representing a small flight network
   */
  const flightNetworkGraph = {
    "New York": { "Boston": 3, "Chicago": 15, "Miami": 21 },
    "Boston": { "New York": 3, "Chicago": 14, "Toronto": 8 },
    "Chicago": { "New York": 15, "Boston": 14, "Denver": 18, "Los Angeles": 30 },
    "Denver": { "Chicago": 18, "San Francisco": 15, "Los Angeles": 14 },
    "Los Angeles": { "Chicago": 30, "Denver": 14, "San Francisco": 6, "Seattle": 18 },
    "San Francisco": { "Denver": 15, "Los Angeles": 6, "Seattle": 13 },
    "Seattle": { "Los Angeles": 18, "San Francisco": 13, "Vancouver": 3 },
    "Miami": { "New York": 21, "Mexico City": 15 },
    "Toronto": { "Boston": 8, "Vancouver": 45 },
    "Vancouver": { "Seattle": 3, "Toronto": 45 },
    "Mexico City": { "Miami": 15, "Los Angeles": 27 }
  };
  
  /**
   * Object containing all available predefined graphs
   */
  const predefinedGraphs = {
    example: createSampleGraph(),
    roadNetwork: roadNetworkGraph,
    networkTopology: networkTopologyGraph,
    gridMaze: gridMazeGraph,
    flightNetwork: flightNetworkGraph
  };
  
  /**
   * Loads a graph from JSON data
   * @param {string|Object} jsonData - JSON string or object containing graph data
   * @returns {Object} Graph in adjacency list format
   */
  function loadGraphFromJSON(jsonData) {
    // If data is a string, parse it to an object
    const graphData = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    // Clone the object to avoid reference issues
    return JSON.parse(JSON.stringify(graphData));
  }
  
  /**
   * Loads a graph from a file
   * @param {string} filePath - Path to the JSON file containing graph data
   * @returns {Promise<Object>} Promise that resolves to a graph object
   */
  async function loadGraphFromFile(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return loadGraphFromJSON(data);
    } catch (error) {
      console.error('Error loading graph data:', error);
      // Return the default graph in case of error
      return createSampleGraph();
    }
  }
  
  /**
   * Generates a random graph with the specified number of nodes
   * @param {number} nodeCount - Number of nodes in the graph
   * @param {number} edgeDensity - Value between 0-1 indicating how dense the graph is (default: 0.3)
   * @param {number} minWeight - Minimum weight for edges (default: 1)
   * @param {number} maxWeight - Maximum weight for edges (default: 10)
   * @returns {Object} Generated graph in adjacency list format
   */
  function generateRandomGraph(nodeCount = 6, edgeDensity = 0.3, minWeight = 1, maxWeight = 10) {
    // Create node labels (A, B, C, ...)
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      // Use A-Z for first 26 nodes, then A1, B1, etc.
      if (i < 26) {
        nodes.push(String.fromCharCode(65 + i));
      } else {
        nodes.push(String.fromCharCode(65 + (i % 26)) + Math.floor(i / 26));
      }
    }
    
    const graph = {};
    
    // Initialize empty adjacency lists
    for (const node of nodes) {
      graph[node] = {};
    }
    
    // Add random edges to ensure connectedness (minimum spanning tree)
    const connectedNodes = [nodes[0]];
    const remainingNodes = nodes.slice(1);
    
    while (remainingNodes.length > 0) {
      // Pick a random connected node
      const fromIndex = Math.floor(Math.random() * connectedNodes.length);
      const from = connectedNodes[fromIndex];
      
      // Pick a random unconnected node
      const toIndex = Math.floor(Math.random() * remainingNodes.length);
      const to = remainingNodes[toIndex];
      
      // Add an edge between them with random weight
      const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
      graph[from][to] = weight;
      graph[to][from] = weight; // Make it undirected
      
      // Move the 'to' node to the connected set
      connectedNodes.push(to);
      remainingNodes.splice(toIndex, 1);
    }
    
    // Add additional random edges based on density
    const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2;
    const currentEdgeCount = nodeCount - 1; // From the spanning tree
    const targetEdgeCount = Math.min(
      maxPossibleEdges,
      Math.floor(maxPossibleEdges * edgeDensity)
    );
    
    // Add more random edges if needed
    for (let i = currentEdgeCount; i < targetEdgeCount; i++) {
      // Try to find two nodes that aren't already connected
      let attempts = 0;
      let success = false;
      
      while (!success && attempts < 100) { // Limit attempts to prevent infinite loops
        // Pick two random different nodes
        const from = nodes[Math.floor(Math.random() * nodes.length)];
        const to = nodes[Math.floor(Math.random() * nodes.length)];
        
        // Only add an edge if the nodes are different and not already connected
        if (from !== to && graph[from][to] === undefined) {
          // Add a random edge
          const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
          graph[from][to] = weight;
          graph[to][from] = weight; // Make it undirected
          success = true;
        }
        
        attempts++;
      }
      
      // If we couldn't add an edge after 100 attempts, break the loop
      if (!success) break;
    }
    
    return graph;
  }
  
  /**
   * Creates a graph from an adjacency matrix
   * @param {Array<Array<number>>} matrix - Adjacency matrix where matrix[i][j] is the weight of edge from i to j
   * @param {Array<string>} labels - Optional node labels (default: A, B, C, ...)
   * @returns {Object} Graph in adjacency list format
   */
  function createGraphFromMatrix(matrix, labels = null) {
    const graph = {};
    
    // Create default labels if not provided
    if (!labels) {
      labels = [];
      for (let i = 0; i < matrix.length; i++) {
        // Use A-Z for first 26 nodes, then A1, B1, etc.
        if (i < 26) {
          labels.push(String.fromCharCode(65 + i));
        } else {
          labels.push(String.fromCharCode(65 + (i % 26)) + Math.floor(i / 26));
        }
      }
    }
    
    // Convert matrix to adjacency list
    for (let i = 0; i < matrix.length; i++) {
      graph[labels[i]] = {};
      
      for (let j = 0; j < matrix[i].length; j++) {
        // Add edge if weight is not 0 or Infinity (i.e., there is a connection)
        if (matrix[i][j] !== 0 && matrix[i][j] !== Infinity) {
          graph[labels[i]][labels[j]] = matrix[i][j];
        }
      }
    }
    
    return graph;
  }
  
  /**
   * Validates a graph to ensure it has the correct structure
   * @param {Object} graph - The graph to validate
   * @returns {boolean} True if the graph is valid, false otherwise
   */
  function validateGraph(graph) {
    // Check that the graph is an object
    if (typeof graph !== 'object' || graph === null) {
      console.error('Invalid graph: graph must be an object');
      return false;
    }
    
    // Check that each node has an adjacency list
    for (const node in graph) {
      if (typeof graph[node] !== 'object' || graph[node] === null) {
        console.error(`Invalid graph: node ${node} must have an adjacency list`);
        return false;
      }
      
      // Check that each edge has a valid weight
      for (const neighbor in graph[node]) {
        if (typeof graph[node][neighbor] !== 'number' || graph[node][neighbor] <= 0) {
          console.error(`Invalid graph: edge weight from ${node} to ${neighbor} must be a positive number`);
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Converts a graph to a DOT format string for use with Graphviz
   * @param {Object} graph - The graph to convert
   * @param {boolean} directed - Whether the graph is directed (default: false)
   * @returns {string} DOT format string
   */
  function convertToDOT(graph, directed = false) {
    const graphType = directed ? 'digraph' : 'graph';
    const edgeOp = directed ? '->' : '--';
    
    let dot = `${graphType} G {\n`;
    
    // Add nodes
    for (const node in graph) {
      dot += `  "${node}";\n`;
    }
    
    // Add edges
    const addedEdges = new Set();
    
    for (const node in graph) {
      for (const neighbor in graph[node]) {
        const weight = graph[node][neighbor];
        
        // For undirected graphs, only add each edge once
        if (!directed) {
          const edgeKey1 = `${node}-${neighbor}`;
          const edgeKey2 = `${neighbor}-${node}`;
          
          if (addedEdges.has(edgeKey1) || addedEdges.has(edgeKey2)) {
            continue;
          }
          
          addedEdges.add(edgeKey1);
        }
        
        dot += `  "${node}" ${edgeOp} "${neighbor}" [label="${weight}"];\n`;
      }
    }
    
    dot += '}';
    return dot;
  }
  
  /**
   * Saves the current graph data to a JSON file for download
   * @param {Object} graph - The graph to save
   * @param {string} filename - The name of the file (default: "graph.json")
   */
  function saveGraphToFile(graph, filename = "graph.json") {
    const dataStr = JSON.stringify(graph, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', dataUri);
    exportLink.setAttribute('download', filename);
    exportLink.style.display = 'none';
    
    document.body.appendChild(exportLink);
    exportLink.click();
    document.body.removeChild(exportLink);
  }
  
  // Export the default example graph for immediate use
  const exampleGraph = createSampleGraph();
  
  // Export all the functions and data
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      exampleGraph,
      predefinedGraphs,
      createSampleGraph,
      loadGraphFromJSON,
      loadGraphFromFile,
      generateRandomGraph,
      createGraphFromMatrix,
      validateGraph,
      convertToDOT,
      saveGraphToFile
    };
  } else {
    // For browser environments without module support
    window.exampleGraph = exampleGraph;
    window.predefinedGraphs = predefinedGraphs;
    window.createSampleGraph = createSampleGraph;
    window.loadGraphFromJSON = loadGraphFromJSON;
    window.loadGraphFromFile = loadGraphFromFile;
    window.generateRandomGraph = generateRandomGraph;
    window.createGraphFromMatrix = createGraphFromMatrix;
    window.validateGraph = validateGraph;
    window.convertToDOT = convertToDOT;
    window.saveGraphToFile = saveGraphToFile;
  }