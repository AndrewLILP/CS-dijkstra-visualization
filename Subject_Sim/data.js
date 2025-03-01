// Subject data - Using a Map data structure for O(1) lookup time
const subjectData = new Map([
    ["english", {
        id: "english",
        name: "English",
        description: "Compulsory subject focusing on literature, language, and communication skills.",
        isCompulsory: true,
        selected: true
    }],
    ["mathematics", {
        id: "mathematics",
        name: "Mathematics",
        description: "Compulsory subject covering algebra, calculus, and statistical analysis.",
        isCompulsory: true,
        selected: true
    }],
    ["biology", {
        id: "biology",
        name: "Biology",
        description: "Study of living organisms, cells, genetics, and ecosystems.",
        isCompulsory: false,
        selected: false
    }],
    ["chemistry", {
        id: "chemistry",
        name: "Chemistry",
        description: "Study of matter, atoms, chemical reactions, and their applications.",
        isCompulsory: false,
        selected: false
    }],
    ["physics", {
        id: "physics",
        name: "Physics",
        description: "Study of energy, forces, motion, and the fundamental laws of nature.",
        isCompulsory: false,
        selected: false
    }],
    ["history", {
        id: "history",
        name: "History",
        description: "Analysis of past events, civilizations, and their impact on the modern world.",
        isCompulsory: false,
        selected: false
    }],
    ["geography", {
        id: "geography",
        name: "Geography",
        description: "Study of physical features, climate, populations, and human environments.",
        isCompulsory: false,
        selected: false
    }],
    ["business", {
        id: "business",
        name: "Business Studies",
        description: "Examination of business operations, management, marketing, and finance.",
        isCompulsory: false,
        selected: false
    }],
    ["economics", {
        id: "economics",
        name: "Economics",
        description: "Study of resource allocation, markets, and economic theories and systems.",
        isCompulsory: false,
        selected: false
    }],
    ["visualarts", {
        id: "visualarts",
        name: "Visual Arts",
        description: "Creation and analysis of artworks using various media and techniques.",
        isCompulsory: false,
        selected: false
    }],
    ["music", {
        id: "music",
        name: "Music",
        description: "Theory, composition, performance, and appreciation of musical works.",
        isCompulsory: false,
        selected: false
    }],
    ["drama", {
        id: "drama",
        name: "Drama",
        description: "Performance, scriptwriting, and analysis of theatrical works.",
        isCompulsory: false,
        selected: false
    }]
]);

// Friend data with subject selections - Using a class-based approach
class Friend {
    constructor(id, name, subjects, personality) {
        this.id = id;
        this.name = name;
        this.subjects = subjects; // Array of subject IDs
        this.personality = personality; // Brief personality description
    }
    
    // Method to check if friend is taking a specific subject - O(1) lookup time with Set
    isStudying(subjectId) {
        return this.subjectSet.has(subjectId);
    }
    
    // Getter for subject set to improve lookup performance
    get subjectSet() {
        if (!this._subjectSet) {
            this._subjectSet = new Set(this.subjects);
        }
        return this._subjectSet;
    }
    
    // Method to find common subjects with a student - O(n) where n is number of subjects
    getCommonSubjects(studentSubjects) {
        return studentSubjects.filter(subject => this.subjectSet.has(subject));
    }
}

// Create friends array using the Friend class
const friendsData = [
    new Friend(1, "Alex", ["english", "mathematics", "physics", "chemistry", "economics", "history"], 
               "Ambitious and analytical, dreams of becoming an engineer"),
    new Friend(2, "Zoe", ["english", "mathematics", "biology", "chemistry", "visualarts", "history"], 
               "Creative and thoughtful, loves both science and art"),
    new Friend(3, "Marcus", ["english", "mathematics", "business", "economics", "geography", "history"], 
               "Future entrepreneur with a passion for current events"),
    new Friend(4, "Jasmine", ["english", "mathematics", "biology", "chemistry", "physics", "music"], 
               "Brilliant musician who also excels in sciences"),
    new Friend(5, "Tyler", ["english", "mathematics", "drama", "visualarts", "music", "history"], 
               "Born performer with a flair for creative expression"),
    new Friend(6, "Olivia", ["english", "mathematics", "biology", "geography", "business", "economics"], 
               "Practical and organized, interested in sustainable business"),
    new Friend(7, "Ethan", ["english", "mathematics", "physics", "chemistry", "music", "drama"], 
               "Quirky and intelligent, balances technical and artistic interests"),
    new Friend(8, "Sofia", ["english", "mathematics", "biology", "visualarts", "drama", "geography"], 
               "Environmentally conscious with a talent for visual storytelling"),
    new Friend(9, "Noah", ["english", "mathematics", "physics", "business", "economics", "geography"], 
               "Strategic thinker who loves solving complex problems"),
    new Friend(10, "Maya", ["english", "mathematics", "chemistry", "visualarts", "history", "drama"], 
               "History buff with a creative approach to learning")
];