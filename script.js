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
        this.updateStats();
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
        return sums;
    }
    
    getColSums() {
        let sums = new Array(this.size).fill(0);
        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < this.size; i++) {
                sums[j] += this.data[i][j];
            }
        }
        return sums;
    }
    
    swapDiagonals() {
        for (let i = 0; i < this.size; i++) {
            for (let j = i + 1; j < this.size; j++) {
                let temp = this.data[i][j];
                this.data[i][j] = this.data[j][i];
                this.data[j][i] = temp;
            }
        }
        this.updateStats();
        return true;
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
        
        return det;
    }
    
    getRowAverages() {
        let sums = this.getRowSums();
        return sums.map(sum => sum / this.size);
    }
    
    getColAverages() {
        let sums = this.getColSums();
        return sums.map(sum => sum / this.size);
    }
    
    updateStats() {
        let rowSums = this.getRowSums();
        let colSums = this.getColSums();
        let total = rowSums.reduce((a, b) => a + b, 0);
        
        let maxCatIdx = rowSums.indexOf(Math.max(...rowSums));
        let maxDayIdx = colSums.indexOf(Math.max(...colSums));
        
        document.getElementById('total-books').textContent = total.toLocaleString();
        document.getElementById('busiest-day').textContent = `Day ${maxDayIdx + 1}`;
        document.getElementById('popular-category').textContent = this.categories[maxCatIdx];
        
        let det = this.getDeterminant();
        document.getElementById('det-value').textContent = det.toExponential(2);
    }
}

let library = new LibraryMatrix();

window.onload = function() {
    renderMatrix();
};

function renderMatrix() {
    const container = document.getElementById('matrix-container');
    container.innerHTML = '';
    
    container.appendChild(createCell('', 'matrix-row-header'));
    for (let j = 0; j < 20; j++) {
        container.appendChild(createCell(`D${j+1}`, 'matrix-header'));
    }
    
    for (let i = 0; i < 20; i++) {
        container.appendChild(createCell(library.categories[i], 'matrix-row-header'));
        
        for (let j = 0; j < 20; j++) {
            let value = library.getValue(i, j);
            let cellClass = 'matrix-cell';
            
            if (value < 15) cellClass += ' cell-low';
            else if (value < 35) cellClass += ' cell-medium';
            else cellClass += ' cell-high';
            
            let cell = createCell(value, cellClass);
            cell.title = `${library.categories[i]} - ${library.timePeriods[j]}: ${value} books`;
            container.appendChild(cell);
        }
    }
    
    document.getElementById('matrix-status').textContent = 'Status: Generated';
}

function createCell(content, className) {
    let div = document.createElement('div');
    div.className = className;
    div.textContent = content;
    return div;
}

function generateMatrix() {
    library.generateRandomData();
    renderMatrix();
    showNotification('New matrix generated!');
}

function showRowSums() {
    let sums = library.getRowSums();
    let html = '<div class="array-display">';
    html += '<span class="array-label">Row Sums (1D Array) - Total books per category:</span>';
    
    for (let i = 0; i < 20; i++) {
        html += `<div class="array-item" title="${library.categories[i]}">
            ${library.categories[i].substr(0,3)}: ${sums[i]}
        </div>`;
    }
    
    html += '</div>';
    html += `<p><strong>Array Length:</strong> ${sums.length}</p>`;
    html += `<p><strong>Total Books:</strong> ${sums.reduce((a,b) => a+b, 0)}</p>`;
    
    showResults('Row Sums (1D Array)', html);
}

function showColSums() {
    let sums = library.getColSums();
    let html = '<div class="array-display">';
    html += '<span class="array-label">Column Sums (1D Array) - Total books per day:</span>';
    
    for (let j = 0; j < 20; j++) {
        html += `<div class="array-item">Day ${j+1}: ${sums[j]}</div>`;
    }
    
    html += '</div>';
    html += `<p><strong>Array Length:</strong> ${sums.length}</p>`;
    html += `<p><strong>Busiest Day:</strong> Day ${sums.indexOf(Math.max(...sums)) + 1}</p>`;
    
    showResults('Column Sums (1D Array)', html);
}

function swapDiagonals() {
    library.swapDiagonals();
    renderMatrix();
    showNotification('Diagonals swapped! Upper ↔ Lower');
}

