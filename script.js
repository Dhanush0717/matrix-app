class IMatrixOperations {
    getRowSums() {
        throw new Error("Abstract method: getRowSums() must be implemented");
    }
    
    getColSums() {
        throw new Error("Abstract method: getColSums() must be implemented");
    }
    
    swapDiagonals() {
        throw new Error("Abstract method: swapDiagonals() must be implemented");
    }
    
    getDeterminant() {
        throw new Error("Abstract method: getDeterminant() must be implemented");
    }
    
    getRowAverages() {
        throw new Error("Abstract method: getRowAverages() must be implemented");
    }
    
    getColAverages() {
        throw new Error("Abstract method: getColAverages() must be implemented");
    }
}

// ============================================
// CONCRETE IMPLEMENTATION
// Implements HOW the operations work
// ============================================

class LibraryMatrix extends IMatrixOperations {
    constructor(size = 20) {
        super();  // Call parent constructor
        this.size = size;
        this.data = [];
        this.categories = [
            "Fiction", "Science", "History", "Technology", "Arts",
            "Biography", "Children", "Medicine", "Law", "Business",
            "Philosophy", "Religion", "Sports", "Cooking", "Travel",
            "Music", "Photography", "Programming", "Mathematics", "Physics"
        ];
        this.timePeriods = Array.from({length: 20}, (_, i) => `Day ${i + 1}`);
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
    
    getValue(row, col) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            return this.data[row][col];
        }
        return -1;
    }
    
    setValue(row, col, value) {
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            this.data[row][col] = value;
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
        return { success: true, message: "Diagonals swapped successfully" };
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
            
            if (Math.abs(temp[maxRow][i]) < 0.00001) {
                return 0.0;
            }
            
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
    
    // ============================================
    // REQUIREMENT 5: ROW AVERAGE
    // Implements abstract method from IMatrixOperations
    // ============================================
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

// ============================================
// UI CONTROLLER
// Handles webpage interaction
// ============================================

let library = new LibraryMatrix();

window.onload = function() {
    renderMatrix();
};

function renderMatrix() {
    let data = library.getMatrixData();
    const container = document.getElementById('matrix-container');
    container.innerHTML = '';
    
    // Column headers
    container.appendChild(createCell('', 'matrix-row-header'));
    for (let j = 0; j < 20; j++) {
        container.appendChild(createCell('D' + (j + 1), 'matrix-header'));
    }
    
    // Rows with data
    for (let i = 0; i < 20; i++) {
        container.appendChild(createCell(data.categories[i], 'matrix-row-header'));
        
        for (let j = 0; j < 20; j++) {
            let value = data.data[i][j];
            let cellClass = 'matrix-cell';
            
            if (value < 15) cellClass += ' cell-low';
            else if (value < 35) cellClass += ' cell-medium';
            else cellClass += ' cell-high';
            
            let cell = createCell(value, cellClass);
            cell.title = data.categories[i] + ' - Day ' + (j + 1) + ': ' + value + ' books';
            container.appendChild(cell);
        }
    }
    
    document.getElementById('matrix-status').textContent = 'Status: Generated';
    updateStats();
}

function createCell(content, className) {
    let div = document.createElement('div');
    div.className = className;
    div.textContent = content;
    return div;
}

function updateStats() {
    let rowSums = library.getRowSums().array;
    let colSums = library.getColSums().array;
    let total = rowSums.reduce(function(a, b) { return a + b; }, 0);
    
    document.getElementById('total-books').textContent = total.toLocaleString();
    document.getElementById('busiest-day').textContent = 'Day ' + (colSums.indexOf(Math.max.apply(null, colSums)) + 1);
    document.getElementById('popular-category').textContent = library.categories[rowSums.indexOf(Math.max.apply(null, rowSums))];
    document.getElementById('det-value').textContent = library.getDeterminant().scientific;
}

// ============================================
// BUTTON HANDLERS
// Connect UI to ADT operations
// ============================================

function generateMatrix() {
    library.generateRandomData();
    renderMatrix();
    showNotification('New matrix generated!');
}

function showRowSums() {
    let data = library.getRowSums();
    let html = '<div class="array-display">';
    html += '<span class="array-label">Row Sums from ADT (1D Array):</span>';
    
    for (let i = 0; i < 20; i++) {
        html += '<div class="array-item" title="' + library.categories[i] + '">' + 
                library.categories[i].substr(0, 3) + ': ' + data.array[i] + '</div>';
    }
    
    html += '</div>';
    html += '<p><strong>Type:</strong> ' + data.type + '</p>';
    html += '<p><strong>Length:</strong> ' + data.length + '</p>';
    html += '<p><strong>Total Books:</strong> ' + data.array.reduce(function(a, b) { return a + b; }, 0) + '</p>';
    
    showResults('Row Sums (ADT Implementation)', html);
}

function showColSums() {
    let data = library.getColSums();
    let html = '<div class="array-display">';
    html += '<span class="array-label">Column Sums from ADT (1D Array):</span>';
    
    for (let j = 0; j < 20; j++) {
        html += '<div class="array-item">Day ' + (j + 1) + ': ' + data.array[j] + '</div>';
    }
    
    html += '</div>';
    html += '<p><strong>Type:</strong> ' + data.type + '</p>';
    html += '<p><strong>Length:</strong> ' + data.length + '</p>';
    html += '<p><strong>Busiest Day:</strong> Day ' + (data.array.indexOf(Math.max.apply(null, data.array)) + 1) + '</p>';
    
    showResults('Column Sums (ADT Implementation)', html);
}

function swapDiagonals() {
    let result = library.swapDiagonals();
    renderMatrix();
    showNotification('Diagonals swapped! ' + result.message);
}

function calculateDeterminant() {
    let det = library.getDeterminant();
    let html = '<div style="text-align: center; padding: 20px;">';
    html += '<h2 style="font-size: 3rem; color: #667eea; margin: 20px 0;">' + det.scientific + '</h2>';
    html += '<p style="font-size: 1.2rem; color: #6c757d;">Matrix Determinant (20×20)</p>';
    html += '<hr style="margin: 20px 0;">';
    html += '<p><strong>Raw Value:</strong> ' + det.value + '</p>';
    html += '<p><strong>Calculated by ADT:</strong> LibraryMatrix.getDeterminant()</p>';
    html += '</div>';
    
    showResults('Determinant (ADT Implementation)', html);
}

function showRowAverages() {
    let avgs = library.getRowAverages();
    let html = '<div class="array-display">';
    html += '<span class="array-label">Row Averages from ADT:</span>';
    
    for (let i = 0; i < 20; i++) {
        html += '<div class="array-item" style="background: #43e97b;">' + 
                library.categories[i].substr(0, 3) + ': ' + avgs[i].toFixed(2) + '</div>';
    }
    
    html += '</div>';
    html += '<p><strong>Formula:</strong> Row Sum ÷ 20 days</p>';
    
    showResults('Row Averages (ADT Implementation)', html);
}

function showColAverages() {
    let avgs = library.getColAverages();
    let html = '<div class="array-display">';
    html += '<span class="array-label">Column Averages from ADT:</span>';
    
    for (let j = 0; j < 20; j++) {
        html += '<div class="array-item" style="background: #a8edea;">' + 
                'Day ' + (j + 1) + ': ' + avgs[j].toFixed(2) + '</div>';
    }
    
    html += '</div>';
    html += '<p><strong>Formula:</strong> Column Sum ÷ 20 categories</p>';
    
    showResults('Column Averages (ADT Implementation)', html);
}

function showFullReport() {
    let r = library.getFullReport();
    
    let html = '<div style="line-height: 1.8;">';
    html += '<h4 style="color: #667eea; margin-top: 15px;">📊 ADT GENERATED REPORT</h4>';
    html += '<ul style="list-style: none; padding-left: 0;">';
    html += '<li>🏆 <strong>Most Popular:</strong> ' + r.popularCategory + ' (' + r.rowSums[r.categories.indexOf(r.popularCategory)] + ' books)</li>';
    html += '<li>🔥 <strong>Busiest Day:</strong> Day ' + r.busiestDay + ' (' + r.colSums[r.busiestDay - 1] + ' books)</li>';
    html += '</ul>';
    
    html += '<h4 style="color: #667eea; margin-top: 20px;">📈 STATISTICS</h4>';
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += '<tr style="background: #f8f9fa;"><td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Total Books</strong></td>';
    html += '<td style="padding: 10px; border: 1px solid #dee2e6;">' + r.totalBooks.toLocaleString() + '</td></tr>';
    html += '<tr><td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Average per Category</strong></td>';
    html += '<td style="padding: 10px; border: 1px solid #dee2e6;">' + (r.totalBooks / 20).toFixed(1) + '</td></tr>';
    html += '</table>';
    
    html += '<h4 style="color: #667eea; margin-top: 20px;">🔢 MATRIX HEALTH</h4>';
    html += '<p><strong>Determinant:</strong> ' + r.determinant.scientific + '</p>';
    html += '<p><strong>Status:</strong> ' + (Math.abs(r.determinant.value) > 1000 ? '✅ Balanced' : '⚠️ Low Correlation') + '</p>';
    html += '</div>';
    
    showResults('Complete Report (All ADT Operations)', html);
}

// ============================================
// UI UTILITIES
// ============================================

function showResults(title, content) {
    document.getElementById('results-content').innerHTML = content;
    document.querySelector('.results-panel h3').textContent = title;
    document.getElementById('results-panel').classList.remove('hidden');
    
    let overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'temp-overlay';
    overlay.onclick = closeResults;
    document.body.appendChild(overlay);
}

function closeResults() {
    document.getElementById('results-panel').classList.add('hidden');
    let overlay = document.getElementById('temp-overlay');
    if (overlay) overlay.remove();
}

function showNotification(message) {
    let notif = document.createElement('div');
    notif.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #43e97b; color: white; padding: 15px 25px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); z-index: 2000; font-weight: bold; animation: slideIn 0.3s ease;';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(function() {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() { notif.remove(); }, 300);
    }, 3000);
}

// Add animation styles
let style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }';
document.head.appendChild(style);
