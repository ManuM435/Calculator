document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('result');
    const numberButtons = document.querySelectorAll('.numberButtons');
    const operatorButtons = document.querySelectorAll('.operatorButtons');
    const equalsButton = document.getElementById('equalsButton');
    const miscButtons = document.querySelectorAll('.miscButtons');

    let currentNumber = '';
    let pendingOperation = null;
    let isNewNumber = true;

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const number = button.textContent;
            appendToDisplay(number);
        });
    });

    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const operator = button.textContent;
            handleOperator(operator);
        });
    });

    // Add event listeners to miscellaneous buttons
    miscButtons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonValue = button.textContent;
            handleMiscButton(buttonValue);
        });
    });

    equalsButton.addEventListener('click', calculateResult);

    function appendToDisplay(number) {
        if (isNewNumber) {
            if (number === ',') {
                display.value = '0.';
            } else {
                display.value = number;
            }
            isNewNumber = false;
        } else {
            if (display.value === '0') {
                if (number === ',') {
                    display.value = '0.';
                } else {
                    display.value = number;
                }
            } else {
                if (number === ',' && display.value.includes('.')) {
                    return;
                }
                
                if (number === ',') {
                    display.value += '.';
                } else {
                    if (display.value.length < 7) {
                        display.value += number;
                    } else {
                    }
                }
            }
        }
    }    

    // Function to handle operators
    function handleOperator(operator) {
        if (operator === '=') {
            calculateResult(); // Calculate the result if "=" is clicked
            isNewNumber = true; // Set isNewNumber to true for the next input
            pendingOperation = null; // Reset pendingOperation after calculation
            return;
        }
        if (currentNumber === '') {
            currentNumber = display.value;
        } else {
            if (pendingOperation !== null) {
                // If there's already a pending operation, update it to the new operator
                pendingOperation = operator;
                return;
            }
            calculateResult(); // Calculate the result if there's a pending operation
            currentNumber = display.value; // Update currentNumber with the result
        }
        pendingOperation = operator;
        isNewNumber = true;
    }

    function calculateResult() {
        const operand1 = parseFloat(currentNumber);
        const operand2 = parseFloat(display.value);
        let result;
    
        switch (pendingOperation) {
            case '+':
                result = operand1 + operand2;
                break;
            case '-':
                result = operand1 - operand2;
                break;
            case '×':
                result = operand1 * operand2;
                break;
            case '÷':
                result = operand1 / operand2;
                break;
            default:
                return;
        }

        if (!isFinite(result)) {
            display.value = 'Error';
            return;
        }

        // Convert result to string
        let resultString = result.toString();

        // Round to 7 significant figures
        if (Math.abs(result) >= 1e8) {
            resultString = result.toExponential(3);
        } else {
            // Round to 7 significant figures if the result has a decimal point
            if (resultString.includes('.')) {
                const decimalIndex = resultString.indexOf('.');
                const integerPart = resultString.slice(0, decimalIndex);
                const decimalPart = resultString.slice(decimalIndex + 1);
    
                if (integerPart.length > 7) {
                    resultString = result.toPrecision(7);
                } else {
                    const remainingDigits = 7 - integerPart.length;
                    resultString = result.toFixed(remainingDigits);
                }
            }
        }

        // Update display with the rounded result
        display.value = resultString;
    }

    // Function to handle miscellaneous buttons
    function handleMiscButton(button) {
        switch (button) {
            case 'AC':
                clearDisplay();
                break;
            case '⁺∕₋':
                toggleSign();
                break;
            case '%':
                applyPercentage();
                break;
            default:
                return;
        }
    }

    // Function to clear the display
    function clearDisplay() {
        display.value = '0';
        currentNumber = '';
        pendingOperation = null;
        isNewNumber = true;
    }

    // Function to toggle the sign of the number
    function toggleSign() {
        if (display.value !== '0') {
            if (display.value.charAt(0) === '-') {
                display.value = display.value.slice(1);
            } else {
                display.value = '-' + display.value;
            }
        }
    }

    // Function to apply percentage
    function applyPercentage() {
        const currentValue = parseFloat(display.value);
        const newValue = currentValue / 100;
        display.value = newValue.toString();
    }
});
