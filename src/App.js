import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Field from "./Field";
import "./App.css";

function App() {
	return (
		<DndProvider backend={HTML5Backend}>
			<div className="App">
				<Field />
			</div>
		</DndProvider>
	);
}

export default App;
