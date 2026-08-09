const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '';

function updateDisplay(value) {
  display.value = value;
}

function clearExpression() {
  expression = '';
  updateDisplay('0');
}

function deleteLastCharacter() {
  expression = expression.slice(0, -1);
  updateDisplay(expression || '0');
}

function evaluateExpression() {
  if (!expression) return;

  const sanitized = expression.replace(/×/g, '*').replace(/÷/g, '/');
  const validPattern = /^[0-9.+\-*/()\s]+$/;

  if (!validPattern.test(sanitized)) {
    updateDisplay('Error');
    expression = '';
    return;
  }

  try {
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (!Number.isFinite(result)) {
      throw new Error('Invalid result');
    }

    const normalized = String(result);
    expression = normalized;
    updateDisplay(normalized);
  } catch (error) {
    updateDisplay('Error');
    expression = '';
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === 'clear') {
      clearExpression();
      return;
    }

    if (action === 'delete') {
      deleteLastCharacter();
      return;
    }

    if (action === 'equals') {
      evaluateExpression();
      return;
    }

    if (display.value === 'Error') {
      expression = '';
      updateDisplay('0');
    }

    if (display.value === '0' && value !== '.') {
      expression = value;
      updateDisplay(value);
      return;
    }

    expression += value;
    updateDisplay(expression);
  });
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    event.preventDefault();
    const button = document.querySelector(`[data-value="${key}"]`);
    if (button) {
      button.click();
    }
  }

  if (['+', '-', '*', '/', '%'].includes(key)) {
    event.preventDefault();
    const mapped = key === '%' ? '/' : key;
    const button = document.querySelector(`[data-value="${mapped}"]`);
    if (button) {
      button.click();
    }
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    document.querySelector('[data-action="equals"]').click();
  }

  if (key === 'Backspace') {
    event.preventDefault();
    document.querySelector('[data-action="delete"]').click();
  }

  if (key === 'Escape') {
    event.preventDefault();
    document.querySelector('[data-action="clear"]').click();
  }
});