function calculateDeterminant() {
    let det = library.getDeterminant();
    let html = `
        <div style="text-align: center; padding: 20px;">
            <h2 style="font-size: 3rem; color: #667eea; margin: 20px 0;">
                ${det.toExponential(4)}
            </h2>
            <p style="font-size: 1.2rem; color: #6c757d;">Matrix Determinant (20×20)</p>
            <hr style="margin: 20px 0;">
            <p><strong>Interpretation:</strong></p>
            <p>${Math.abs(det) > 1000 ? '✅ High correlation' : '⚠️ Low correlation'}</p>
        </div>
    `;
    showResults('Determinant Calculation', html);
}

function showRowAverages() {
    let avgs = library.getRowAverages();
    let html = '<div class="array-display">';
    html += '<span class="array-label">Row Averages - Average books per category per day:</span>';
    
    for (let i = 0; i < 20; i++) {
        html += `<div class="array-item" style="background: #43e97b;">
            ${library.categories[i].substr(0,3)}: ${avgs[i].toFixed(2)}
        </div>`;
    }
    
    html += '</div>';
    html += `<p><strong>Formula:</strong> Row Sum ÷ 20 days</p>`;
    
    showResults('Row Averages', html);
}

function showColAverages() {
    let avgs = library.getColAverages();
    let html = '<div class="array-display">';
    html += '<span class="array-label">Column Averages - Average books per day per category:</span>';
    
    for (let j = 0; j < 20; j++) {
        html += `<div class="array-item" style="background: #a8edea;">
            Day ${j+1}: ${avgs[j].toFixed(2)}
        </div>`;
    }
    
    html += '</div>';
    html += `<p><strong>Formula:</strong> Column Sum ÷ 20 categories</p>`;
    
    showResults('Column Averages', html);
}

function showFullReport() {
    let rowSums = library.getRowSums();
    let colSums = library.getColSums();
    let det = library.getDeterminant();
    
    let maxCatIdx = rowSums.indexOf(Math.max(...rowSums));
    let minCatIdx = rowSums.indexOf(Math.min(...rowSums));
    let maxDayIdx = colSums.indexOf(Math.max(...colSums));
    let minDayIdx = colSums.indexOf(Math.min(...colSums));
    
    let total = rowSums.reduce((a, b) => a + b, 0);
    
    let html = `
        <div style="line-height: 1.8;">
            <h4 style="color: #667eea; margin-top: 15px;">📊 POPULARITY INSIGHTS</h4>
            <ul style="list-style: none; padding-left: 0;">
                <li>🏆 <strong>Most Popular:</strong> ${library.categories[maxCatIdx]} (${rowSums[maxCatIdx]} books)</li>
                <li>📉 <strong>Least Popular:</strong> ${library.categories[minCatIdx]} (${rowSums[minCatIdx]} books)</li>
                <li>🔥 <strong>Busiest Day:</strong> Day ${maxDayIdx + 1} (${colSums[maxDayIdx]} books)</li>
                <li>🌙 <strong>Quietest Day:</strong> Day ${minDayIdx + 1} (${colSums[minDayIdx]} books)</li>
            </ul>
            
            <h4 style="color: #667eea; margin-top: 20px;">📈 STATISTICAL SUMMARY</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: #f8f9fa;">
                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Total Books</strong></td>
                    <td style="padding: 10px; border: 1px solid #dee2e6;">${total.toLocaleString()}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Average per Category</strong></td>
                    <td style="padding: 10px; border: 1px solid #dee2e6;">${(total/20).toFixed(1)}</td>
                </tr>
                <tr style="background: #f8f9fa;">
                    <td style="padding: 10px; border: 1px solid #dee2e6;"><strong>Average per Day</strong></td>
                    <td style="padding: 10px; border: 1px solid #dee2e6;">${(total/20).toFixed(1)}</td>
                </tr>
            </table>
            
            <h4 style="color: #667eea; margin-top: 20px;">🔢 MATRIX HEALTH</h4>
            <p><strong>Determinant:</strong> ${det.toExponential(3)}</p>
            <p><strong>Status:</strong> ${Math.abs(det) > 1000 ? '✅ Balanced' : '⚠️ Low Correlation'}</p>
        </div>
    `;
    
    showResults('Complete Analytics Report', html);
}

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
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #43e97b;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 2000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

let style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);