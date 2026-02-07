// ============================================
// MATRIX ADT - Core Logic (Backend)
// ============================================

class IMatrixOperations {
    getRowSums() { throw new Error("Must implement"); }
    getColSums() { throw new Error("Must implement"); }
    swapDiagonals() { throw new Error("Must implement"); }
    getDeterminant() { throw new Error("Must implement"); }
    getRowAverages() { throw new Error("Must implement"); }
    getColAverages() { throw new Error("Must implement"); }
}

class LibraryMatrix extends IMatrixOperations {
    constructor(size = 20) {
        super();
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
    
    // 1. ROW SUM → 1D Array
    getRowSums() {
        let sums = new Array(this.size).fill(0);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                sums[i] += this.data[i][j];
            }
        }
        return { array: sums, type: "1D Array", length: this.size };
    }
    
    // 2. COLUMN SUM → 1D Array
    getColSums() {
        let sums = new Array(this.size).fill(0);
        for (let j = 0; j < this.size; j++) {
            for (let i = 0; i < this.size; i++) {
                sums[j] += this.data[i][j];
            }
        }
        return { array: sums, type: "1D Array", length: this.size };
    }
    
    // 3. SWAP DIAGONALS
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
    
    // 4. DETERMINANT
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
    
    // 5. ROW AVERAGES
    getRowAverages() {
        let sums = this.getRowSums().array;
        return sums.map(sum => sum / this.size);
    }
    
    // 6. COLUMN AVERAGES
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

module.exports = { LibraryMatrix, IMatrixOperations };