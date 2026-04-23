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

// console.log(falsePosition((x) => -26+82.3*x-88*x**2+45.4*x**3-9*x**4+0.65*x**5, 0.5, 1, 0.002));

export {bisection, falsePosition, newtonRaphson, secant, fixedPoint};