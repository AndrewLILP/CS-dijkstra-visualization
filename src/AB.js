/**
 * @file AB.js
 * @description Utility for showing the weight between nodes A and B in a graph
 * @version 1.0.0
 */

/**
 * ABWeightDisplay class handles displaying the weight specifically between nodes A and B
 */
class ABWeightDisplay {
    /**
     * Creates a new ABWeightDisplay
     * @param {HTMLElement} container - The container element to place the display in
     * @param {Object} options - Options for configuring the display
     */
    constructor(container, options = {}) {
      this.container = container;
      this.options = {
        title: options.title || 'Weight between Node A and Node B',
        noPathMessage: options.noPathMessage || 'No direct edge exists between nodes A and B',
        ...options
      };
      
      // Create the display elements
      this.createDisplayElements();
      
      // Current graph reference
      this.graph = null;
    }
    
    /**
     * Creates the HTML elements for the A-B weight display
     * @private
     */
    createDisplayElements() {
      // Clear container
      this.container.innerHTML = '';
      
      // Create display container
      this.displayContainer = document.createElement('div');
      this.displayContainer.className = 'edge-weight-display';
      
      // Create header
      const header = document.createElement('h3');
      header.textContent = this.options.title;
      this.displayContainer.appendChild(header);
      
      // Create result display
      this.resultDisplay = document.createElement('div');
      this.resultDisplay.className = 'edge-weight-result';
      this.resultDisplay.textContent = 'Run the algorithm to view the weight between nodes A and B';
      
      this.displayContainer.appendChild(this.resultDisplay);
      
      // Add to container
      this.container.appendChild(this.displayContainer);
    }
    
    /**
     * Sets the graph for the A-B weight display
     * @param {Object} graph - The graph in adjacency list format
     */
    setGraph(graph) {
      this.graph = graph;
      this.updateDisplay();
    }
    
    /**
     * Updates the display with weight information between nodes A and B
     */
    updateDisplay() {
      if (!this.graph) {
        this.resultDisplay.textContent = 'No graph loaded. Run the algorithm first.';
        this.resultDisplay.className = 'edge-weight-result';
        return;
      }
      
      // Check if nodes A and B exist in the graph
      if (!this.graph['A'] || !this.graph['B']) {
        this.resultDisplay.textContent = 'Nodes A and/or B do not exist in this graph.';
        this.resultDisplay.className = 'edge-weight-result no-path';
        return;
      }
      
      // Check for direct edge from A to B
      if (this.graph['A']['B'] !== undefined) {
        const weight = this.graph['A']['B'];
        this.resultDisplay.textContent = `Direct path from A to B: Weight = ${weight}`;
        this.resultDisplay.className = 'edge-weight-result has-path';
        return;
      }
      
      // Check for direct edge from B to A (in case of directed graph)
      if (this.graph['B']['A'] !== undefined) {
        const weight = this.graph['B']['A'];
        this.resultDisplay.textContent = `Direct path from B to A: Weight = ${weight} (Reverse direction)`;
        this.resultDisplay.className = 'edge-weight-result has-path reverse';
        return;
      }
      
      // If no direct edge in either direction
      this.resultDisplay.textContent = this.options.noPathMessage;
      this.resultDisplay.className = 'edge-weight-result no-path';
    }
    
    /**
     * Updates the display when the algorithm result changes
     * @param {Object} result - The result from running Dijkstra's algorithm
     */
    updateWithResult(result) {
      this.updateDisplay();
      
      // Check if A-B edge is part of the shortest path
      if (!result || !result.path || !this.graph) return;
      
      // Only proceed if both A and B exist in the graph
      if (!this.graph['A'] || !this.graph['B']) return;
      
      // Check if A and B are consecutive in the path (direct edge in path)
      let isDirectEdgeInPath = false;
      
      for (let i = 0; i < result.path.length - 1; i++) {
        const current = result.path[i];
        const next = result.path[i + 1];
        
        if ((current === 'A' && next === 'B') || (current === 'B' && next === 'A')) {
          isDirectEdgeInPath = true;
          break;
        }
      }
      
      // Update display with path information
      if (isDirectEdgeInPath) {
        this.resultDisplay.classList.add('in-path');
        // Add to the existing text
        const currentText = this.resultDisplay.textContent;
        this.resultDisplay.textContent = `${currentText} (Part of shortest path)`;
      } else {
        this.resultDisplay.classList.remove('in-path');
        
        // If A and B are both in the path but not direct
        if (result.path.includes('A') && result.path.includes('B')) {
          // Add to the existing text
          const currentText = this.resultDisplay.textContent;
          this.resultDisplay.textContent = `${currentText} (A and B are in path but not directly connected)`;
        }
      }
    }
  }
  
  // Export for both Node.js and browser environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      ABWeightDisplay
    };
  } else {
    window.ABWeightDisplay = ABWeightDisplay;
  }