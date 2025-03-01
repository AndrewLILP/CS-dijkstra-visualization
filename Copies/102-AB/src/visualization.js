/**
 * @file visualizationUtil.js
 * @description Utility functions for visualizing Dijkstra's algorithm on a graph
 * @author CS Student
 * @version 1.0.0
 */

/**
 * Class that manages the visualization of graph algorithms
 * Handles rendering of nodes, edges, and animation of the algorithm steps
 */
class GraphVisualizer {
    /**
     * Creates a new graph visualizer
     * @param {HTMLCanvasElement} canvas - The canvas element for drawing
     * @param {Object} options - Visualization options
     */
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      
      // Default options
      this.options = {
        nodeRadius: options.nodeRadius || 25,
        nodeFontSize: options.nodeFontSize || 14,
        edgeFontSize: options.edgeFontSize || 12,
        nodeColor: options.nodeColor || '#6495ED',
        edgeColor: options.edgeColor || '#AAAAAA',
        visitedColor: options.visitedColor || '#87CEFA',
        currentColor: options.currentColor || '#FFD700',
        pathColor: options.pathColor || '#32CD32',
        textColor: options.textColor || '#333333',
        animationSpeed: options.animationSpeed || 1000,
        layoutSpacing: options.layoutSpacing || 150,
        ...options
      };
      
      // State variables
      this.graph = null;
      this.nodePositions = {};
      this.animationQueue = [];
      this.animationInProgress = false;
      this.nodeStates = {};       // 'default', 'current', 'visited', 'path'
      this.edgeStates = {};       // 'default', 'current', 'visited', 'path'
      this.currentStep = 0;
      this.totalSteps = 0;
      
      // Bind event handlers
      this.canvas.addEventListener('click', this._handleCanvasClick.bind(this));
      
