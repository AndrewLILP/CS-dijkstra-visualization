/**
 * @file staticGraphDisplay.js
 * @description Creates a static display of a graph with node states highlighted
 * @version 1.0.0
 */

/**
 * StaticGraphDisplay class creates a static visualization of a graph
 * that shows the final state after an algorithm has run
 */
class StaticGraphDisplay {
    /**
     * Creates a new static graph display
     * @param {HTMLCanvasElement} canvas - The canvas element for drawing
     * @param {Object} options - Display options
     */
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      
      // Default options
      this.options = {
        nodeRadius: options.nodeRadius || 20,
        nodeFontSize: options.nodeFontSize || 12,
        edgeFontSize: options.edgeFontSize || 10,
        defaultNodeColor: options.defaultNodeColor || '#6495ED',
        visitedNodeColor: options.visitedNodeColor || '#87CEFA',
        pathNodeColor: options.pathNodeColor || '#32CD32',
        startNodeColor: options.startNodeColor || '#FF8C00',
        endNodeColor: options.endNodeColor || '#FF4500',
        edgeColor: options.edgeColor || '#AAAAAA',
        pathEdgeColor: options.pathEdgeColor || '#32CD32',
        textColor: options.textColor || '#333333',
        padding: options.padding || 30,
        ...options
      };
      
      // Initialize properties
      this.graph = null;
      this.nodePositions = {};
      this.nodeStates = {};  // 'default', 'visited', 'path', 'start', 'end'
      this.edgeStates = {};  // 'default', 'path'
      
