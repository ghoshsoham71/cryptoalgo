// Cryptographic algorithms data
const algorithms = [
    { name: "AES", keySize: 256, standardPlaintextSize: 128 },
    { name: "3DES", keySize: 168, standardPlaintextSize: 64 },
    { name: "SHA-256", keySize: 256, standardPlaintextSize: 512 },
    { name: "RC4", keySize: 128, standardPlaintextSize: 256}
];

// Function to calculate time taken for encryption
async function calculateTimeTaken(algorithm, plaintextSize) {
    if(algorithm.name === "SHA-256") {
        return 244.404;
    }
    if(algorithm.name === "AES") {
        return 879.538;
    }
    if(algorithm.name === "3DES") {
        return 733.476;     
    }
    if(algorithm.name === "RC4")
    {
        return 236.776;
    }
}

// Function to calculate memory usage
function calculateMemoryUsage() {
    if (performance.memory) {
        return (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
    }
    return "N/A";
}

function runExample(algorithm) {
    const plaintext = "Hello, World!";
    const key = algorithm === "AES" ? "ThisIsASecretKey" : "SecretK1SecretK2SecretK3";
    
    let result;
    switch(algorithm) {
        case "SHA-256":
            result = CryptoJS.SHA256(plaintext).toString();
            break;
        case "AES":
            result = CryptoJS.AES.encrypt(plaintext, key).toString();
            break;
        case "3DES":
            result = CryptoJS.TripleDES.encrypt(plaintext, key).toString();
            break;
        case "3DES":
            result = CryptoJS.RC4.encrypt(plaintext, key).toString();
            break;
    }
    
    document.querySelector('.example p:last-child').textContent = `${algorithm} Result: ${result}`;
}

// Function to calculate brute force attempts
function calculateBruteForceAttempts(keySize) {
    return BigInt(2) ** BigInt(keySize);
}

// Function to format brute force attempts in scientific notation
function formatScientificNotation(n) {
    if (typeof n === 'bigint') {
        const nStr = n.toString();
        const exponent = nStr.length - 1;
        const mantissa = parseFloat(nStr[0] + '.' + nStr.slice(1, 4));
        return `${mantissa.toFixed(2)}e${exponent}`;
    }
    return n.toExponential(2);
}

let currentSortColumn = 0;
let isAscending = true;

// Function to populate the algorithm table
async function populateAlgorithmTable() {
    const table = document.getElementById('algorithm-table');
    const tbody = table.querySelector('tbody');
    const plaintextSize = parseInt(localStorage.getItem('plaintextSize') || '1000');
    
    tbody.innerHTML = ''; // Clear existing rows
    
    for (const algo of algorithms) {
      const row = document.createElement('tr');
      const timeTaken = await calculateTimeTaken(algo, plaintextSize || algo.standardPlaintextSize);
      const bruteForceAttempts = calculateBruteForceAttempts(algo.keySize);
      
      row.innerHTML = `
        <td><a href="algorithm_details.html?algo=${algo.name}">${algo.name}</a></td>
        <td>${algo.keySize}</td>
        <td>${timeTaken}</td>
        <td>${formatScientificNotation(bruteForceAttempts)}</td>
      `;
      tbody.appendChild(row);
    }
  
    sortTable(currentSortColumn);
}

function initializeAnalyzePage() {
    populateAlgorithmTable();
  }

// Function to sort table
function sortTable(columnIndex) {
    const table = document.getElementById('algorithm-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (columnIndex === currentSortColumn) {
        isAscending = !isAscending;
    } else {
        isAscending = true;
    }
    currentSortColumn = columnIndex;

    const sortedRows = rows.sort((a, b) => {
        let aColText = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
        let bColText = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent.trim();
        
        if (columnIndex === 0) {
            return isAscending ? aColText.localeCompare(bColText) : bColText.localeCompare(aColText);
        } else if (columnIndex === 3) {
            const aVal = parseFloat(aColText.split('e')[0]) * Math.pow(10, parseFloat(aColText.split('e')[1]));
            const bVal = parseFloat(bColText.split('e')[0]) * Math.pow(10, parseFloat(bColText.split('e')[1]));
            return isAscending ? aVal - bVal : bVal - aVal;
        } else {
            return isAscending ? 
                parseFloat(aColText) - parseFloat(bColText) : 
                parseFloat(bColText) - parseFloat(aColText);
        }
    });
    
    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));

    updateSortIndicators(columnIndex);
}

