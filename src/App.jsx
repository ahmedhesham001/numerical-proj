import { useState } from "react"
import { falsePosition } from "./SolverEngine"
import { bisection } from "./SolverEngine"
import { newtonRaphson } from "./SolverEngine"
import { secant } from "./SolverEngine"
import { fixedPoint } from "./SolverEngine"
import { derivative, evaluate } from "mathjs";

function App() {
  const [inputs, setInputs] = useState({ func: "", xl: "", xu: "", x0: "", x1: "", tol: "", method: "falsePosition" });
  const [results, setResults] = useState([]);
  function solve() {
    const requiredKeys = methodRequirements[inputs.method]; 
    for(let key of requiredKeys) {
      if(!inputs[key]) { 
        alert(`Please fill the ${key} field!`); 
        return; 
      }
    }
    const normalizedFunc = inputs.func.replace(/\*\*/g, '^'); 
    const f = (x) => evaluate(normalizedFunc, { x: x });
    const dfString = derivative(normalizedFunc, "x").toString();
    const df = (x) => {
      try{
        return evaluate(dfString, {x:x});
      }catch(e){
        console.log(e);
        return 0;
      }
    };
    const solvers = {
      bisection: () => bisection(f, parseFloat(inputs.xl), parseFloat(inputs.xu), parseFloat(inputs.tol)),
      falsePosition: () => falsePosition(f, parseFloat(inputs.xl), parseFloat(inputs.xu), parseFloat(inputs.tol)),
      newtonRaphson: () => newtonRaphson(f,df, parseFloat(inputs.x0), parseFloat(inputs.tol)),
      secant: () => secant(f, parseFloat(inputs.x0), parseFloat(inputs.x1), parseFloat(inputs.tol)),
      fixedPoint: () => fixedPoint(f, parseFloat(inputs.x0), parseFloat(inputs.tol))
    };

    const data = solvers[inputs.method]();
    setResults(data);
    setInputs({ func: "", xl: "", xu: "", x0: "", x1: "", tol: "", method: inputs.method });
  }
  const methodRequirements = {
  bisection: ["func", "xl", "xu", "tol"],
  falsePosition: ["func", "xl", "xu", "tol"],
  newtonRaphson: ["func", "x0", "tol"],
  secant: ["func", "x0", "x1", "tol"],
  fixedPoint: ["func", "x0", "tol"],
};
  return (
    <div style={{display: "flex",flexDirection: "column",alignItems: "center",justifyContent: "center", gap: "1rem"}}>
      <h1>Numerical Methods</h1>
      <div style={{display: "flex",gap: "1rem",justifyContent: "center",alignItems: "center",flexDirection: "row"}}>
        {Object.keys(methodRequirements).map((m) => (
          <button 
            key={m} 
            onClick={() => setInputs({ ...inputs, method: m })}
            className={inputs.method === m ? 'active' : ''}
          >
            {m}
          </button>
        ))}
      </div>
      <h2>Enter the values for {inputs.method}:</h2>
      <form action="" style={{display: "flex",gap: "1rem",justifyContent: "center",alignItems: "center",flexDirection: "row",marginBottom: "2rem"}}>
        {methodRequirements[inputs.method].map((input) => (
          <input key={input} placeholder={input} value={inputs[input]} onChange={(e) => setInputs({ ...inputs, [input]: e.target.value })} />
        ))}
        <button type="button" onClick={() => solve()}>Solve</button>
      </form>
      {results.length > 0 ?(
        <div style={{display: "flex",justifyContent: "center",alignItems: "center",flexDirection: "column", gap: "1rem",marginTop: "1rem"}}>
        <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: "800px" }}>
          <thead>
            <tr style={{borderBottom: "2px solid #ccc"}}>
              {results.length > 0 && Object.keys(results[0]).map((key) => (
                <th key={key} style={{padding: "12px", textAlign: "center"}}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #444" }}>
                {Object.values(row).map((val, i) => (
                  <td key={i} style={{padding: "15px", textAlign: "left"}}>{typeof val === 'number' && i > 0 && val!=results[results.length - 1].xr ? val.toFixed(4) : val===results[results.length - 1].xr ? <span style={{fontWeight: "bold", color: "#4CAF50"}}>{val.toFixed(4)}</span> : val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <h2>xr = {results[results.length - 1].xr.toFixed(4)}</h2>
        </div>
      ):(<p>No results</p>)}
    </div>
  )
}

export default App;