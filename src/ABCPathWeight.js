/**
 * @file ABCPathWeight.js
 * @description Utility for calculating and displaying the path weight between nodes A, B, and C in a graph
 * @version 1.0.0
 */

/**
 * ABCPathWeightCalculator class handles calculating and displaying the weight of the path A→B→C
 */
class ABCPathWeightCalculator {
    /**
     * Creates a new ABCPathWeightCalculator
     * @param {HTMLElement} container - The container element to place the display in
     * @param {Object} options - Options for configuring the display
     */
    constructor(container, options = {}) {
      this.container = container;
      this.options = {
        title: options.title || 'Path Weight: A → B → C',
        noPathMessage: options.noPathMessage || 'No complete path exists between nodes A, B, and C',
        partialPathMessage: options.partialPathMessage || 'Only partial path exists',
        ...options
      };
      
      // Create the display elements
      this.createDisplayElements();
      
      // Current graph reference
      this.graph = null;
      
      // Path weight calculation results
      this.pathResults = {
        hasPathAB: false,
        hasPathBC: false,
        hasFullPath: false,
        weightAB: Infinity,
        weightBC: Infinity,
        totalWeight: Infinity,
        path: []
      };
    }
    
    /**
     * Creates the HTML elements for the A-B-C path weight display
     * @private
     */
    createDisplayElements() {
      // Clear container
      this.container.innerHTML = '';
      
      // Create display container
      this.displayContainer = document.createElement('div');
      this.displayContainer.className = 'path-weight-display';
      
      // Create header
      const header = document.createElement('h3');
      header.textContent = this.options.title;
      this.displayContainer.appendChild(header);
      
      // Create result display
      this.resultDisplay = document.createElement('div');
      this.resultDisplay.className = 'path-weight-result';
      this.resultDisplay.textContent = 'Run the algorithm to view the path weight between nodes A, B, and C';
      
      // Create detailed breakdown section
      this.breakdownDisplay = document.createElement('div');
      this.breakdownDisplay.className = 'path-weight-breakdown';
      
      // Create visual path representation
      this.pathVisual = document.createElement('div');
      this.pathVisual.className = 'path-visual';
      
      // Add elements to container
      this.displayContainer.appendChild(this.resultDisplay);
      this.displayContainer.appendChild(this.breakdownDisplay);
      this.displayContainer.appendChild(this.pathVisual);
      
      // Add to container
      this.container.appendChild(this.displayContainer);
    }
    
    /**
     * Sets the graph for the ABC path weight calculator
     * @param {Object} graph - The graph in adjacency list format
     */
    setGraph(graph) {
      this.graph = graph;
      this.calculatePathWeight();
      this.updateDisplay();
    }
    
    /**
     * Calculates the path weight from A to C through B
     * Handles cases where direct paths might not exist
     * @returns {Object} Path calculation results
     */
    calculatePathWeight() {
      if (!this.graph) {
        this.pathResults = {
          hasPathAB: false,
          hasPathBC: false,
          hasFullPath: false,
          weightAB: Infinity,
          weightBC: Infinity,
          totalWeight: Infinity,
          path: []
        };
        return this.pathResults;
      }
      
      // Check if all required nodes exist in the graph
      const nodeA = this.graph['A'];
      const nodeB = this.graph['B'];
      const nodeC = this.graph['C'];
      
      // Reset path results
      this.pathResults = {
        hasPathAB: false,
        hasPathBC: false,
        hasFullPath: false,
        weightAB: Infinity,
        weightBC: Infinity,
        totalWeight: Infinity,
        path: []
      };
      
      // Add nodes to path for visualization
      this.pathResults.path.push('A');
      
      // Check if node A exists
      if (!nodeA) {
        return this.pathResults;
      }
      
      // Check for direct path from A to B
      if (nodeA && nodeB !== undefined && this.graph['A']['B'] !== undefined) {
        this.pathResults.hasPathAB = true;
        this.pathResults.weightAB = this.graph['A']['B'];
        this.pathResults.path.push('B');
      } else {
        return this.pathResults;
      }
      
      // Check if node B exists
      if (!this.graph['B']) {
        return this.pathResults;
      }
      
      // Check for direct path from B to C
      if (nodeB && nodeC !== undefined && this.graph['B']['C'] !== undefined) {
        this.pathResults.hasPathBC = true;
        this.pathResults.weightBC = this.graph['B']['C'];
        this.pathResults.path.push('C');
        
        // Calculate total weight of the path A→B→C
        this.pathResults.hasFullPath = true;
        this.pathResults.totalWeight = this.pathResults.weightAB + this.pathResults.weightBC;
      }
      
      return this.pathResults;
    }
    
