// Main application code
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const subjectList = document.getElementById('subject-list');
    const selectedCountSpan = document.getElementById('selected-count');
    const selectionError = document.getElementById('selection-error');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    const visualizationContainer = document.getElementById('visualization-container');
    const friendMatchesContainer = document.getElementById('friend-matches');
    const chartContainer = document.getElementById('chart-container');
    
    // Application State
    let currentSelection = new Set(['english', 'mathematics']); // Compulsory subjects pre-selected
    let selectedSubjects = Array.from(subjectData.values()).filter(subject => subject.isCompulsory);
    
    // Initialize the UI
    function initializeUI() {
        renderSubjectList();
        updateSelectionCount();
        
        // Event listeners
        submitBtn.addEventListener('click', handleSubmit);
        resetBtn.addEventListener('click', handleReset);
    }
    
    // Render the subject list
    function renderSubjectList() {
        subjectList.innerHTML = '';
        
        // Converting Map to Array for iteration - O(n) where n is number of subjects
        Array.from(subjectData.values()).forEach(subject => {
            const listItem = document.createElement('li');
            listItem.className = 'subject-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `subject-${subject.id}`;
            checkbox.checked = subject.selected || currentSelection.has(subject.id);
            checkbox.disabled = subject.isCompulsory; // Disable compulsory subjects
            
            checkbox.addEventListener('change', () => {
                handleSubjectSelection(subject.id, checkbox.checked);
            });
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'subject-info';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'subject-name';
            nameSpan.textContent = subject.name;
            
            const descSpan = document.createElement('span');
            descSpan.className = 'subject-description';
            descSpan.textContent = subject.description;
            
            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(descSpan);
            
            listItem.appendChild(checkbox);
            listItem.appendChild(infoDiv);
            
            subjectList.appendChild(listItem);
        });
    }
    
    // Handle subject selection
    function handleSubjectSelection(subjectId, isSelected) {
        // Using Set operations for O(1) add/remove
        if (isSelected) {
            currentSelection.add(subjectId);
            selectedSubjects.push(subjectData.get(subjectId));
        } else {
            currentSelection.delete(subjectId);
            selectedSubjects = selectedSubjects.filter(s => s.id !== subjectId);
        }
        
        updateSelectionCount();
    }
    
    // Update the selection count and button state
    function updateSelectionCount() {
        const count = currentSelection.size;
        selectedCountSpan.textContent = count;
        
        // Enable submit button only when exactly 6 subjects are selected
        if (count === 6) {
            submitBtn.disabled = false;
            selectionError.style.display = 'none';
        } else {
            submitBtn.disabled = true;
            selectionError.style.display = 'block';
        }
    }
    
    // Handle form submission
    function handleSubmit() {
        // Show visualization
        visualizationContainer.style.display = 'block';
        
        // Generate visualizations
        generateFriendMatches();
        generateSubjectNetwork();
        
        // Scroll to visualization
        visualizationContainer.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Generate friend matches visualization
    function generateFriendMatches() {
        friendMatchesContainer.innerHTML = '';
        
        // Convert Set to Array for processing
        const selectedSubjectIds = Array.from(currentSelection);
        
        // Find matches between friends and selected subjects - O(n*m) where n is friends and m is subjects
        const friendMatches = friendsData.map(friend => {
            const commonSubjects = friend.getCommonSubjects(selectedSubjectIds);
            return {
                friend: friend,
                commonSubjects: commonSubjects,
                matchScore: commonSubjects.length / selectedSubjectIds.length
            };
        });
        
        // Sort by match score using quickSort algorithm - O(n log n)
        const sortedMatches = quickSort(friendMatches, 'matchScore');
        
        // Display top matches
        sortedMatches.slice(0, 5).forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'friend-match';
            
            const commonSubjectNames = match.commonSubjects.map(id => 
                subjectData.get(id)?.name || id
            ).join(', ');
            
            matchDiv.innerHTML = `
                <strong>${match.friend.name}</strong> is taking ${match.commonSubjects.length} of your subjects: 
                ${commonSubjectNames}
                <br>
                <small>${match.friend.personality}</small>
            `;
            
            friendMatchesContainer.appendChild(matchDiv);
        });
    }
    
    // Generate subject network visualization
    function generateSubjectNetwork() {
        // Clear previous chart
        chartContainer.innerHTML = '';
        
        // Create a container for selected subjects summary
        const selectedSubjectsContainer = document.createElement('div');
        selectedSubjectsContainer.className = 'selected-subjects-summary';
        selectedSubjectsContainer.style.marginBottom = '20px';
        selectedSubjectsContainer.style.padding = '15px';
        selectedSubjectsContainer.style.backgroundColor = '#f8f9fa';
        selectedSubjectsContainer.style.borderRadius = '8px';
        selectedSubjectsContainer.style.border = '1px solid #ddd';
        
        // Add a heading for selected subjects
        const selectedSubjectsHeading = document.createElement('h3');
        selectedSubjectsHeading.textContent = 'Your Selected Subjects';
        selectedSubjectsHeading.style.margin = '0 0 10px 0';
        selectedSubjectsHeading.style.color = '#6a5acd';
        selectedSubjectsContainer.appendChild(selectedSubjectsHeading);
        
        // Create a list of selected subjects
        const selectedSubjectsList = document.createElement('ul');
        selectedSubjectsList.style.display = 'flex';
        selectedSubjectsList.style.flexWrap = 'wrap';
        selectedSubjectsList.style.gap = '10px';
        selectedSubjectsList.style.listStyleType = 'none';
        selectedSubjectsList.style.padding = '0';
        selectedSubjectsList.style.margin = '0';
        
        // Add each selected subject as a pill
        Array.from(currentSelection).forEach(subjectId => {
            const subject = subjectData.get(subjectId);
            const subjectItem = document.createElement('li');
            subjectItem.style.backgroundColor = '#6a5acd';
            subjectItem.style.color = 'white';
            subjectItem.style.padding = '5px 15px';
            subjectItem.style.borderRadius = '20px';
            subjectItem.style.fontSize = '0.9rem';
            subjectItem.style.fontWeight = 'bold';
            subjectItem.textContent = subject.name;
            selectedSubjectsList.appendChild(subjectItem);
        });
        
        selectedSubjectsContainer.appendChild(selectedSubjectsList);
        chartContainer.appendChild(selectedSubjectsContainer);
        
        // Create a container for the subject network
        const networkContainer = document.createElement('div');
        networkContainer.className = 'network-container';
        chartContainer.appendChild(networkContainer);
        
        // Create a container for the friendship tree
        const treeContainer = document.createElement('div');
        treeContainer.id = 'friendship-tree';
        treeContainer.style.height = '600px'; // Match the height in visualization.js
        treeContainer.style.marginTop = '30px';
        chartContainer.appendChild(treeContainer);
        
        // Create SVG for the network visualization
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "400");
        svg.setAttribute("viewBox", "0 0 800 400");
        
        // Calculate subject connections based on friends taking the same subjects
        const subjectConnections = calculateSubjectConnections();
        
        // Create a node for each selected subject - O(n) where n is selected subjects
        const selectedSubjectIds = Array.from(currentSelection);
        const nodes = {};
        const nodeRadius = 40;
        
        // Position nodes in a circle
        const centerX = 400;
        const centerY = 200;
        const radius = 150;
        
        selectedSubjectIds.forEach((subjectId, index) => {
            const subject = subjectData.get(subjectId);
            const angle = (index / selectedSubjectIds.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            nodes[subjectId] = {x, y, subject};
            
            // Create node circle
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", nodeRadius);
            circle.setAttribute("fill", "#9370db");
            svg.appendChild(circle);
            
            // Create node text
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", x);
            text.setAttribute("y", y);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", "14px");
            text.textContent = subject.name;
            svg.appendChild(text);
        });
        
        // Create lines between subjects based on connection strength
        subjectConnections.forEach(connection => {
            if (connection.strength > 0) {
                const node1 = nodes[connection.subject1];
                const node2 = nodes[connection.subject2];
                
                if (node1 && node2) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                    line.setAttribute("x1", node1.x);
                    line.setAttribute("y1", node1.y);
                    line.setAttribute("x2", node2.x);
                    line.setAttribute("y2", node2.y);
                    line.setAttribute("stroke", "#6a5acd");
                    line.setAttribute("stroke-width", Math.max(1, connection.strength * 5));
                    line.setAttribute("stroke-opacity", 0.7);
                    
                    // Add line behind nodes
                    svg.insertBefore(line, svg.firstChild);
                    
                    // Add a title for hover tooltip
                    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
                    title.textContent = `${connection.strength * friendsData.length} friends take both ${node1.subject.name} and ${node2.subject.name}`;
                    line.appendChild(title);
                }
            }
        });
        
        networkContainer.appendChild(svg);
        
        // Create title for the network visualization
        const networkTitle = document.createElement('h3');
        networkTitle.textContent = 'Subject Network';
        networkTitle.style.textAlign = 'center';
        networkTitle.style.marginTop = '20px';
        networkContainer.insertBefore(networkTitle, networkContainer.firstChild);
        
        // Create subtitle explaining the visualization
        const networkSubtitle = document.createElement('p');
        networkSubtitle.textContent = 'Connections show how many friends take both subjects (thicker lines = more friends)';
        networkSubtitle.style.textAlign = 'center';
        networkSubtitle.style.fontSize = '0.9rem';
        networkSubtitle.style.color = '#666';
        networkContainer.insertBefore(networkSubtitle, networkContainer.children[1]);
        
        // Create friendship tree title
        const treeTitle = document.createElement('h3');
        treeTitle.textContent = 'Subject-Friend Connections';
        treeTitle.style.textAlign = 'center';
        treeTitle.style.marginBottom = '5px';
        chartContainer.insertBefore(treeTitle, treeContainer);
        
        // Add description below title
        const treeDescription = document.createElement('p');
        treeDescription.textContent = 'See which of your friends take the same subjects. Lines connect friends to subjects they\'re taking. Darker colors indicate more shared subjects.';
        treeDescription.style.textAlign = 'center';
        treeDescription.style.fontSize = '0.9rem';
        treeDescription.style.color = '#666';
        treeDescription.style.marginTop = '0';
        treeDescription.style.marginBottom = '15px';
        chartContainer.insertBefore(treeDescription, treeContainer);
        
        // Create tree visualization
        const selectedSubjects = Array.from(currentSelection);
        const friendshipTree = createFriendshipTree(selectedSubjects, friendsData);
        renderFriendshipTree(friendshipTree, 'friendship-tree');
    }
    
    // Calculate connections between subjects based on friends taking them
    function calculateSubjectConnections() {
        const selectedSubjectIds = Array.from(currentSelection);
        const connections = [];
        
        // Generate all pairs of subjects - O(n²) where n is number of selected subjects
        for (let i = 0; i < selectedSubjectIds.length; i++) {
            for (let j = i + 1; j < selectedSubjectIds.length; j++) {
                const subject1 = selectedSubjectIds[i];
                const subject2 = selectedSubjectIds[j];
                
                // Count how many friends take both subjects - O(m) where m is number of friends
                const friendsTakingBoth = friendsData.filter(friend => 
                    friend.isStudying(subject1) && friend.isStudying(subject2)
                ).length;
                
                connections.push({
                    subject1,
                    subject2,
                    strength: friendsTakingBoth / friendsData.length
                });
            }
        }
        
        return connections;
    }
    
    // Handle resetting the form (returning to selection screen)
    function handleReset() {
        // Hide visualization container
        visualizationContainer.style.display = 'none';
        
        // Keep current selections - don't reset to only compulsory subjects
        // The currentSelection Set and selectedSubjects array already contain the student's choices
        
        // Re-render the UI - this will show checkboxes with current selections
        renderSubjectList();
        updateSelectionCount();
        
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // QuickSort implementation for friend matches - O(n log n) average case
    function quickSort(arr, property, descending = true) {
        if (arr.length <= 1) {
            return arr;
        }
        
        const pivot = arr[Math.floor(arr.length / 2)];
        const pivotValue = pivot[property];
        
        const left = [];
        const middle = [];
        const right = [];
        
        for (let item of arr) {
            const itemValue = item[property];
            
            if (descending) {
                if (itemValue > pivotValue) left.push(item);
                else if (itemValue < pivotValue) right.push(item);
                else middle.push(item);
            } else {
                if (itemValue < pivotValue) left.push(item);
                else if (itemValue > pivotValue) right.push(item);
                else middle.push(item);
            }
        }
        
        return [...quickSort(left, property, descending), 
                ...middle, 
                ...quickSort(right, property, descending)];
    }
    
    // Initialize the application
    initializeUI();
});