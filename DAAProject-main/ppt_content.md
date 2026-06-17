# Project Presentation: CompressionBuilder

## Slide 1: Title Slide
**Title:** CompressionBuilder: Visualizing Huffman Coding & Optimal Merge Patterns
**Subtitle:** An Efficient Data Compression Tool
**Presented by:** [Your Name/Team Name]

---

## Slide 2: 1. Introduction
**Overview:**
*   **Problem:** Data storage and transmission costs increase with file size. Large text files consume unnecessary space.
*   **Solution:** CompressionBuilder is a web-based application that implements lossless data compression algorithms.
*   **Core Concept:** Uses **Huffman Coding** to assign shorter binary codes to frequent characters and **Optimal Merge Pattern** to minimize computation cost.
*   **Objective:** To demonstrate efficient file compression and provide a visual understanding of the underlying greedy algorithms.

---

## Slide 3: 2. Algorithms (Part 1 - Huffman Coding)
**Huffman Coding:**
*   **Type:** Greedy Algorithm.
*   **Goal:** Lossless data compression.
*   **How it works:**
    1.  **Frequency Analysis:** Count the frequency of each character in the input text.
    2.  **Priority Queue:** All characters (as nodes) are inserted into a min-heap priority queue.
    3.  **Tree Construction:**
        *   Extract two nodes with the lowest frequencies.
        *   Create a new internal node with a frequency equal to the sum of the two nodes.
        *   Repeat until one node (the root) remains.
    4.  **Code Generation:** Traverse from root to leaf. Left = `0`, Right = `1`. Unique prefix codes are assigned to each character.

---

## Slide 4: 2. Algorithms (Part 2 - Optimal Merge Pattern)
**Optimal Merge Pattern:**
*   **Type:** Greedy Algorithm.
*   **Goal:** Merge multiple sorted files with minimum cost.
*   **Process:**
    1.  Take two smallest files from the list.
    2.  Merge them into a single file. Cost = Size of File A + Size of File B.
    3.  Add the new file back to the list.
    4.  Repeat until all files are merged.
*   **Implementation:** Efficiently handled using a **Min-Heap** (Priority Queue).

---

## Slide 5: 3. Technology Used (Full Stack)
**Architecture:** Hybrid Web Application (JS Frontend + C++ Backend).

**Frontend (User Interface):**
*   **HTML/CSS:** For a responsive and clean user interface.
*   **JavaScript:** Handles user input, sends data to the server, and parses the JSON response to update the UI.
*   **Visualization:** Renders the Huffman Tree and Merge Steps dynamically. (Canvas/SVG logic).

**Backend (Server & Logic):**
*   **Node.js & Express:** Acts as the middleware server. Receives text from the frontend and executes the C++ executable.
*   **C++ (Core Logic):**
    *   **STL Containers:** `std::priority_queue`, `std::unordered_map`, `std::vector`, `std::stringstream`.
    *   **Performance:** High-performance execution of the greedy algorithms.
    *   **JSON Handling:** Custom logic to export the tree structure as JSON for the frontend.

---

## Slide 6: 4. Applications
**Real-world Use Cases:**
*   **File Compression:** Core concept behind formats like ZIP, GZIP, and PKZIP.
*   **Multimedia Compression:** Used in the final stages of JPEG (images) and MP3 (audio) compression.
*   **Network Transmission:** Reducing packet size to improve bandwidth usage and transmission speed.
*   **Genomics:** Compressing large DNA sequences (A, C, G, T).

---

## Slide 7: 5. Conclusion
**Summary:**
*   Successfully implemented a full-stack application demonstrating **Huffman Coding** and **Optimal Merge Patterns**.
*   Achieved significant reduction in data size (Compression Ratio displayed in app).
*   The project highlights the power of **Greedy Algorithms** in solving optimization problems.
*   **Future Scope:** Support for file upload (.txt, .pdf) and implementing real-time decompression.
