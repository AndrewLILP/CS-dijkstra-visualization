// Tree and Graph Visualization Components
class TreeNode {
    constructor(value) {
        this.value = value;
        this.children = [];
    }

    addChild(child) {
        this.children.push(child);
    }
}

// Create a friendship tree based on common subjects
function createFriendshipTree(selectedSubjects, friends) {
    // Create the root node (the student)
    const root = new TreeNode({
        id: 'student',
        name: 'You',
        type: 'student',
        subjects: selectedSubjects,
        // Get the subject names from the IDs
        subjectNames: selectedSubjects.map(id => subjectData.get(id).name)
    });
    
    // Group friends by the number of common subjects they have with the student
    const friendGroups = {};
    
    friends.forEach(friend => {
        const commonSubjects = friend.getCommonSubjects(selectedSubjects);
        const groupKey = commonSubjects.length;
        
        if (!friendGroups[groupKey]) {
            friendGroups[groupKey] = [];
        }
        
        // Get names of common subjects
        const commonSubjectNames = commonSubjects.map(id => subjectData.get(id).name);
        
        friendGroups[groupKey].push({
            friend,
            commonSubjects,
            commonSubjectNames
        });
    });
    
    // Sort groups by number of common subjects (descending)
    const sortedGroups = Object.keys(friendGroups)
        .map(Number)
        .sort((a, b) => b - a);
    
    // Create group nodes for different levels of connection
    sortedGroups.forEach(groupSize => {
        if (groupSize > 0) { // Only include friends with at least one common subject
            // For each unique combination of subjects, create a group
            const subjectCombinations = {};
            
            friendGroups[groupSize].forEach(({friend, commonSubjects, commonSubjectNames}) => {
                // Create a key from the sorted subject IDs to group friends with exactly the same subjects
                const key = [...commonSubjects].sort().join(',');
                
                if (!subjectCombinations[key]) {
                    subjectCombinations[key] = {
                        subjects: commonSubjects,
                        subjectNames: commonSubjectNames,
                        friends: []
                    };
                }
                
                subjectCombinations[key].friends.push(friend);
            });
            
            // Create a group node for each unique subject combination
            Object.entries(subjectCombinations).forEach(([key, data]) => {
                const groupNode = new TreeNode({
                    id: `group-${key}`,
                    name: `${groupSize} Common: ${data.subjectNames.join(', ')}`,
                    type: 'group',
                    commonSubjects: groupSize,
                    subjectNames: data.subjectNames
                });
                
                root.addChild(groupNode);
                
                // Add friends to the group node
                data.friends.forEach(friend => {
                    const friendNode = new TreeNode({
                        id: `friend-${friend.id}`,
                        name: friend.name,
                        type: 'friend',
                        friend: friend,
                        commonSubjects: data.subjects,
                        commonSubjectNames: data.subjectNames
                    });
                    
                    groupNode.addChild(friendNode);
                });
            });
        }
    });
    
    return root;
}