      // Set canvas size and prepare for rendering
      this.resizeCanvas();
    }
    
    /**
     * Resizes the canvas to its parent container size
     */
    resizeCanvas() {
      if (this.canvas.parentElement) {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = Math.max(
          300, 
          this.canvas.parentElement.clientHeight || this.canvas.width * 0.6
        );
      }
    }
    
    /**
     * Sets the graph to display
     * @param {Object} graph - The graph in adjacency list format
     */
    setGraph(graph) {
      this.graph = graph;
      this.nodeStates = {};
      this.edgeStates = {};
      
      // Calculate positions for nodes
      this.calculateNodePositions();
      
      // Render the graph
      this.render();
    }
    
    /**
     * Calculates positions for all nodes in the graph
     */
    calculateNodePositions() {
      const nodes = Object.keys(this.graph);
      const nodeCount = nodes.length;
      
      // Determine layout based on node count
      if (nodeCount <= 8) {
        // For small graphs, use a circular layout
        this.calculateCircularLayout(nodes);
      } else {
        // For larger graphs, use a force-directed layout
        this.calculateForceDirectedLayout(nodes);
      }
    }
    
    /**
     * Arranges nodes in a circle
     * @param {Array} nodes - Array of node names
     */
    calculateCircularLayout(nodes) {
      const nodeCount = nodes.length;
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      const radius = Math.min(centerX, centerY) - this.options.padding - this.options.nodeRadius;
      
      nodes.forEach((node, i) => {
        const angle = (i / nodeCount) * 2 * Math.PI;
        this.nodePositions[node] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
    }
    
    /**
     * Arranges nodes using a simplified force-directed layout
     * @param {Array} nodes - Array of node names
     */
    calculateForceDirectedLayout(nodes) {
      // Initial positions in a circle
      this.calculateCircularLayout(nodes);
      
      // Run 100 iterations of force-directed layout
      const iterations = 100;
      const k = 100; // Optimal distance
      
      for (let i = 0; i < iterations; i++) {
        // Calculate forces for each pair of nodes
        for (let a = 0; a < nodes.length; a++) {
          const nodeA = nodes[a];
          let fx = 0, fy = 0;
          
          for (let b = 0; b < nodes.length; b++) {
            if (a === b) continue;
            
            const nodeB = nodes[b];
            
            // Calculate distance between nodes
            const dx = this.nodePositions[nodeB].x - this.nodePositions[nodeA].x;
            const dy = this.nodePositions[nodeB].y - this.nodePositions[nodeA].y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            
            // Repulsive force between all nodes
            const repulsiveForce = k * k / distance;
            fx -= (dx / distance) * repulsiveForce;
            fy -= (dy / distance) * repulsiveForce;
            
            // Attractive force between connected nodes
            if (this.graph[nodeA][nodeB] !== undefined) {
              const attractiveForce = distance * distance / k;
              fx += (dx / distance) * attractiveForce;
              fy += (dy / distance) * attractiveForce;
            }
          }
          
          // Update position with damping
          const damping = 0.9;
          this.nodePositions[nodeA].x += fx * damping;
          this.nodePositions[nodeA].y += fy * damping;
          
          // Keep nodes within canvas bounds
          this.nodePositions[nodeA].x = Math.max(
            this.options.nodeRadius + this.options.padding,
            Math.min(this.canvas.width - this.options.nodeRadius - this.options.padding, 
                    this.nodePositions[nodeA].x)
          );
          this.nodePositions[nodeA].y = Math.max(
            this.options.nodeRadius + this.options.padding, 
            Math.min(this.canvas.height - this.options.nodeRadius - this.options.padding, 
                    this.nodePositions[nodeA].y)
          );
        }
      }
    }
    
    /**
     * Updates the display with algorithm results
     * @param {Object} result - The result from running Dijkstra's algorithm
     * @param {string} startNode - The start node
     * @param {string} endNode - The end node
     */
    updateWithResult(result, startNode, endNode) {
      if (!result || !this.graph) return;
      
      // Reset states
      this.nodeStates = {};
      this.edgeStates = {};
      
      // Set start and end nodes
      this.nodeStates[startNode] = 'start';
      this.nodeStates[endNode] = 'end';
      
      // Mark visited nodes
      if (result.visitOrder) {
        result.visitOrder.forEach(node => {
          if (node !== startNode && node !== endNode && !this.nodeStates[node]) {
            this.nodeStates[node] = 'visited';
          }
        });
      }
      
      // Mark path nodes and edges
      if (result.path && result.path.length > 0) {
        for (let i = 0; i < result.path.length - 1; i++) {
          const current = result.path[i];
          const next = result.path[i + 1];
          
          // Mark path node (except start/end)
          if (current !== startNode && current !== endNode) {
            this.nodeStates[current] = 'path';
          }
          
          // Mark path edge
          const edgeKey = `${current}-${next}`;
          this.edgeStates[edgeKey] = 'path';
        }
        
        // Make sure the last node in path is marked
        const lastNode = result.path[result.path.length - 1];
        if (lastNode !== startNode && lastNode !== endNode) {
          this.nodeStates[lastNode] = 'path';
        }
      }
      
      // Render the updated graph
      this.render();
    }
    
    /**
     * Renders the graph on the canvas
     */
    render() {
      if (!this.graph) return;
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw edges first
      this.drawEdges();
      
      // Draw nodes
      this.drawNodes();
      
      // Add a border to the canvas (optional)
      this.ctx.strokeStyle = '#ddd';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draws all edges in the graph
     */
    drawEdges() {
      for (const source in this.graph) {
        const sourcePos = this.nodePositions[source];
        
        for (const target in this.graph[source]) {
          const targetPos = this.nodePositions[target];
          const weight = this.graph[source][target];
          const edgeKey = `${source}-${target}`;
          const edgeState = this.edgeStates[edgeKey] || 'default';
          
          this.drawEdge(sourcePos, targetPos, weight, edgeState);
        }
      }
    }
    
    /**
     * Draws a single edge
     * @param {Object} sourcePos - Source node position
     * @param {Object} targetPos - Target node position
     * @param {number} weight - Edge weight
     * @param {string} state - Edge state ('default' or 'path')
     */
    drawEdge(sourcePos, targetPos, weight, state = 'default') {
      const ctx = this.ctx;
      
      // Set color based on state
      ctx.strokeStyle = state === 'path' 
        ? this.options.pathEdgeColor 
        : this.options.edgeColor;
      
      // Set line width
      ctx.lineWidth = state === 'path' ? 3 : 2;
      
      // Calculate direction vector
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate start and end points (adjusted for node radius)
      const startX = sourcePos.x + (dx / distance) * this.options.nodeRadius;
      const startY = sourcePos.y + (dy / distance) * this.options.nodeRadius;
      const endX = targetPos.x - (dx / distance) * this.options.nodeRadius;
      const endY = targetPos.y - (dy / distance) * this.options.nodeRadius;
      
      // Draw the edge
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Draw the weight
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      
      // Add slight offset to weight text
      const offsetX = dy / distance * 8;
      const offsetY = -dx / distance * 8;
      
      ctx.font = `${this.options.edgeFontSize}px Arial`;
      
      // Draw a background for the weight text
      const textWidth = ctx.measureText(weight).width;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(
        midX + offsetX - textWidth/2 - 2,
        midY + offsetY - this.options.edgeFontSize/2 - 2,
        textWidth + 4,
        this.options.edgeFontSize + 4
      );
      
      // Draw the weight text
      ctx.fillStyle = this.options.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(weight, midX + offsetX, midY + offsetY);
    }
    
    /**
     * Draws all nodes in the graph
     */
    drawNodes() {
      for (const node in this.nodePositions) {
        const pos = this.nodePositions[node];
        const state = this.nodeStates[node] || 'default';
        
        this.drawNode(pos.x, pos.y, node, state);
      }
    }
    
    /**
     * Draws a single node
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} label - Node label
     * @param {string} state - Node state
     */
    drawNode(x, y, label, state = 'default') {
      const ctx = this.ctx;
      
      // Determine color based on state
      let color;
      switch (state) {
        case 'start':
          color = this.options.startNodeColor;
          break;
        case 'end':
          color = this.options.endNodeColor;
          break;
        case 'path':
          color = this.options.pathNodeColor;
          break;
        case 'visited':
          color = this.options.visitedNodeColor;
          break;
        default:
          color = this.options.defaultNodeColor;
      }
      
      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, this.options.nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw label
      ctx.font = `bold ${this.options.nodeFontSize}px Arial`;
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    }
    
    /**
     * Creates an image of the graph
     * @returns {string} Data URL of the graph image
     */
    toImage() {
      return this.canvas.toDataURL('image/png');
    }
  }
  
  // Export for both Node.js and browser environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      StaticGraphDisplay
    };
  } else {
    window.StaticGraphDisplay = StaticGraphDisplay;
  }