    /**
     * Updates the display with path weight information
     */
    updateDisplay() {
      // Clear previous displays
      this.resultDisplay.innerHTML = '';
      this.breakdownDisplay.innerHTML = '';
      this.pathVisual.innerHTML = '';
      
      // Reset CSS classes
      this.resultDisplay.className = 'path-weight-result';
      
      if (!this.graph) {
        this.resultDisplay.textContent = 'No graph loaded. Run the algorithm first.';
        return;
      }
      
      // Check if all nodes A, B, and C exist in the graph
      if (!this.graph['A'] || !this.graph['B'] || !this.graph['C']) {
        const missingNodes = [];
        if (!this.graph['A']) missingNodes.push('A');
        if (!this.graph['B']) missingNodes.push('B');
        if (!this.graph['C']) missingNodes.push('C');
        
        this.resultDisplay.textContent = `Nodes ${missingNodes.join(', ')} do not exist in this graph.`;
        this.resultDisplay.classList.add('no-path');
        return;
      }
      
      // Display results based on path existence
      if (this.pathResults.hasFullPath) {
        // Full path exists
        this.resultDisplay.textContent = `Complete path from A to C through B exists with total weight = ${this.pathResults.totalWeight}`;
        this.resultDisplay.classList.add('has-path');
        
        // Create detailed breakdown
        this.createBreakdown();
        
        // Create visual representation
        this.createPathVisual();
      } else if (this.pathResults.hasPathAB) {
        // Only A→B path exists
        this.resultDisplay.textContent = `Path from A to B exists (weight = ${this.pathResults.weightAB}), but no path from B to C.`;
        this.resultDisplay.classList.add('partial-path');
        
        // Create partial breakdown
        this.createPartialBreakdown();
        
        // Create partial visual representation
        this.createPathVisual(true);
      } else {
        // No path exists
        this.resultDisplay.textContent = this.options.noPathMessage;
        this.resultDisplay.classList.add('no-path');
      }
    }
    
    /**
     * Creates a detailed breakdown of the path weights
     */
    createBreakdown() {
      const breakdownList = document.createElement('ul');
      breakdownList.className = 'weight-breakdown-list';
      
      // A→B segment
      const segmentAB = document.createElement('li');
      segmentAB.innerHTML = `<strong>A → B:</strong> Weight = ${this.pathResults.weightAB}`;
      breakdownList.appendChild(segmentAB);
      
      // B→C segment
      const segmentBC = document.createElement('li');
      segmentBC.innerHTML = `<strong>B → C:</strong> Weight = ${this.pathResults.weightBC}`;
      breakdownList.appendChild(segmentBC);
      
      // Total
      const total = document.createElement('li');
      total.className = 'total-weight';
      total.innerHTML = `<strong>Total:</strong> ${this.pathResults.weightAB} + ${this.pathResults.weightBC} = ${this.pathResults.totalWeight}`;
      breakdownList.appendChild(total);
      
      this.breakdownDisplay.appendChild(breakdownList);
    }
    
    /**
     * Creates a partial breakdown when only part of the path exists
     */
    createPartialBreakdown() {
      const breakdownList = document.createElement('ul');
      breakdownList.className = 'weight-breakdown-list';
      
      // A→B segment
      const segmentAB = document.createElement('li');
      segmentAB.innerHTML = `<strong>A → B:</strong> Weight = ${this.pathResults.weightAB}`;
      breakdownList.appendChild(segmentAB);
      
      // B→C segment - missing
      const segmentBC = document.createElement('li');
      segmentBC.className = 'missing-segment';
      segmentBC.innerHTML = `<strong>B → C:</strong> No direct path exists`;
      breakdownList.appendChild(segmentBC);
      
      // Total - incomplete
      const total = document.createElement('li');
      total.className = 'incomplete-path';
      total.innerHTML = `<strong>Total:</strong> Path incomplete`;
      breakdownList.appendChild(total);
      
      this.breakdownDisplay.appendChild(breakdownList);
    }
    