// Render the friendship network as an SVG (subjects on left, friends on right)
function renderFriendshipTree(treeRoot, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const svgWidth = container.clientWidth;
    const svgHeight = 780; // Taller to fit all friends
    const nodeRadius = 30;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    
    // Calculate positions for subjects (left side)
    const selectedSubjectIds = treeRoot.value.subjects;
    const subjectNodes = {};
    const leftMargin = 150;
    const rightMargin = svgWidth - 150;
    
    // Position subjects evenly on the left side
    selectedSubjectIds.forEach((subjectId, index) => {
        const subject = subjectData.get(subjectId);
        const y = 80 + index * (svgHeight - 100) / (selectedSubjectIds.length - 1);
        
        subjectNodes[subjectId] = {
            id: subjectId,
            name: subject.name,
            x: leftMargin,
            y: y,
            type: 'subject'
        };
    });
    
    // Calculate positions for friends (right side)
    const friendsData = treeRoot.children.flatMap(groupNode => 
        groupNode.children.map(friendNode => friendNode.value.friend)
    );
    
    // Ensure all 10 friends are included, even if not connected
    const allFriends = [...friendsData];
    friendsData.forEach(friend => {
        if (!allFriends.some(f => f.id === friend.id)) {
            allFriends.push(friend);
        }
    });
    
    // Get all 10 friends if not all included
    if (allFriends.length < 10) {
        window.friendsData.forEach(friend => {
            if (!allFriends.some(f => f.id === friend.id)) {
                allFriends.push(friend);
            }
        });
    }
    
    // Position friends evenly on the right side
    const friendNodes = {};
    allFriends.forEach((friend, index) => {
        const y = 50 + index * (svgHeight - 100) / (allFriends.length - 1);
        
        friendNodes[friend.id] = {
            id: friend.id,
            name: friend.name,
            x: rightMargin,
            y: y,
            type: 'friend',
            friend: friend
        };
    });
    
    // Draw connection lines first (so they're behind nodes)
    selectedSubjectIds.forEach(subjectId => {
        const subjectNode = subjectNodes[subjectId];
        
        Object.values(friendNodes).forEach(friendNode => {
            const friend = friendNode.friend;
            
            // Check if friend is taking this subject
            if (friend.subjectSet.has(subjectId)) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", subjectNode.x);
                line.setAttribute("y1", subjectNode.y);
                line.setAttribute("x2", friendNode.x);
                line.setAttribute("y2", friendNode.y);
                line.setAttribute("stroke", "#6a5acd");
                line.setAttribute("stroke-width", 2);
                line.setAttribute("stroke-opacity", 0.6);
                svg.appendChild(line);
                
                // Add title for tooltip
                const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
                title.textContent = `${friendNode.name} takes ${subjectNode.name}`;
                line.appendChild(title);
            }
        });
    });
    
    // Draw subject nodes
    Object.values(subjectNodes).forEach(node => {
        // Create node circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", nodeRadius);
        circle.setAttribute("fill", "#4682B4"); // Steel blue for subjects
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", 2);
        svg.appendChild(circle);
        
        // Create node text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "12px");
        text.textContent = node.name;
        svg.appendChild(text);
        
        // Add title for tooltip
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = node.name;
        circle.appendChild(title);
    });
    
    // Draw friend nodes
    Object.values(friendNodes).forEach(node => {
        // Calculate how many subjects this friend shares with the selection
        const friend = node.friend;
        const commonSubjectsCount = selectedSubjectIds.filter(id => friend.subjectSet.has(id)).length;
        
        // Create node circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", nodeRadius);
        
        // Color based on number of common subjects
        let fillColor;
        if (commonSubjectsCount === 0) {
            fillColor = "#cccccc"; // Gray for no common subjects
        } else if (commonSubjectsCount <= 2) {
            fillColor = "#9370db"; // Light purple for 1-2 common subjects
        } else if (commonSubjectsCount <= 4) {
            fillColor = "#6a5acd"; // Medium purple for 3-4 common subjects
        } else {
            fillColor = "#483d8b"; // Dark purple for 5-6 common subjects
        }
        
        circle.setAttribute("fill", fillColor);
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("stroke-width", 2);
        svg.appendChild(circle);
        
        // Create node text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("font-size", "12px");
        text.textContent = node.name;
        svg.appendChild(text);
        
        // Add title for tooltip with personality and common subjects
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        const commonSubjects = selectedSubjectIds
            .filter(id => friend.subjectSet.has(id))
            .map(id => subjectData.get(id).name);
        
        title.textContent = `${node.name}: ${friend.personality}
Common subjects (${commonSubjectsCount}): ${commonSubjects.join(', ')}`;
        circle.appendChild(title);
    });
    
    // Create labels for each side
    const subjectsLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    subjectsLabel.setAttribute("x", leftMargin);
    subjectsLabel.setAttribute("y", 30);
    subjectsLabel.setAttribute("text-anchor", "middle");
    subjectsLabel.setAttribute("font-size", "16px");
    subjectsLabel.setAttribute("font-weight", "bold");
    subjectsLabel.setAttribute("fill", "#333");
    subjectsLabel.textContent = "Your Subjects";
    svg.appendChild(subjectsLabel);
    
    const friendsLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    friendsLabel.setAttribute("x", rightMargin);
    friendsLabel.setAttribute("y", 30);
    friendsLabel.setAttribute("text-anchor", "middle");
    friendsLabel.setAttribute("font-size", "16px");
    friendsLabel.setAttribute("font-weight", "bold");
    friendsLabel.setAttribute("fill", "#333");
    friendsLabel.textContent = "Your Friends";
    svg.appendChild(friendsLabel);
    
    // Add a legend
    const legendX = svgWidth / 2;
    const legendY = svgHeight - 30;
    
    // Legend title
    const legendTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
    legendTitle.setAttribute("x", legendX);
    legendTitle.setAttribute("y", legendY - 40);
    legendTitle.setAttribute("text-anchor", "middle");
    legendTitle.setAttribute("font-size", "14px");
    legendTitle.setAttribute("font-weight", "bold");
    legendTitle.setAttribute("fill", "#333");
    legendTitle.textContent = "Friend Color Legend (Shared Subjects)";
    svg.appendChild(legendTitle);
    
    // Legend items
    const legendItems = [
        { color: "#cccccc", text: "0 subjects" },
        { color: "#9370db", text: "1-2 subjects" },
        { color: "#6a5acd", text: "3-4 subjects" },
        { color: "#483d8b", text: "5-6 subjects" }
    ];
    
    const itemWidth = 120;
    const startX = legendX - (itemWidth * legendItems.length) / 2;
    
    legendItems.forEach((item, index) => {
        const x = startX + index * itemWidth;
        
        // Circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", legendY);
        circle.setAttribute("r", 8);
        circle.setAttribute("fill", item.color);
        svg.appendChild(circle);
        
        // Text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x + 15);
        text.setAttribute("y", legendY);
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("font-size", "12px");
        text.setAttribute("fill", "#333");
        text.textContent = item.text;
        svg.appendChild(text);
    });
    
    container.appendChild(svg);
    
    return svg;
}

