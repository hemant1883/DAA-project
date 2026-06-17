# CompressionBuilder – Huffman Coding & Optimal Merge Pattern

A premium web application demonstrating **Huffman Coding** and **Optimal Merge Pattern** algorithms with beautiful visualizations.

## 🚀 Features

- **Huffman Coding Compression**
  - Build frequency table from input text
  - Construct Huffman tree
  - Generate optimal encoding
  - Calculate compression ratio
  
- **Optimal Merge Pattern**
  - Simulate file merging with minimum cost
  - Track merge operations step-by-step
  - Calculate total merge cost

- **Interactive Visualizations**
  - Animated Huffman tree rendering
  - Color-coded nodes (leaf vs internal)
  - Step-by-step merge visualization
  - Real-time statistics

- **Premium UI/UX**
  - Glassmorphism design
  - Animated starfield background
  - Smooth transitions and micro-animations
  - Responsive layout

## 📁 Project Structure

```
DAAProject/
├── huffman.cpp          # C++ backend (Huffman + Optimal Merge)
├── index.html           # Main HTML structure
├── style.css            # Premium styling with animations
├── script.js            # Frontend logic and visualization
└── README.md            # This file
```

## 🛠️ Setup & Usage

### Prerequisites

- C++ compiler (g++ with C++11 support)
- Node.js and npm (for running the backend server)

### Setup Steps

1. **Install Dependencies**
   ```bash
   cd DAAProject
   npm install
   ```

2. **Compile C++ Backend**
   ```bash
   g++ -o huffman.exe huffman.cpp -std=c++11
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Open the Application**
   - Server will start at `http://localhost:3000`
   - Open your browser and navigate to `http://localhost:3000`
   - Or simply open the URL shown in the terminal

### Usage

1. Enter or paste your text in the input area
2. Click "Compress & Analyze" button
3. The frontend sends text to Node.js server
4. Server executes the C++ program
5. Results are displayed with:
   - Compression statistics
   - Huffman codes for each character
   - Interactive tree visualization
   - Optimal merge pattern steps
   - Binary encoded output

### How It Works

```
Frontend (HTML/CSS/JS) 
    ↓ HTTP POST
Node.js Server (server.js)
    ↓ Execute
C++ Backend (huffman.exe)
    ↓ JSON Output
Node.js Server
    ↓ HTTP Response
Frontend (Display Results)
```

The **entire algorithm logic runs in C++**, ensuring optimal performance and meeting the project requirements.

## 🎨 Technologies Used

- **Backend Algorithm:** C++ (Huffman Coding, Optimal Merge Pattern)
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Design:** Glassmorphism, Gradients, CSS Animations
- **Fonts:** Google Fonts (Inter)

## 📊 How It Works

### Huffman Coding

1. **Frequency Analysis:** Count occurrence of each character
2. **Tree Construction:** Build binary tree using priority queue
3. **Code Generation:** Traverse tree to assign binary codes
4. **Compression:** Replace characters with their codes
5. **Ratio Calculation:** Compare original vs compressed size

### Optimal Merge Pattern

1. **Sort Files:** Arrange in ascending order
2. **Greedy Merge:** Always merge two smallest files
3. **Track Cost:** Sum of merged file sizes
4. **Iterate:** Repeat until one file remains

## 🎯 Algorithm Complexity

- **Huffman Coding:** O(n log n) where n is number of unique characters
- **Optimal Merge:** O(n log n) where n is number of files

## 💡 Sample Inputs

Try these sample texts to see different compression ratios:

- `"hello world hello"`
- `"aaaaabbbbbcccccddddd"`
- `"the quick brown fox jumps over the lazy dog"`
- Any text from a file or article

## 🌟 Key Highlights

- **Visual Excellence:** Premium design with smooth animations
- **Educational:** Clear visualization of algorithm steps
- **Interactive:** Real-time compression and analysis
- **Responsive:** Works on desktop, tablet, and mobile

## 📝 Notes

- Currently uses JavaScript implementation for instant results
- C++ backend included for performance-critical scenarios
- Can be extended to support file upload
- Suitable for DAA (Design and Analysis of Algorithms) coursework

## 🔧 Future Enhancements

- File upload support (.txt, .pdf, etc.)
- Download compressed output
- Decoding functionality
- Multiple compression algorithms comparison
- Performance benchmarking

---

**Built with ❤️ for DAA Mini-Project 10**
User Input (Frontend) 
    ↓
JavaScript (script.js) sends HTTP request
    ↓
Node.js Server (server.js) receives request
    ↓
Executes C++ Program (huffman.exe)
    ↓
C++ processes algorithms (Huffman + Optimal Merge)
    ↓
Returns JSON output
    ↓
Server forwards to Frontend
    ↓
Frontend displays results with animations