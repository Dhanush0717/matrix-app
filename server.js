// SIMPLE SERVER - No npm install needed!
const http = require('http');  // Built into Node.js
const fs = require('fs');      // Built into Node.js
const path = require('path');  // Built into Node.js

// Matrix ADT Class (embedded - no separate file needed)
class LibraryMatrix {
    constructor(size = 20) {
        this.size = size;
        this.data = [];
        this.categories = [
            "Fiction", "Science", "History", "Technology", "Arts",
            "Biography", "Children", "Medicine", "Law", "Business",
            "Philosophy", "Religion", "Sports", "Cooking", "Travel",
            "Music", "Photography", "Programming", "Mathematics", "Physics"
        ];
        this.generateRandomData();
    }
    
    generateRandomData() {
        this.data = [];
        for (let i = 0; i < this.size; i++) {
            let row = [];
            for (let j = 0; j < this.size; j++) {
                row.push(Math.floor(Math.random() * 51));
            }
            this.data.push(row);
        }
    }
    
    getRowSums() {
        let sums = new Array(this.size).fill(0);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                sums[i] += this.data[i][j];
            }
        }
        return { array: sums, type: "1D Array", length: this.size };
    }
    
    getColSums() {
        let sums = new Array(this.size).fill(0);
        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < this.size; i++) {
                sums[j] += this.data[i][j];
            }
        }
        return { array: sums, type: "1D Array", length: this.size };
    }
    
    swapDiagonals() {
        for (let i = 0; i < this.size; i++) {
            for (let j = i + 1; j < this.size; j++) {
                let temp = this.data[i][j];
                this.data[i][j] = this.data[j][i];
                this.data[j][i] = temp;
            }
        }
        return { success: true };
    }
    
    getDeterminant() {
        let temp = this.data.map(row => [...row]);
        let det = 1.0;
        
        for (let i = 0; i < this.size; i++) {
            let maxRow = i;
            for (let k = i + 1; k < this.size; k++) {
                if (Math.abs(temp[k][i]) > Math.abs(temp[maxRow][i])) {
                    maxRow = k;
                }
            }
            if (Math.abs(temp[maxRow][i]) < 0.00001) return 0.0;
            if (maxRow !== i) {
                [temp[maxRow], temp[i]] = [temp[i], temp[maxRow]];
                det *= -1;
            }
            det *= temp[i][i];
            for (let k = i + 1; k < this.size; k++) {
                let factor = temp[k][i] / temp[i][i];
                for (let j = i; j < this.size; j++) {
                    temp[k][j] -= factor * temp[i][j];
                }
            }
        }
        return { value: det, scientific: det.toExponential(4) };
    }
    
    getRowAverages() {
        let sums = this.getRowSums().array;
        return sums.map(sum => sum / this.size);
    }
    
    getColAverages() {
        let sums = this.getColSums().array;
        return sums.map(sum => sum / this.size);
    }
    
    getMatrixData() {
        return {
            size: this.size,
            data: this.data,
            categories: this.categories
        };
    }
    
    getFullReport() {
        let rowSums = this.getRowSums().array;
        let colSums = this.getColSums().array;
        let total = rowSums.reduce((a, b) => a + b, 0);
        
        return {
            rowSums: rowSums,
            colSums: colSums,
            rowAverages: this.getRowAverages(),
            colAverages: this.getColAverages(),
            determinant: this.getDeterminant(),
            totalBooks: total,
            busiestDay: colSums.indexOf(Math.max(...colSums)) + 1,
            popularCategory: this.categories[rowSums.indexOf(Math.max(...rowSums))],
            matrix: this.data
        };
    }
}

// Create matrix instance
let libraryMatrix = new LibraryMatrix();

// MIME types for serving files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json'
};

// Create server
const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    console.log(`${req.method} ${req.url}`);
    
    // API Routes
    if (req.url === '/api/matrix' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(libraryMatrix.getMatrixData()));
    }
    else if (req.url === '/api/matrix/generate' && req.method === 'POST') {
        libraryMatrix.generateRandomData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: libraryMatrix.getMatrixData() }));
    }
    else if (req.url === '/api/matrix/row-sums' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(libraryMatrix.getRowSums()));
    }
    else if (req.url === '/api/matrix/col-sums' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(libraryMatrix.getColSums()));
    }
    else if (req.url === '/api/matrix/swap-diagonals' && req.method === 'POST') {
        libraryMatrix.swapDiagonals();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, matrix: libraryMatrix.getMatrixData() }));
    }
    else if (req.url === '/api/matrix/determinant' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(libraryMatrix.getDeterminant()));
    }
    else if (req.url === '/api/matrix/row-averages' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ averages: libraryMatrix.getRowAverages() }));
    }
    else if (req.url === '/api/matrix/col-averages' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ averages: libraryMatrix.getColAverages() }));
    }
    else if (req.url === '/api/matrix/report' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(libraryMatrix.getFullReport()));
    }
    // Serve static files (frontend)
    else {
        let filePath = req.url === '/' ? '/index.html' : req.url;
        filePath = path.join(__dirname, '../frontend', filePath);
        
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   Matrix ADT Server Running!           ║');
    console.log('║   http://localhost:' + PORT + '              ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('\nNo npm install needed!');
    console.log('All ADT operations available at /api/...');
});