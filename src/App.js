import logo from "./logo.svg";
import "./App.css";
import { Gant, GantContainer } from "./Gant";
import { useState } from "react";

const dataSet = [
  {
    id: "dkøjdjgk",
    sortId: 0,
    task: "Hannah kristiania",
    category: "A",
    startTime: new Date("2013-02-02 08:00"),
    endTime: new Date("2013-02-02 21:00"),
    details: "This actually didn't take any conceptualization",
  },

  {
    id: "ldjkhg",
    sortId: 1,
    task: "Sjoborg",
    category: "A",
    startTime: new Date("2013-02-02 12:00"),
    endTime: new Date("2013-02-02 15:00"),
    details: "No sketching either, really",
  },

  {
    id: "ieoeiy",
    sortId: 2,
    task: "Viking Avant",
    category: "B",
    startTime: new Date("2013-2-2 15:00"),
    endTime: new Date("2013-2-2 19:00"),
  },

  {
    id: "srexsr",
    sortId: 3,
    task: "Havila Charisma",
    category: "C",
    startTime: new Date("2013-02-02 13:00"),
    endTime: new Date("2013-02-02 16:30"),
    details: "all three lines of it",
  },

  {
    id: "opkpkp",
    sortId: 4,
    task: "Far Searcher",
    category: "D",
    startTime: new Date("2013-02-02 19:00"),
    endTime: new Date("2013-02-02 21:30"),
  },
  {
    id: "dpodppd",
    sortId: 5,
    task: "Fram",
    category: "D",
    startTime: new Date("2013-02-02 08:25"),
    endTime: new Date("2013-02-02 17:30"),
  },
  {
    id: "dojd3o",
    sortId: 6,
    task: "Maritime",
    category: "E",
    startTime: new Date("2013-02-02 08:00"),
    endTime: new Date("2013-02-02 16:30"),
    details: "This counts, right?",
  },
];

function App() {
  const [data, setData] = useState(dataSet);
  const [entry, setEntry] = useState({});

  const addEntry = () => {
    
    const newData = [
      ...data,
      {
        ...entry,
        id: (Math.random()*10000).toString(),
        startTime: new Date("2013-02-02 " + entry.startTime),
        endTime: new Date("2013-02-02 " + entry.endTime),
      },
    ].sort((a, b) => {
      if (a.category > b.category) return 1;
      if (a.category < b.category) return -1;
      return 0;
    })
    .map((d, id) => ({ ...d, sortId: id }));
    
    setData(newData)

  };

  return (
    <div className="App">
      <header className="App-header">
        <p>This is a disgram</p>
        <div style={{ width: "60%", height: "500px" }}>
          <Gant data={data} />
        </div>
        <form onSubmit={(e) => {e.preventDefault(); addEntry()}}>
          <input
            type="text"
            value={entry.task}
            onChange={(e) => setEntry({ ...entry, task: e.target.value })}
            placeholder="task"
          />
          <input
            type="text"
            value={entry.category}
            onChange={(e) => setEntry({ ...entry, category: e.target.value })}
            placeholder="category"
          ></input>
          <input
            type="text"
            value={entry.startTime}
            onChange={(e) => setEntry({ ...entry, startTime: e.target.value })}
            placeholder="startTime"
          ></input>
          <input
            type="text"
            value={entry.endTime}
            onChange={(e) => setEntry({ ...entry, endTime: e.target.value })}
            placeholder="endTime"
          ></input>
          <button type="submit">legg til</button>
        </form>
      </header>
    </div>
  );
}

export default App;
