# Quick Start Guide

## Running the CompressionBuilder Application

### Step 1: Install Dependencies (One-time setup)
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
🚀 CompressionBuilder Backend Server Started!
📡 Server running at: http://localhost:3000
🌐 Open http://localhost:3000 in your browser
```

### Step 3: Open in Browser
Navigate to: **http://localhost:3000**

### Step 4: Use the Application
1. Enter text in the input area (default: "hello world hello")
2. Click "Compress & Analyze"
3. View the results:
   - Compression statistics
   - Huffman codes
   - Tree visualization
   - Optimal merge pattern

## Architecture

```
┌──────────────────┐
│   Browser        │
│  (HTML/CSS/JS)   │
└────────┬─────────┘
         │ HTTP POST /api/compress
         │ {"text": "hello world"}
         ▼
┌──────────────────┐
│   Node.js        │
│   server.js      │
└────────┬─────────┘
         │ Execute
         │ ./huffman.exe "hello world"
         ▼
┌──────────────────┐
│   C++ Backend    │
│   huffman.cpp    │
│   (ALGORITHMS)   │
└────────┬─────────┘
         │ JSON Output
         │
         ▼
   Back to Browser
```

## Key Point
✅ **ALL ALGORITHMS RUN IN C++**
- Huffman Coding ✓
- Optimal Merge Pattern ✓
- Frequency Analysis ✓
- Tree Construction ✓

❌ **NO JavaScript algorithms** - JS only handles UI and API calls!