// Function to update sort indicators
function updateSortIndicators(columnIndex) {
    const headers = document.querySelectorAll('#algorithm-table th');
    headers.forEach((header, index) => {
        header.classList.remove('sort-asc', 'sort-desc');
        if (index === columnIndex) {
            header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');
        }
    });
}

// Function to decrypt cipher text
function decryptCipherText(algorithm, key, ciphertext) {
    let result;

    try {
        switch(algorithm) {
            case "AES":
                result = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
                break;
            case "3DES":
                result = CryptoJS.TripleDES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
                break;
            case "RC4":
                result = CryptoJS.RC4.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
                break;
            case "SHA-256":
                throw new Error("SHA-256 is a one-way hash function and cannot be decrypted");
            default:
                throw new Error("Unsupported algorithm");
        }

        if (!result) {
            throw new Error("Decryption failed. Please check your key and ciphertext.");
        }

        return result;
    } catch (error) {
        console.error('Decryption error:', error);
        throw error;
    }
}
// Function to generate performance data for an algorithm
function generatePerformanceData(algoName) {
    const complexityMap = {
        "SHA-256": n => 157.424 - 0.220105*n + 0.002187*(n**2),
        "AES": n => 0.323*n+796.85,
        "3DES": n => 0.046*n+721.7,
        "RC4": n => 0.103*n+210.331 
    };
    
    const data = [];
    for (let i = 1; i <= 4096; i += 64) {
        data.push({
            inputSize: i,
            complexity: complexityMap[algoName](i)
        });
    }
    return data;
}

// Function to draw the performance chart
function drawPerformanceChart(algoName) {
    const ctx = document.getElementById('performance-chart').getContext('2d');
    const data = generatePerformanceData(algoName);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.inputSize),
            datasets: [{
                label: '(x,y) represent plaintext size vs time taken in microseconds',
                data: data.map(d => d.complexity),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Plaintext Size'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Time Taken in Microseconds'
                    }
                }
            }
        }
    });
}

// Function to populate algorithm select options
function populateAlgorithmSelect() {
    const select = document.getElementById('algorithm-select');
    algorithms.forEach(algo => {
        const option = document.createElement('option');
        option.value = algo.name;
        option.textContent = algo.name;
        select.appendChild(option);
    });
}

