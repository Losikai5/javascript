// Calculator JavaScript Functions
let display = document.getElementById('display');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Initialize display
display.value = '0';

function appendToDisplay(input) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    
    if (display.value === '0' && input !== '.') {
        display.value = input;
    } else {
        display.value += input;
    }
}

function appendOperator(op) {
    if (shouldResetDisplay) {
        shouldResetDisplay = false;
    }
    
    // Prevent multiple operators in a row
    const lastChar = display.value.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        display.value = display.value.slice(0, -1) + op;
    } else {
        display.value += op;
    }
}

function calculateResult() {
    try {
        // Replace any display formatting and evaluate
        const result = eval(display.value);
        
        if (!isFinite(result)) {
            display.value = 'Error';
        } else {
            // Round to prevent floating point precision issues
            display.value = Math.round(result * 100000000) / 100000000;
        }
        
        shouldResetDisplay = true;
    } catch (error) {
        display.value = 'Error';
        shouldResetDisplay = true;
    }
}

function clearDisplay() {
    display.value = '0';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

function deleteLast() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Prevent invalid decimal input
function validateDecimal() {
    const currentValue = display.value;
    const lastOperatorIndex = Math.max(
        currentValue.lastIndexOf('+'),
        currentValue.lastIndexOf('-'),
        currentValue.lastIndexOf('*'),
        currentValue.lastIndexOf('/')
    );
    
    const currentNumber = currentValue.substring(lastOperatorIndex + 1);
    return !currentNumber.includes('.');
}

// Override the appendToDisplay for decimal validation
const originalAppendToDisplay = appendToDisplay;
appendToDisplay = function(input) {
    if (input === '.' && !validateDecimal()) {
        return; // Don't add decimal if one already exists in current number
    }
    originalAppendToDisplay(input);
};