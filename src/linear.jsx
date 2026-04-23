import { useState } from "react";
import { parse } from "mathjs";
import { guassElimination } from "./SolverEngine";
import {parseEquation} from "./SolverEngine"

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
            const solution = guassElimination(A, B);
            if(solution.some(isNaN)) {
                alert("The system has no solution or is singular!");
                return;
            }
            setResults(solution);
        } catch (e) {
            console.log(e);
            alert("Invalid equation!");
            return;
        }
    }
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
            )}
        </div>
    )
}

export default Linear;