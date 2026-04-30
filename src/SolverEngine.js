import { parse } from "mathjs";
import * as math from "mathjs";
const bisection = (f, xl, xu, tol) => {
    let iteration = [];
    let xr = (xl + xu) / 2;
    let error = Math.abs(f(xr));
    if (isNaN(f(xl)) || isNaN(f(xu))) {
        alert("Function result is NaN. Check your formula!");
        return [];
    }
    while (error > tol && iteration.length < 100) {
        if (f(xl) * f(xr) < 0) {
            xu = xr;
        } else {
            xl = xr;
        }
        xr = (xl + xu) / 2;
        error = Math.abs(f(xr));
        let nums = {"iteration": iteration.length+1,"xl": xl, "f(xl)": f(xl), "xu": xu, "f(xu)": f(xu), "xr": xr, "f(xr)": f(xr), "error": error};
        iteration.push(nums);
    }
    return iteration;
}

const falsePosition = (f, xl, xu, tol) => {
    let iteration = [];
    let xr = (xl * f(xu) - xu * f(xl)) / (f(xu) - f(xl));
    let error = Math.abs(f(xr));
    if (isNaN(f(xl)) || isNaN(f(xu))) {
        alert("Function result is NaN. Check your formula!");
        return [];
    }
    if (f(xl) * f(xu) >= 0) {
        alert("f(xl) and f(xu) must have different signs!");
        return [];
    }
    while (error > tol && iteration.length < 100) {
        if (f(xl) * f(xr) < 0) {
            xu = xr;
        } else {
            xl = xr;
        }
        xr = (xl * f(xu) - xu * f(xl)) / (f(xu) - f(xl));
        error = Math.abs(f(xr));
        let nums = {"iteration": iteration.length+1,"xl": xl, "f(xl)": f(xl), "xu": xu, "f(xu)": f(xu), "xr": xr, "f(xr)": f(xr), "error": error};
        iteration.push(nums);
    }
    return iteration;
}

const newtonRaphson = (f, df, x0, tol) => {
    let iteration = [];
    let x = x0;
    if (isNaN(f(x0)) || isNaN(f(x))) {
        alert("Function result is NaN. Check your formula!");
        return [];
    }
    while (iteration.length < 100) {
        let fx = f(x);
        let h = Math.abs(x) > 1 ? 0.0001 * x : 0.0001;
        let df_val = df(x);
       if(Math.abs(df_val) <1e-10){
        alert("Derivative is zero. Try another method!");
        return [];
       }
       let xNext = x - fx / df_val;
       let error = Math.abs(xNext - x);
       iteration.push({
            "iteration": iteration.length+1,
            "x0": x,
            "f(x0)": fx,
            "xr": xNext,
            "f(xr)": f(xNext),
            "error": error
        });
        x = xNext;
        if(error < tol){
            break;
        }
    }
    return iteration;
}

const secant = (f, x0,x1,tol) => {
    let iteration = [];
    let x_prev = x0;
    let x_curr = x1;
    while(iteration.length <100){
        let f0 = f(x_prev);
        let f1 = f(x_curr);
        if(Math.abs(f1-f0)<1e-10){
            alert("Denominator is too small! Secant failed.");
            return iteration;
        }
        let xNext = x_curr - f1 * (x_curr - x_prev) / (f1 - f0);
        let error = Math.abs(xNext - x_curr);
        iteration.push({
            "iteration": iteration.length+1,
            "x0": x_prev,
            "f(x0)": f0,
            "x1": x_curr,
            "f(x1)": f1,
            "xr": xNext,
            "f(xr)": f(xNext),
            "error": error
        });
        x_prev = x_curr;
        x_curr = xNext;
        if(error < tol){
            break;
        }
        
    }
    return iteration;
}

const fixedPoint = (g, x0, tol) => {
    let iteration = [];
    let xr = g(x0);
    let error = Math.abs(xr - x0);
    if (isNaN(g(x0))) {
        alert("Function result is NaN. Check your formula!");
        return [];
    }
    while (error > tol && iteration.length < 100) {
        x0 = xr;
        xr = g(x0);
        error = Math.abs(xr - x0);
        let nums = {"iteration": iteration.length+1,"x0": x0, "g(x0)": g(x0), "xr": xr, "g(xr)": g(xr), "error": error};
        iteration.push(nums);
    }
    return iteration;
}

// Guass Elimination 

const parseEquation = (eq) => {
    const A =[];
    const B = [];
    const variables = ['x','y','z']
    eq.forEach((equation) =>{
        const [left, right] = equation.split('=');
        B.push(parseFloat(right));
        const node = parse(left);
        const row = [];
        variables.forEach( v =>{
            const coeff = node.evaluate(
                {[v]: 1, ...variables.filter(varName => varName !== v).reduce((acc, varName) => (
                    {...acc, [varName]: 0}
                ),{})
                })
                row.push(coeff);
        });
        A.push(row);
    });
    return [A, B];
}
const guassElimination = (A, B) => {
    let n = A.length;
    for (let i = 0; i < n; i++) {
        let mxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(A[j][i]) > Math.abs(A[mxRow][i])) {
                mxRow = j;
            }
        }
        
        [A[i], A[mxRow]] = [A[mxRow], A[i]];
        [B[i], B[mxRow]] = [B[mxRow], B[i]];
        if(Math.abs(A[i][i])<1e-10){
            alert("Matrix is singular!");
            return [];
        }
        let pivot = A[i][i];
        for (let j = i; j < n; j++) A[i][j]/=pivot;
        B[i]/=pivot;
        // Eliminate other rows (Forward Elimination)
        for (let k = 0; k < n; k++) {
            if(k!==i){
                let factor = A[k][i];
                for (let j = 0; j < n; j++) {
                    A[k][j] -= factor * A[i][j];
                }
                B[k] -= factor * B[i];
            }
        }

    }
    
    
    return B;
}

// Cramer Rule 
const cramerRule = (A,B) => {
    const n = A.length;
    let D = math.det(A);
    if(Math.abs(D)<1e-10){
        alert("Matrix is singular!");
        return [];
    }
    let solutions = [];
    for (let i = 0; i < n; i++) {
        let Ai = A.map(row => [...row]);
        for (let j = 0; j <n; j++) {
            Ai[j][i] = B[j];
        }
        solutions.push(math.det(Ai)/D);
    }
    return solutions;
};

// LU Decomposition
const luDecomposition = (A, B) => {
    const n = A.length;
    let L = math.zeros(n, n).toArray();
    let U = math.zeros(n, n).toArray();
    for (let i = 0; i < n; i++) {
        L[i][i] = 1;
    }
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            U[i][j] = A[i][j];
            for (let k = 0; k < i; k++) {
                U[i][j] -= L[i][k] * U[k][j];
            }
        }
        for (let j = i + 1; j < n; j++) {
            L[j][i] = A[j][i];
            for (let k = 0; k < i; k++) {
                L[j][i] -= L[j][k] * U[k][i];
            }
            L[j][i] /= U[i][i];
        }
    }
    let y = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
            sum += L[i][j] * y[j];
        }
        y[i] = B[i] - sum; 
    }
    let x = new Array(n).fill(0);
    for (let i = n-1; i >= 0; i--) {
        let sum = 0;
        for (let j = i+1; j < n; j++) {
            sum += U[i][j] * x[j];
        }
        x[i] = (y[i] - sum) / U[i][i];
    }
    return x;

};


export {bisection, falsePosition, newtonRaphson, secant, fixedPoint, guassElimination, parseEquation, cramerRule, luDecomposition};