      // Initialize canvas
      this._resizeCanvas();
      window.addEventListener('resize', this._resizeCanvas.bind(this));
    }
    
    /**
     * Sets the graph to visualize
     * @param {Object} graph - The adjacency list representation of the graph
     */
    setGraph(graph) {
      this.graph = graph;
      this.nodeStates = {};
      this.edgeStates = {};
      
      // Calculate positions for nodes
      this._calculateNodePositions();
      
      // Initial render of the graph
      this.render();
    }
    
    /**
     * Calculate node positions using a force-directed layout algorithm
     * This creates visually pleasing graph layouts
     * @private
     */
    _calculateNodePositions() {
      const nodes = Object.keys(this.graph);
      const nodeCount = nodes.length;
      
      // Initialize positions in a circle
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // Place nodes in a circle initially
      nodes.forEach((node, i) => {
        const angle = (i / nodeCount) * 2 * Math.PI;
        this.nodePositions[node] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          vx: 0,
          vy: 0  // Velocity for force-directed layout
        };
      });
      
      // Run force-directed layout simulation for better placement
      this._runForceDirectedLayout(100); // 100 iterations
    }
    
    /**
     * Run a force-directed layout algorithm to arrange nodes aesthetically
     * Implements a simplified Fruchterman-Reingold algorithm
     * @param {number} iterations - Number of simulation iterations to run
     * @private
     */
    _runForceDirectedLayout(iterations) {
      const nodes = Object.keys(this.nodePositions);
      const k = this.options.layoutSpacing; // Optimal distance between nodes
      const temperature = this.canvas.width / 10; // Initial temperature for simulated annealing
      
      for (let i = 0; i < iterations; i++) {
        // Calculate repulsive forces between all pairs of nodes
        for (let a = 0; a < nodes.length; a++) {
          const nodeA = nodes[a];
          for (let b = a + 1; b < nodes.length; b++) {
            const nodeB = nodes[b];
            
            // Calculate distance between nodes
            const dx = this.nodePositions[nodeB].x - this.nodePositions[nodeA].x;
            const dy = this.nodePositions[nodeB].y - this.nodePositions[nodeA].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            
            // Calculate repulsive force (inversely proportional to distance)
            const force = k * k / distance;
            
            // Apply force to both nodes in opposite directions
            this.nodePositions[nodeA].vx -= (dx / distance) * force;
            this.nodePositions[nodeA].vy -= (dy / distance) * force;
            this.nodePositions[nodeB].vx += (dx / distance) * force;
            this.nodePositions[nodeB].vy += (dy / distance) * force;
          }
        }
        
        // Calculate attractive forces between connected nodes
        for (const source in this.graph) {
          for (const target in this.graph[source]) {
            if (source !== target) {
              // Calculate distance between connected nodes
              const dx = this.nodePositions[target].x - this.nodePositions[source].x;
              const dy = this.nodePositions[target].y - this.nodePositions[source].y;
              const distance = Math.sqrt(dx * dx + dy * dy) || 1;
              
              // Calculate attractive force (proportional to distance)
              const force = distance * distance / k;
              
              // Apply force to both nodes
              this.nodePositions[source].vx += (dx / distance) * force;
              this.nodePositions[source].vy += (dy / distance) * force;
              this.nodePositions[target].vx -= (dx / distance) * force;
              this.nodePositions[target].vy -= (dy / distance) * force;
            }
          }
        }
        
        // Apply velocity to node positions with temperature-scaled dampening
        const currentTemp = temperature * (1 - i / iterations);
        for (const node in this.nodePositions) {
          // Limit maximum movement to current temperature
          const velocity = Math.sqrt(
            this.nodePositions[node].vx * this.nodePositions[node].vx + 
            this.nodePositions[node].vy * this.nodePositions[node].vy
          );
          
          if (velocity > 0) {
            const scaleFactor = Math.min(velocity, currentTemp) / velocity;
            this.nodePositions[node].x += this.nodePositions[node].vx * scaleFactor;
            this.nodePositions[node].y += this.nodePositions[node].vy * scaleFactor;
          }
          
          // Keep nodes within canvas bounds
          this.nodePositions[node].x = Math.max(
            this.options.nodeRadius, 
            Math.min(this.canvas.width - this.options.nodeRadius, this.nodePositions[node].x)
          );
          this.nodePositions[node].y = Math.max(
            this.options.nodeRadius, 
            Math.min(this.canvas.height - this.options.nodeRadius, this.nodePositions[node].y)
          );
          
          // Reset velocity for next iteration
          this.nodePositions[node].vx = 0;
          this.nodePositions[node].vy = 0;
        }
      }
    }
    
    /**
     * Renders the graph on the canvas
     */
    render() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw edges first (so they appear behind nodes)
      this._drawEdges();
      
      // Draw nodes
      this._drawNodes();
    }
    
    /**
     * Draws all edges in the graph
     * @private
     */
    _drawEdges() {
      // For each node
      for (const source in this.graph) {
        const sourcePos = this.nodePositions[source];
        
        // For each of its neighbors
        for (const target in this.graph[source]) {
          const targetPos = this.nodePositions[target];
          const weight = this.graph[source][target];
          const edgeKey = `${source}-${target}`;
          const edgeState = this.edgeStates[edgeKey] || 'default';
          
          // Draw the edge
          this._drawEdge(sourcePos, targetPos, weight, edgeState);
        }
      }
    }
    
    /**
     * Draws a single edge between two nodes
     * @param {Object} sourcePos - The position of the source node {x, y}
     * @param {Object} targetPos - The position of the target node {x, y}
     * @param {number} weight - The weight of the edge
     * @param {string} state - The state of the edge ('default', 'current', 'visited', 'path')
     * @private
     */
    _drawEdge(sourcePos, targetPos, weight, state = 'default') {
      const ctx = this.ctx;
      
      // Determine color based on state
      let color;
      switch (state) {
        case 'current':
          color = this.options.currentColor;
          break;
        case 'visited':
          color = this.options.visitedColor;
          break;
        case 'path':
          color = this.options.pathColor;
          break;
        default:
          color = this.options.edgeColor;
      }
      
      // Calculate direction vector
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate start and end points (adjusted to not overlap the nodes)
      const startX = sourcePos.x + (dx / distance) * this.options.nodeRadius;
      const startY = sourcePos.y + (dy / distance) * this.options.nodeRadius;
      const endX = targetPos.x - (dx / distance) * this.options.nodeRadius;
      const endY = targetPos.y - (dy / distance) * this.options.nodeRadius;
      
      // Draw the edge
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = state === 'path' ? 3 : 2;
      ctx.stroke();
      
      // Draw the weight
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      
      // Add slight offset to weight text so it doesn't overlap the line
      const offsetX = dy / distance * 10;
      const offsetY = -dx / distance * 10;
      
      ctx.font = `${this.options.edgeFontSize}px Arial`;
      ctx.fillStyle = this.options.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw background for weight to improve readability
      const textWidth = ctx.measureText(weight).width;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(
        midX + offsetX - textWidth/2 - 2, 
        midY + offsetY - this.options.edgeFontSize/2 - 2,
        textWidth + 4,
        this.options.edgeFontSize + 4
      );
      
      // Draw weight text
      ctx.fillStyle = this.options.textColor;
      ctx.fillText(weight, midX + offsetX, midY + offsetY);
      
      // Draw arrow for directed graphs (optional)
      if (this.options.directed) {
        this._drawArrow(endX, endY, Math.atan2(dy, dx), color);
      }
    }
    
    /**
     * Draws an arrow head at the end of a directed edge
     * @param {number} x - X coordinate of the arrow tip
     * @param {number} y - Y coordinate of the arrow tip
     * @param {number} angle - Angle of the edge in radians
     * @param {string} color - Color of the arrow
     * @private
     */
    _drawArrow(x, y, angle, color) {
      const ctx = this.ctx;
      const headLength = 10;  // Length of arrow head
      const headWidth = 8;    // Width of arrow head
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Draw the arrow head
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-headLength, headWidth/2);
      ctx.lineTo(-headLength, -headWidth/2);
      ctx.closePath();
      
      ctx.fillStyle = color;
      ctx.fill();
      
      ctx.restore();
    }
    
    /**
     * Draws all nodes in the graph
     * @private
     */
    _drawNodes() {
      for (const node in this.nodePositions) {
        const pos = this.nodePositions[node];
        const state = this.nodeStates[node] || 'default';
        
        this._drawNode(pos.x, pos.y, node, state);
      }
    }
    
    /**
     * Draws a single node
     * @param {number} x - X coordinate of the node center
     * @param {number} y - Y coordinate of the node center
     * @param {string} label - Label for the node
     * @param {string} state - The state of the node ('default', 'current', 'visited', 'path')
     * @private
     */
    _drawNode(x, y, label, state = 'default') {
      const ctx = this.ctx;
      const radius = this.options.nodeRadius;
      
      // Determine color based on state
      let color;
      switch (state) {
        case 'start':
          color = '#FF8C00'; // Dark orange
          break;
        case 'end':
          color = '#FF4500'; // Orange red
          break;
        case 'current':
          color = this.options.currentColor;
          break;
        case 'visited':
          color = this.options.visitedColor;
          break;
        case 'path':
          color = this.options.pathColor;
          break;
        default:
          color = this.options.nodeColor;
      }
      
      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw label
      ctx.font = `bold ${this.options.nodeFontSize}px Arial`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    }
    
    /**
     * Visualizes the steps of Dijkstra's algorithm
     * @param {Object} result - The result from running Dijkstra's algorithm
     * @param {string} startNode - The starting node
     * @param {string} endNode - The ending node
     */
    visualizeDijkstra(result, startNode, endNode) {
      const { distances, previous, visitOrder } = result;
      
      // Reset states
      this.nodeStates = {};
      this.edgeStates = {};
      
      // Set start and end nodes
      this.nodeStates[startNode] = 'start';
      this.nodeStates[endNode] = 'end';
      
      // Create animation steps
      this.animationQueue = [];
      
      // First step: Just show the graph with start and end highlighted
      this.animationQueue.push(() => {
        this.render();
      });
      
      // For each vertex visited during the algorithm
      let prevNode = null;
      for (const node of visitOrder) {
        // Step: Highlight the current node being processed
        this.animationQueue.push(() => {
          // If there was a previous node, mark it as visited
          if (prevNode && prevNode !== startNode && prevNode !== endNode) {
            this.nodeStates[prevNode] = 'visited';
          }
          
          // Mark current node
          if (node !== startNode && node !== endNode) {
            this.nodeStates[node] = 'current';
          }
          
          // If we know how we got to this node, highlight the edge
          if (previous[node] !== null) {
            const edgeKey = `${previous[node]}-${node}`;
            this.edgeStates[edgeKey] = 'visited';
          }
          
          this.render();
        });
        
        prevNode = node;
      }
      
      // Mark the last node as visited
      this.animationQueue.push(() => {
        if (prevNode && prevNode !== startNode && prevNode !== endNode) {
          this.nodeStates[prevNode] = 'visited';
        }
        this.render();
      });
      
      // Highlight the shortest path
      this.animationQueue.push(() => {
        // Reconstruct the path from end to start
        let current = endNode;
        
        while (current && current !== startNode) {
          const prev = previous[current];
          if (!prev) break;
          
          // Highlight the path node
          if (current !== endNode) {
            this.nodeStates[current] = 'path';
          }
          
          // Highlight the path edge
          const edgeKey = `${prev}-${current}`;
          this.edgeStates[edgeKey] = 'path';
          
          current = prev;
        }
        
        this.render();
      });
      
      // Start the animation
      this.totalSteps = this.animationQueue.length;
      this.currentStep = 0;
      this._startAnimation();
    }
    
    /**
     * Starts the animation sequence
     * @private
     */
    _startAnimation() {
      if (this.animationInProgress) return;
      
      this.animationInProgress = true;
      this._runNextAnimationStep();
    }
    
    /**
     * Runs the next step in the animation sequence
     * @private
     */
    _runNextAnimationStep() {
      if (this.currentStep >= this.animationQueue.length) {
        this.animationInProgress = false;
        // Animation complete event
        if (this.options.onAnimationComplete) {
          this.options.onAnimationComplete();
        }
        return;
      }
      
      // Run the current step
      const step = this.animationQueue[this.currentStep];
      step();
      
      // Move to next step
      this.currentStep++;
      
      // If there's an onAnimationStep callback, call it
      if (this.options.onAnimationStep) {
        this.options.onAnimationStep(this.currentStep, this.totalSteps);
      }
      
      // Schedule the next step
      setTimeout(() => {
        this._runNextAnimationStep();
      }, this.options.animationSpeed);
    }
    
    /**
     * Pauses the animation
     */
    pauseAnimation() {
      this.animationInProgress = false;
    }
    
    /**
     * Resumes the animation
     */
    resumeAnimation() {
      if (!this.animationInProgress && this.currentStep < this.animationQueue.length) {
        this.animationInProgress = true;
        this._runNextAnimationStep();
      }
    }
    
    /**
     * Jumps to a specific step in the animation
     * @param {number} step - The step to jump to (0-indexed)
     */
    jumpToStep(step) {
      // Make sure step is in valid range
      step = Math.max(0, Math.min(step, this.animationQueue.length - 1));
      
      // Reset states
      this.nodeStates = {};
      this.edgeStates = {};
      
      // Run all steps up to the target step
      for (let i = 0; i <= step; i++) {
        this.animationQueue[i]();
      }
      
      this.currentStep = step + 1;
    }
    
    /**
     * Handles canvas click events
     * @param {MouseEvent} event - The click event
     * @private
     */
    _handleCanvasClick(event) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Check if a node was clicked
      for (const node in this.nodePositions) {
        const pos = this.nodePositions[node];
        const distance = Math.sqrt(
          Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)
        );
        
        if (distance <= this.options.nodeRadius) {
          // Node was clicked
          if (this.options.onNodeClick) {
            this.options.onNodeClick(node);
          }
          break;
        }
      }
    }
    
    /**
     * Resizes the canvas to match its parent container
     * @private
     */
    _resizeCanvas() {
      if (this.canvas.parentElement) {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = Math.max(
          400, 
          this.canvas.parentElement.clientHeight || window.innerHeight * 0.6
        );
        
        // Recalculate node positions and re-render if we have a graph
        if (this.graph) {
          this._calculateNodePositions();
          this.render();
        }
      }
    }
    
    /**
     * Gets a node at a specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {string|null} The node at the position, or null if none
     */
    getNodeAtPosition(x, y) {
      for (const node in this.nodePositions) {
        const pos = this.nodePositions[node];
        const distance = Math.sqrt(
          Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)
        );
        
        if (distance <= this.options.nodeRadius) {
          return node;
        }
      }
      
      return null;
    }
    
    /**
     * Exports the current canvas as an image
     * @returns {string} Data URL of the canvas image
     */
    exportAsImage() {
      return this.canvas.toDataURL('image/png');
    }
  }
  
  /**
   * Creates a formatted display for the shortest path information
   * @param {Object} result - The result object from findShortestPath
   * @param {string} startNode - The start node
   * @param {string} endNode - The end node
   * @returns {HTMLElement} DOM element with formatted result information
   */
  function createPathInfoDisplay(result, startNode, endNode) {
    const container = document.createElement('div');
    container.className = 'path-info';
    
    // Path heading
    const heading = document.createElement('h3');
    heading.textContent = `Shortest Path: ${startNode} → ${endNode}`;
    container.appendChild(heading);
    
    // Path visualization
    const pathDiv = document.createElement('div');
    pathDiv.className = 'path-visualization';
    
    if (result.path.length > 0) {
      const pathStr = result.path.join(' → ');
      pathDiv.textContent = pathStr;
    } else {
      pathDiv.textContent = 'No path exists';
      pathDiv.classList.add('no-path');
    }
    
    container.appendChild(pathDiv);
    
    // Distance information
    if (result.distance !== Infinity) {
      const distanceDiv = document.createElement('div');
      distanceDiv.className = 'path-distance';
      distanceDiv.textContent = `Total Distance: ${result.distance}`;
      container.appendChild(distanceDiv);
    }
    
    return container;
  }
  
  /**
   * Creates a step-by-step explanation of Dijkstra's algorithm
   * @param {Object} result - The result from running Dijkstra's algorithm
   * @param {string} startNode - The start node
   * @param {string} endNode - The end node
   * @returns {Array<string>} Array of explanation steps
   */
  function createAlgorithmExplanation(result, startNode, endNode) {
    const { distances, previous, visitOrder } = result;
    const explanation = [];
    
    // Initial step
    explanation.push(`Starting Dijkstra's algorithm from node ${startNode}`);
    explanation.push(`All distances initialized: ${startNode} = 0, all others = ∞`);
    
    // Track the progression of distances
    let currentDistances = { ...distances };
    
    // For each visited node
    for (let i = 0; i < visitOrder.length; i++) {
      const current = visitOrder[i];
      
      // Skip if it's the start node (already explained)
      if (i === 0 && current === startNode) {
        explanation.push(`Selected node ${current} (starting node)`);
      } else {
        explanation.push(`Selected node ${current} with current distance ${distances[current]}`);
      }
      
      // Find which neighbors were updated in this step
      const updatedNeighbors = [];
      
      // Look ahead to the next step to see which distances changed
      if (i + 1 < visitOrder.length) {
        // Create a copy of current distances for comparison
        const nextDistances = { ...currentDistances };
        
        // For each neighbor of the current node
        for (const neighbor in previous) {
          // If this neighbor's shortest path comes through the current node
          if (previous[neighbor] === current) {
            // Calculate the distance through the current node
            const distanceThrough = distances[current] + (currentDistances[neighbor] - distances[neighbor]);
            
            // Check if this is a shorter path
            if (distanceThrough < currentDistances[neighbor]) {
              updatedNeighbors.push({
                node: neighbor,
                oldDistance: currentDistances[neighbor],
                newDistance: distanceThrough
              });
              
              // Update for the next step
              nextDistances[neighbor] = distanceThrough;
            }
          }
        }
        
        // Update currentDistances for the next step
        currentDistances = nextDistances;
      }
      
      // Add information about updated neighbors
      if (updatedNeighbors.length > 0) {
        explanation.push('Updated distances for neighbors:');
        for (const update of updatedNeighbors) {
          const oldDist = update.oldDistance === Infinity ? '∞' : update.oldDistance;
          explanation.push(`- Node ${update.node}: ${oldDist} → ${update.newDistance} via ${current}`);
        }
      } else {
        explanation.push('No distances were updated in this step.');
      }
    }
    
    // Add path reconstruction explanation
    if (result.path.length > 0) {
      explanation.push(`\nReconstructing shortest path from ${startNode} to ${endNode}:`);
      explanation.push(`Final path: ${result.path.join(' → ')}`);
      explanation.push(`Total distance: ${result.distance}`);
    } else {
      explanation.push(`\nNo path exists from ${startNode} to ${endNode}`);
    }
    
    return explanation;
  }
  
  /**
   * Utility function to generate a random connected graph
   * @param {number} nodeCount - Number of nodes to create
   * @param {number} edgeDensity - Value between 0-1, higher means more edges
   * @param {number} maxWeight - Maximum edge weight
   * @returns {Object} Generated graph in adjacency list format
   */
  function generateRandomGraph(nodeCount, edgeDensity = 0.3, maxWeight = 10) {
    // Create node labels (A, B, C, ...)
    const nodes = Array.from({ length: nodeCount }, (_, i) => 
      String.fromCharCode(65 + i % 26) + (i >= 26 ? Math.floor(i / 26) : '')
    );
    
    const graph = {};
    
    // Initialize empty adjacency lists
    for (const node of nodes) {
      graph[node] = {};
    }
    
    // Add random edges to ensure connectedness (minimum spanning tree)
    // This guarantees the graph is connected
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
      const weight = Math.floor(Math.random() * maxWeight) + 1;
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
      // Pick two random different nodes
      let from, to;
      do {
        from = nodes[Math.floor(Math.random() * nodes.length)];
        to = nodes[Math.floor(Math.random() * nodes.length)];
      } while (from === to || graph[from][to] !== undefined);
      
      // Add a random edge
      const weight = Math.floor(Math.random() * maxWeight) + 1;
      graph[from][to] = weight;
      graph[to][from] = weight; // Make it undirected
    }
    
    return graph;
  }
  
  // Export the utilities for use in other modules
  module.exports = {
    GraphVisualizer,
    createPathInfoDisplay,
    createAlgorithmExplanation,
    generateRandomGraph
  };