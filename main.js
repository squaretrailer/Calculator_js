// ============================================
// DOM Element References
// ============================================
const display = document.getElementById('display');
const historyList = document.getElementById('history-list');
const errorMessageDiv = document.getElementById('error-message');

// ============================================
// Helper Functions
// ============================================
function updateDisplay(value) {
    display.value = value || '0';
}

function getDisplayValue() {
    return display.value;
}

function showError(msg) {
    errorMessageDiv.textContent = msg;
    errorMessageDiv.classList.add('show');
    setTimeout(() => {
        errorMessageDiv.classList.remove('show');
    }, 3000);
}

function clearError() {
    errorMessageDiv.classList.remove('show');
    errorMessageDiv.textContent = '';
}

// ============================================
// Calculator Functions
// ============================================
function appendNumber(num) {
    clearError();
    let current = getDisplayValue();
    if (current === '0' && num !== '.') {
        current = '';
    }
    updateDisplay(current + num);
}

function appendOperator(op) {
    clearError();
    let current = getDisplayValue();
    const lastChar = current.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        current = current.slice(0, -1) + op;
        updateDisplay(current);
    } else {
        updateDisplay(current + op);
    }
}

function appendDecimal() {
    clearError();
    let current = getDisplayValue();
    const tokens = current.split(/[\+\-\*\/]/);
    const lastNumber = tokens[tokens.length - 1];
    if (!lastNumber.includes('.')) {
        updateDisplay(current + '.');
    }
}

function clearDisplay() {
    clearError();
    updateDisplay('0');
}

function deleteLast() {
    clearError();
    let current = getDisplayValue();
    if (current.length === 1 || (current.length === 2 && current[0] === '-')) {
        updateDisplay('0');
    } else {
        updateDisplay(current.slice(0, -1));
    }
}

function toggleSign() {
    clearError();
    let current = getDisplayValue();
    if (current === '0' || current === '') return;
    if (current[0] === '-') {
        updateDisplay(current.slice(1));
    } else {
        updateDisplay('-' + current);
    }
}

function appendPercentage() {
    clearError();
    let current = getDisplayValue();
    let num = parseFloat(current);
    if (!isNaN(num)) {
        updateDisplay((num / 100).toString());
    } else {
        showError('Invalid number for percentage');
    }
}

function calculate() {
    clearError();
    let expression = getDisplayValue();
    if (expression === '' || expression === '0') return;

    let result;
    try {
        const sanitized = expression.replace(/[^0-9+\-*/.()]/g, '');
        result = new Function('return (' + sanitized + ')')();
        if (!isFinite(result)) {
            throw new Error('Division by zero or math error');
        }
        result = parseFloat(result.toFixed(10));
    } catch (error) {
        result = 'Error';
        showError('Invalid expression: ' + error.message);
    }

    if (result !== 'Error') {
        addToHistory(expression, result);
        updateDisplay(result.toString());
    } else {
        updateDisplay('Error');
    }
}

// Add to history with delete button
function addToHistory(expression, result) {
    const li = document.createElement('li');
    const textSpan = document.createElement('span');
    textSpan.textContent = `${expression} = ${result}`;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'delete-history';
    deleteBtn.setAttribute('aria-label', 'Delete history item');
    
    deleteBtn.addEventListener('click', () => li.remove());
    
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    historyList.prepend(li);
    
    // Keep only last 10 items
    if (historyList.children.length > 10) {   // change 10 to any number
    historyList.removeChild(historyList.lastChild);
}
}

// Optional: clear all history (call from a button if you add one)
function clearAllHistory() {
    while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
    }
}