    /**
     * Creates a visual representation of the path
     * @param {boolean} partial - Whether to show a partial path
     */
    createPathVisual(partial = false) {
      const visualPath = document.createElement('div');
      visualPath.className = 'path-visual-inner';
      
      // Add path segments with nodes and arrows
      const nodes = partial ? ['A', 'B'] : ['A', 'B', 'C'];
      
      for (let i = 0; i < nodes.length; i++) {
        // Create node
        const nodeElem = document.createElement('div');
        nodeElem.className = 'path-node';
        nodeElem.textContent = nodes[i];
        visualPath.appendChild(nodeElem);
        
        // Create edge/arrow (except after the last node)
        if (i < nodes.length - 1) {
          const edgeElem = document.createElement('div');
          edgeElem.className = 'path-edge';
          
          // Add weight to the edge
          let weight = i === 0 ? this.pathResults.weightAB : this.pathResults.weightBC;
          
          // Create arrow with weight
          const arrow = document.createElement('div');
          arrow.className = 'path-arrow';
          arrow.innerHTML = `<span class="edge-weight">${weight}</span>`;
          
          edgeElem.appendChild(arrow);
          visualPath.appendChild(edgeElem);
        }
      }
      
      // If path is partial, add a "missing" indicator
      if (partial) {
        const missingElem = document.createElement('div');
        missingElem.className = 'path-missing';
        missingElem.textContent = '?';
        
        const missingEdge = document.createElement('div');
        missingEdge.className = 'path-edge missing';
        
        // Create dashed arrow
        const missingArrow = document.createElement('div');
        missingArrow.className = 'path-arrow dashed';
        missingArrow.innerHTML = '<span class="edge-weight">missing</span>';
        
        missingEdge.appendChild(missingArrow);
        
        visualPath.appendChild(missingEdge);
        visualPath.appendChild(missingElem);
      }
      
      this.pathVisual.appendChild(visualPath);
    }
    
    /**
     * Updates the display when the algorithm result changes
     * @param {Object} result - The result from running Dijkstra's algorithm
     */
    updateWithResult(result) {
      // Recalculate path weights in case the graph has changed
      this.calculatePathWeight();
      
      // Update the display
      this.updateDisplay();
      
      // Highlight if path A→B→C is part of the shortest path from the algorithm
      if (!result || !result.path || !this.graph) return;
      
      // Check if A, B, and C are consecutive in the path (direct path in result)
      let isInShortestPath = false;
      
      for (let i = 0; i < result.path.length - 2; i++) {
        const current = result.path[i];
        const next = result.path[i + 1];
        const nextNext = result.path[i + 2];
        
        if (current === 'A' && next === 'B' && nextNext === 'C') {
          isInShortestPath = true;
          break;
        }
      }
      
      // Update display with path information
      if (isInShortestPath) {
        const pathNote = document.createElement('div');
        pathNote.className = 'path-note in-shortest-path';
        pathNote.textContent = '✓ This path is part of the shortest path from the algorithm!';
        this.resultDisplay.appendChild(pathNote);
      }
    }
    
    /**
     * Creates a step-by-step explanation of how the path weight is calculated
     * @returns {Array<string>} Array of explanation steps
     */
    createExplanation() {
      const explanation = [];
      
      // Start with the algorithm description
      explanation.push('Path Weight Algorithm Explanation:');
      explanation.push('1. Check if nodes A, B, and C exist in the graph');
      
      if (!this.graph || !this.graph['A'] || !this.graph['B'] || !this.graph['C']) {
        // Handle missing nodes
        const missingNodes = [];
        if (!this.graph) {
          explanation.push('No graph is loaded.');
          return explanation;
        }
        
        if (!this.graph['A']) missingNodes.push('A');
        if (!this.graph['B']) missingNodes.push('B');
        if (!this.graph['C']) missingNodes.push('C');
        
        explanation.push(`The nodes ${missingNodes.join(', ')} do not exist in the graph.`);
        explanation.push('Cannot calculate path weight with missing nodes.');
        return explanation;
      }
      
      // Continue explanation
      explanation.push('2. Check if there is a direct edge from A to B');
      
      if (this.pathResults.hasPathAB) {
        explanation.push(`Found direct edge from A to B with weight = ${this.pathResults.weightAB}`);
      } else {
        explanation.push('No direct edge exists from A to B.');
        explanation.push('Cannot form a path A→B→C without a direct A to B connection.');
        return explanation;
      }
      
      explanation.push('3. Check if there is a direct edge from B to C');
      
      if (this.pathResults.hasPathBC) {
        explanation.push(`Found direct edge from B to C with weight = ${this.pathResults.weightBC}`);
      } else {
        explanation.push('No direct edge exists from B to C.');
        explanation.push('Cannot form a complete path A→B→C without a direct B to C connection.');
        return explanation;
      }
      
      explanation.push('4. Calculate the total weight of the path A→B→C');
      explanation.push(`   Weight(A→B) + Weight(B→C) = ${this.pathResults.weightAB} + ${this.pathResults.weightBC} = ${this.pathResults.totalWeight}`);
      
      explanation.push('5. Path A→B→C exists with total weight = ' + this.pathResults.totalWeight);
      
      return explanation;
    }
  }
  
  // Export for both Node.js and browser environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      ABCPathWeightCalculator
    };
  } else {
    window.ABCPathWeightCalculator = ABCPathWeightCalculator;
  }