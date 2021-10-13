import logo from "./logo.svg";
import "./App.css";
import { Gant, GantContainer } from "./Gant";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>This is a disgram</p>
        <div style={{ width: "30%", height:"200px"}}>
          <GantContainer />
        </div>
      </header>
    </div>
  );
}

export default App;
