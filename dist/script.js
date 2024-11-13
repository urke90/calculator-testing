"use strict";
class Calculator {
    constructor() {
        this.state = {
            a: 0,
            b: 0,
            score: 0,
        };
        this.methods = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
            '%': (a, b) => (a / b) * 100,
        };
    }
    operate(a, b, operator) {
        this.state.a = a;
        this.state.b = b;
        this.state.score = this.methods[operator](a, b);
    }
}
const calculator = new Calculator();
calculator.operate(2, 4, '+');