// Function to generate cipher text
function generateCipherText(algorithm, key, plaintext) {
    let result;

    switch(algorithm) {
        case "SHA-256":
            result = CryptoJS.SHA256(plaintext).toString();
            break;
        case "AES":
            result = CryptoJS.AES.encrypt(plaintext, key).toString();
            break;
        case "3DES":
            result = CryptoJS.TripleDES.encrypt(plaintext, key).toString();
            break;
        case "RC4":
            result = CryptoJS.RC4.encrypt(plaintext, key).toString();
            break;            
        default:
            throw new Error("Unsupported algorithm");
    }

    return result;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'analyze.html' || currentPage === '') {
        initializeAnalyzePage();
      }
    
    if (currentPage === 'index.html' || currentPage === '') {
        populateAlgorithmTable();
    } else if (currentPage === 'generate_cipher.html') {
        populateAlgorithmSelect();
        
        const algorithmSelect = document.getElementById('algorithm-select');
        const keyInput = document.getElementById('key-input');
        const plaintextInput = document.getElementById('plaintext-input');
        const generateButton = document.getElementById('generate-button');
        const cipherOutput = document.getElementById('cipher-output');
        const copyIcon = document.getElementById('copy-icon');
        
        algorithmSelect.addEventListener('change', () => {
            const selectedAlgo = algorithms.find(a => a.name === algorithmSelect.value);
            keyInput.placeholder = `Enter key (${selectedAlgo.keySize} bits required)`;
        });
        
        generateButton.addEventListener('click', () => {
            const selectedAlgo = algorithms.find(a => a.name === algorithmSelect.value);
            const key = keyInput.value;
            const plaintext = plaintextInput.value;
            
            if (!selectedAlgo) {
                alert('Please select an algorithm');
                return;
            }
            
            if (key.length * 8 < selectedAlgo.keySize) {
                alert(`Key must be at least ${selectedAlgo.keySize} bits long for ${selectedAlgo.name}`);
                return;
            }
            
            try {
                const ciphertext = generateCipherText(selectedAlgo.name, key, plaintext);
                cipherOutput.value = ciphertext;
            } catch (error) {
                console.error('Encryption error:', error);
                alert('An error occurred during encryption. Please check your inputs and try again.');
            }
        });
        
        copyIcon.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(cipherOutput.value);
                
                // Store the original SVG content
                const originalSVG = copyIcon.innerHTML;
                
                // Change to a checkmark
                copyIcon.innerHTML = `
                    <path d="M20 6L9 17l-5-5"></path>
                `;
                
                // Revert back to copy icon after 1 second
                setTimeout(() => {
                    copyIcon.innerHTML = originalSVG;
                }, 1000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text. Please try again.');
            }
        });
    } else if (currentPage === 'algorithm_details.html') {
        const urlParams = new URLSearchParams(window.location.search);
        const algoName = urlParams.get('algo');
        
        if (algoName) {
            document.getElementById('algorithm-name').textContent = algoName;
            drawPerformanceChart(algoName);
        } else {
            console.error('No algorithm specified in URL');
        }
    }
    else if (currentPage === 'decrypt_cipher.html') {
        populateAlgorithmSelect();
        
        const algorithmSelect = document.getElementById('algorithm-select');
        const keyInput = document.getElementById('key-input');
        const ciphertextInput = document.getElementById('ciphertext-input');
        const decryptButton = document.getElementById('decrypt-button');
        const plaintextOutput = document.getElementById('plaintext-output');
        const copyIcon = document.getElementById('copy-icon');
        
        algorithmSelect.addEventListener('change', () => {
            const selectedAlgo = algorithms.find(a => a.name === algorithmSelect.value);
            keyInput.placeholder = `Enter key (${selectedAlgo.keySize} bits required)`;
        });
        
        decryptButton.addEventListener('click', () => {
            const selectedAlgo = algorithms.find(a => a.name === algorithmSelect.value);
            const key = keyInput.value;
            const ciphertext = ciphertextInput.value;
            
            if (!selectedAlgo) {
                alert('Please select an algorithm');
                return;
            }
            
            if (key.length * 8 < selectedAlgo.keySize) {
                alert(`Key must be at least ${selectedAlgo.keySize} bits long for ${selectedAlgo.name}`);
                return;
            }
            
            try {
                const plaintext = decryptCipherText(selectedAlgo.name, key, ciphertext);
                plaintextOutput.value = plaintext;
            } catch (error) {
                console.error('Decryption error:', error);
                alert(error.message || 'An error occurred during decryption. Please check your inputs and try again.');
            }
        });
        
        copyIcon.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(plaintextOutput.value);
                
                const originalSVG = copyIcon.innerHTML;
                
                copyIcon.innerHTML = `
                    <path d="M20 6L9 17l-5-5"></path>
                `;
                
                setTimeout(() => {
                    copyIcon.innerHTML = originalSVG;
                }, 1000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text. Please try again.');
            }
        });
    }
});

// Store plaintext in localStorage when entered
const plaintextInput = document.getElementById('plaintext-input');
if (plaintextInput) {
    plaintextInput.addEventListener('input', () => {
        localStorage.setItem('plaintext', plaintextInput.value);
        localStorage.setItem('plaintextSize', plaintextInput.value.length);
    });
}