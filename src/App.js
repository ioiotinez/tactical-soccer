import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Field from "./features/Field/Field";
import Header from "./components/Header/Header";
import "./App.css";

function App() {
	return (
		<DndProvider backend={HTML5Backend}>
			<div className="App">
				<Header />
				<Field />
			</div>
		</DndProvider>
	);
}

export default App;
