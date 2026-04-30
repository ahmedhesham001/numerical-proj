import { useState } from "react";
import { parse } from "mathjs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,ReferenceLine } from 'recharts';

import { guassElimination, cramerRule, luDecomposition, parseEquation } from "./SolverEngine";

function Linear(){
    const [inputs, setInputs] = useState({ equations: [""], method: "Gauss Elimination" });
    const [results, setResults] = useState([]);

    function solve(){
        if(inputs.equations.some(eq => eq === "")) {
            alert("Please fill all equations!");
            return;
        }
        try{
            const [A, B] = parseEquation(inputs.equations);
            console.log(A, B);
            if(inputs.method === "Gauss Elimination"){
                const solution = guassElimination(A, B);
                if(solution.some(isNaN)) {
                    alert("The system has no solution or is singular!");
                    return;
                }
                setResults(solution);
            }else if(inputs.method === "Cramer"){
                const solution = cramerRule(A, B);
                if(solution.some(isNaN)) {
                    alert("The system has no solution or is singular!");
                    return;
                }
                setResults(solution);
            }else if(inputs.method === "LU Decomposition"){
                const solution = luDecomposition(A, B);
                if(solution.some(isNaN)) {
                    alert("The system has no solution or is singular!");
                    return;
                }
                setResults(solution);
            }
        } catch (e) {
            console.log(e);
            alert("Invalid equation!");
            return;
        }
    }
    const generateGraph = (equations) => {
    try {
        const [A, B] = parseEquation(equations);
        const points = [];
        for (let x = -10; x <= 10; x += 1) {
            let point = { x_val: x };
            A.forEach((row, i) => {
                const y = row[1] !== 0 ? (B[i] - row[0] * x) / row[1] : null;
                point[`eq${i + 1}`] = y;
            });
            points.push(point);
        }
        return points;
    } catch (e) {
        return [];
    }
};
    return(
        <div>
            <h1>Linear Algebra Methods</h1>
            <div style={{display: "flex",gap: "1rem",justifyContent: "center",alignItems: "center",flexDirection: "row"}}>
                {['Gauss Elimination','LU Decomposition','Cramer'].map((m) => (
                <button 
                    key={m} 
                    onClick={() => setInputs({ ...inputs, method: m })}
                    className={inputs.method === m ? 'active' : ''}
                >
                    {m}
                </button>
            ))}
            </div>
            <h2>Enter the equations for {inputs.method}:</h2>
            <form action="" style={{display: "flex",gap: "1rem",justifyContent: "center",alignItems: "center",flexDirection: "column",marginBottom: "2rem"}}>
                {[...Array(3)].map((_, i) => (
                    <input key={i} type="text" placeholder={`Equation ${i+1}`} value={inputs.equations[i]} onChange={(e) => setInputs({ ...inputs, equations: [...inputs.equations.slice(0, i), e.target.value, ...inputs.equations.slice(i+1)] })} />
                ))}
                <button type="button" onClick={() => solve()}>Solve</button>
            </form>
            {results.length > 0 && (
               <div>
                 <div style={{display: "flex",gap: "2rem",justifyContent: "center",alignItems: "center",flexDirection: "column"}}>
                    <h2>Solution:</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Variable</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={index}>
                                    <td>x{index+1}</td>
                                    <td>{result.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ width: '100%', height: 400, marginTop: '2rem', background: '#1e1e1e', padding: '1rem', borderRadius: '8px' }}>
                    <h3 style={{color: '#fff'}}>Visual Representation of f(x)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateGraph(inputs.equations)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="x_val" stroke="#ccc" type="number" domain={[-10, 10]} />
                            <YAxis stroke="#ccc" domain={[-10, 10]} />
                            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} />
                            <Legend />
                            
                            <Line type="monotone" dataKey="eq1" stroke="#4CAF50" name="Eq 1" dot={false} strokeWidth={2} isAnimationActive={false} />
                            <Line type="monotone" dataKey="eq2" stroke="#2196F3" name="Eq 2" dot={false} strokeWidth={2} isAnimationActive={false} />
                            <Line type="monotone" dataKey="eq3" stroke="#FF9800" name="Eq 3" dot={false} strokeWidth={2} isAnimationActive={false} />
                            
                            {results.length >= 2 && (
                                <ReferenceLine x={results[0]} stroke="white" strokeDasharray="3 3" label="x solution" />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
               </div>
            )}
        </div>
    )
}

export default Linear;