// Graph class for representing subject relationships
class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }
    
    // Add vertex to the graph - O(1)
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    
    // Add edge between vertices - O(1)
    addEdge(vertex1, vertex2, weight = 1) {
        if (!this.adjacencyList.has(vertex1)) {
            this.addVertex(vertex1);
        }
        if (!this.adjacencyList.has(vertex2)) {
            this.addVertex(vertex2);
        }
        
        this.adjacencyList.get(vertex1).push({ node: vertex2, weight });
        this.adjacencyList.get(vertex2).push({ node: vertex1, weight });
    }
    
    // Find the shortest path between two vertices using Dijkstra's algorithm - O((V + E) log V)
    findShortestPath(startVertex, endVertex) {
        const distances = new Map();
        const previous = new Map();
        const priorityQueue = new PriorityQueue();
        
        // Initialize distances map
        for (let vertex of this.adjacencyList.keys()) {
            if (vertex === startVertex) {
                distances.set(vertex, 0);
                priorityQueue.enqueue(vertex, 0);
            } else {
                distances.set(vertex, Infinity);
                priorityQueue.enqueue(vertex, Infinity);
            }
            previous.set(vertex, null);
        }
        
        // Main loop
        while (!priorityQueue.isEmpty()) {
            const { element: currentVertex } = priorityQueue.dequeue();
            
            if (currentVertex === endVertex) {
                // Reached the target vertex
                break;
            }
            
            if (distances.get(currentVertex) === Infinity) {
                // No path to this vertex
                break;
            }
            
            // Check neighbors
            for (let neighbor of this.adjacencyList.get(currentVertex)) {
                const candidate = distances.get(currentVertex) + neighbor.weight;
                
                if (candidate < distances.get(neighbor.node)) {
                    // Found a better path
                    distances.set(neighbor.node, candidate);
                    previous.set(neighbor.node, currentVertex);
                    priorityQueue.enqueue(neighbor.node, candidate);
                }
            }
        }
        
        // Build path
        const path = [];
        let current = endVertex;
        
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }
        
        return {
            distance: distances.get(endVertex),
            path: path.length > 1 ? path : []
        };
    }
}

// Priority Queue implementation for Dijkstra's algorithm
class PriorityQueue {
    constructor() {
        this.values = [];
    }
    
    enqueue(element, priority) {
        this.values.push({ element, priority });
        this.sort();
    }
    
    dequeue() {
        return this.values.shift();
    }
    
    sort() {
        this.values.sort((a, b) => a.priority - b.priority);
    }
    
    isEmpty() {
        return this.values.length === 0;
    }
}

// Create a subject relationship graph
function createSubjectGraph(subjectData, friendsData) {
    const graph = new Graph();
    
    // Add all subjects as vertices
    for (let subjectId of subjectData.keys()) {
        graph.addVertex(subjectId);
    }
    
    // Create edges based on how many friends take both subjects
    for (let i = 0; i < Array.from(subjectData.keys()).length; i++) {
        const subject1 = Array.from(subjectData.keys())[i];
        
        for (let j = i + 1; j < Array.from(subjectData.keys()).length; j++) {
            const subject2 = Array.from(subjectData.keys())[j];
            
            // Count friends taking both subjects
            const commonFriends = friendsData.filter(friend => 
                friend.isStudying(subject1) && friend.isStudying(subject2)
            ).length;
            
            if (commonFriends > 0) {
                // Use inverse of common friends as weight (more friends = stronger connection = lower weight)
                const weight = 1 / commonFriends;
                graph.addEdge(subject1, subject2, weight);
            }
        }
    }
    
    return graph;
}