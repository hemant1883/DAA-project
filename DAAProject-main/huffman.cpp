#include<algorithm>
#include<fstream>
#include<iostream>
#include<queue>
#include<sstream>
#include<string>
#include<unordered_map>
#include<vector>


using namespace std;

// Node structure for Huffman Tree
struct Node {
  char ch;
  int freq;
  Node *left, *right;

  Node(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
};

// Comparator for priority queue
struct Compare {
  bool operator()(Node *a, Node *b) { return a->freq > b->freq; }
};

// Build frequency table
unordered_map<char, int> buildFrequencyTable(const string &text) {
  unordered_map<char, int> freq;
  for (char ch : text) {
    freq[ch]++;
  }
  return freq;
}

// Build Huffman Tree
Node *buildHuffmanTree(const unordered_map<char, int> &freq) {
  priority_queue<Node *, vector<Node *>, Compare> pq;

  for (auto pair : freq) {
    pq.push(new Node(pair.first, pair.second));
  }

  while (pq.size() > 1) {
    Node *left = pq.top();
    pq.pop();
    Node *right = pq.top();
    pq.pop();

    Node *parent = new Node('\0', left->freq + right->freq);
    parent->left = left;
    parent->right = right;

    pq.push(parent);
  }

  return pq.top();
}

// Generate Huffman codes
void generateCodes(Node *root, string code,
                   unordered_map<char, string> &codes) {
  if (!root)
    return;

  if (!root->left && !root->right) {
    codes[root->ch] = code.empty() ? "0" : code;
    return;
  }

  generateCodes(root->left, code + "0", codes);
  generateCodes(root->right, code + "1", codes);
}

// Encode text
string encode(const string &text, const unordered_map<char, string> &codes) {
  string encoded = "";
  for (char ch : text) {
    encoded += codes.at(ch);
  }
  return encoded;
}

// Decode text
string decode(const string &encoded, Node *root) {
  string decoded = "";
  Node *current = root;

  for (char bit : encoded) {
    current = (bit == '0') ? current->left : current->right;

    if (!current->left && !current->right) {
      decoded += current->ch;
      current = root;
    }
  }

  return decoded;
}

// Export tree structure as JSON for visualization
void exportTreeJSON(Node *root, ostream &out, bool isRoot = true) {
  if (isRoot)
    out << "{";

  if (!root) {
    out << "null";
    return;
  }

  out << "\"char\":";
  if (root->ch == '\0') {
    out << "null";
  } else if (root->ch == '\n') {
    out << "\"\\\\n\"";
  } else if (root->ch == '\t') {
    out << "\"\\\\t\"";
  } else if (root->ch == ' ') {
    out << "\"SPACE\"";
  } else if (root->ch == '"') {
    out << "\"\\\\\\\"\"";
  } else {
    out << "\"" << root->ch << "\"";
  }

  out << ",\"freq\":" << root->freq;

  if (root->left || root->right) {
    out << ",\"left\":";
    if (root->left) {
      out << "{";
      exportTreeJSON(root->left, out, false);
      out << "}";
    } else {
      out << "null";
    }

    out << ",\"right\":";
    if (root->right) {
      out << "{";
      exportTreeJSON(root->right, out, false);
      out << "}";
    } else {
      out << "null";
    }
  }

  if (isRoot)
    out << "}";
}

// Calculate compression ratio
double calculateCompressionRatio(const string &original,
                                 const string &encoded) {
  int originalBits = original.length() * 8;
  int encodedBits = encoded.length();
  return (1.0 - (double)encodedBits / originalBits) * 100;
}

// Optimal Merge Pattern
vector<pair<int, int>> optimalMergePattern(vector<int> files) {
  vector<pair<int, int>> mergeSteps;
  priority_queue<int, vector<int>, greater<int>> pq(files.begin(), files.end());

  while (pq.size() > 1) {
    int first = pq.top();
    pq.pop();
    int second = pq.top();
    pq.pop();

    mergeSteps.push_back({first, second});
    pq.push(first + second);
  }

  return mergeSteps;
}

int main(int argc, char *argv[]) {
  if (argc < 2) {
    cerr << "Usage: " << argv[0] << " <input_text>" << endl;
    return 1;
  }

  string text = argv[1];

  // Build frequency table
  unordered_map<char, int> freq = buildFrequencyTable(text);

  // Build Huffman tree
  Node *root = buildHuffmanTree(freq);

  // Generate codes
  unordered_map<char, string> codes;
  generateCodes(root, "", codes);

  // Encode
  string encoded = encode(text, codes);

  // Decode (for verification)
  string decoded = decode(encoded, root);

  // Calculate compression ratio
  double ratio = calculateCompressionRatio(text, encoded);

  // Output JSON
  cout << "{" << endl;
  cout << "  \"original\": \"";
  for (char ch : text) {
    if (ch == '\n')
      cout << "\\n";
    else if (ch == '\t')
      cout << "\\t";
    else if (ch == '"')
      cout << "\\\"";
    else if (ch == '\\')
      cout << "\\\\";
    else
      cout << ch;
  }
  cout << "\"," << endl;

  cout << "  \"encoded\": \"" << encoded << "\"," << endl;
  cout << "  \"decoded\": \"";
  for (char ch : decoded) {
    if (ch == '\n')
      cout << "\\n";
    else if (ch == '\t')
      cout << "\\t";
    else if (ch == '"')
      cout << "\\\"";
    else if (ch == '\\')
      cout << "\\\\";
    else
      cout << ch;
  }
  cout << "\"," << endl;

  cout << "  \"compressionRatio\": " << ratio << "," << endl;
  cout << "  \"originalSize\": " << text.length() * 8 << "," << endl;
  cout << "  \"encodedSize\": " << encoded.length() << "," << endl;

  cout << "  \"codes\": {" << endl;
  bool first = true;
  for (auto &pair : codes) {
    if (!first)
      cout << ",";
    cout << "    \"";
    if (pair.first == '\n')
      cout << "\\n";
    else if (pair.first == '\t')
      cout << "\\t";
    else if (pair.first == ' ')
      cout << "SPACE";
    else if (pair.first == '"')
      cout << "\\\"";
    else if (pair.first == '\\')
      cout << "\\\\";
    else
      cout << pair.first;
    cout << "\": \"" << pair.second << "\"" << endl;
    first = false;
  }
  cout << "  }," << endl;

  cout << "  \"tree\": ";
  ofstream tempOut;
  exportTreeJSON(root, cout);
  cout << "," << endl;

  // Optimal merge for character frequencies
  vector<int> frequencies;
  for (auto &pair : freq) {
    frequencies.push_back(pair.second);
  }
  sort(frequencies.begin(), frequencies.end());

  vector<pair<int, int>> mergeSteps = optimalMergePattern(frequencies);

  cout << "  \"optimalMerge\": {" << endl;
  cout << "    \"files\": [";
  for (size_t i = 0; i < frequencies.size(); i++) {
    if (i > 0)
      cout << ", ";
    cout << frequencies[i];
  }
  cout << "]," << endl;

  cout << "    \"steps\": [" << endl;
  int totalCost = 0;
  for (size_t i = 0; i < mergeSteps.size(); i++) {
    if (i > 0)
      cout << "," << endl;
    int cost = mergeSteps[i].first + mergeSteps[i].second;
    totalCost += cost;
    cout << "      {\"merge\": [" << mergeSteps[i].first << ", "
         << mergeSteps[i].second << "], \"cost\": " << cost << "}";
  }
  cout << endl << "    ]," << endl;
  cout << "    \"totalCost\": " << totalCost << endl;
  cout << "  }" << endl;

  cout << "}" << endl;

  return 0;
}
