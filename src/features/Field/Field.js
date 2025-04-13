import React, { useState } from "react";
import Player from "../../components/Player/Player";
import "../../styles/Field.css";
import { useDrop } from "react-dnd";

const calculateAngle = (x1, y1, x2, y2) => {
	return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
};

const Field = () => {
	const [players, setPlayers] = useState({
		team1: {},
		team2: {},
	});
	const [isArrowMode, setIsArrowMode] = useState(false);
	const [arrows, setArrows] = useState([]);
	const [arrowColor, setArrowColor] = useState("black");

	const handleArrowColorChange = (color) => {
		setArrowColor(color);
	};

	const [, drop] = useDrop(() => ({
		accept: "player",
		drop: (item, monitor) => {
			const delta = monitor.getDifferenceFromInitialOffset();
			if (!delta) return;

			setPlayers((prevPlayers) => {
				const team = item.team;
				const player = prevPlayers[team][item.id];
				return {
					...prevPlayers,
					[team]: {
						...prevPlayers[team],
						[item.id]: {
							...player,
							left: player.left + delta.x,
							top: player.top + delta.y,
						},
					},
				};
			});
		},
	}));

	const [, trashDrop] = useDrop(() => ({
		accept: "player",
		drop: (item) => {
			setPlayers((prevPlayers) => {
				const { [item.id]: _, ...remainingPlayers } = prevPlayers[item.team];
				return {
					...prevPlayers,
					[item.team]: remainingPlayers,
				};
			});
		},
	}));

	const addPlayerToTeam = (team) => {
		setPlayers((prevPlayers) => {
			const newId = Object.keys(prevPlayers[team]).length + 1;
			const defaultPosition =
				team === "team1"
					? { left: 50, top: 50 } // Left side for Team 1
					: { left: 750, top: 50 }; // Right side for Team 2 (corrected position)
			return {
				...prevPlayers,
				[team]: {
					...prevPlayers[team],
					[newId]: { ...defaultPosition, name: `Player ${newId}` },
				},
			};
		});
	};

	const handleFieldClick = (e) => {
		if (!isArrowMode) return;
		const rect = e.target.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setArrows((prevArrows) => [...prevArrows, { x, y, endX: x + 50, endY: y }]);
	};

	const handleFieldMouseDown = (e) => {
		if (!isArrowMode) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setArrows((prevArrows) => [
			...prevArrows,
			{ x, y, endX: x, endY: y, isDrawing: true, color: arrowColor },
		]);
	};

	const handleFieldMouseMove = (e) => {
		if (
			!isArrowMode ||
			arrows.length === 0 ||
			!arrows[arrows.length - 1].isDrawing
		)
			return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		setArrows((prevArrows) => {
			const updatedArrows = [...prevArrows];
			updatedArrows[updatedArrows.length - 1] = {
				...updatedArrows[updatedArrows.length - 1],
				endX: x,
				endY: y,
			};
			return updatedArrows;
		});
	};

	const handleFieldMouseUp = () => {
		if (!isArrowMode || arrows.length === 0) return;
		setArrows((prevArrows) => {
			const updatedArrows = [...prevArrows];
			updatedArrows[updatedArrows.length - 1].isDrawing = false;
			return updatedArrows;
		});
	};

	const toggleArrowMode = (color) => {
		setIsArrowMode((prev) => (arrowColor === color ? !prev : true));
		setArrowColor(color);
	};

	const clearArrows = () => {
		setArrows([]);
	};

	return (
		<div>
			<div style={{ marginBottom: "10px" }}>
				<button
					onClick={() => addPlayerToTeam("team1")}
					style={{ marginRight: "10px" }}
				>
					Add Player to Team 1
				</button>
				<button onClick={() => addPlayerToTeam("team2")}>
					Add Player to Team 2
				</button>
				<button onClick={clearArrows} style={{ marginRight: "10px" }}>
					Clear All Arrows
				</button>
				<button
					onClick={() => toggleArrowMode("blue")}
					style={{
						marginRight: "10px",
						backgroundColor: "blue",
						color: "white",
					}}
				>
					{isArrowMode && arrowColor === "blue"
						? "Disable Blue Arrows"
						: "Enable Blue Arrows"}
				</button>
				<button
					onClick={() => toggleArrowMode("red")}
					style={{
						marginRight: "10px",
						backgroundColor: "red",
						color: "white",
					}}
				>
					{isArrowMode && arrowColor === "red"
						? "Disable Red Arrows"
						: "Enable Red Arrows"}
				</button>
			</div>
			<div
				ref={drop}
				className="field"
				onMouseDown={handleFieldMouseDown}
				onMouseMove={handleFieldMouseMove}
				onMouseUp={handleFieldMouseUp}
				style={{ position: "relative" }}
			>
				{/* Render arrows */}
				{arrows.map((arrow, index) => (
					<svg
						key={index}
						style={{ position: "absolute", left: 0, top: 0 }}
						height="100%"
						width="100%"
					>
						<line
							x1={arrow.x}
							y1={arrow.y}
							x2={arrow.endX}
							y2={arrow.endY}
							style={{ stroke: arrow.color, strokeWidth: 2 }}
						/>
						<circle cx={arrow.endX} cy={arrow.endY} r={5} fill={arrow.color} />
					</svg>
				))}
				{/* Render players */}
				{Object.entries(players.team1).map(([id, { left, top, name }]) => (
					<Player
						key={`team1-${id}`}
						id={id}
						left={left}
						top={top}
						team="team1"
						color="blue"
						name={name}
					/>
				))}
				{Object.entries(players.team2).map(([id, { left, top, name }]) => (
					<Player
						key={`team2-${id}`}
						id={id}
						left={left}
						top={top}
						team="team2"
						color="red"
						name={name}
					/>
				))}
			</div>
			<div
				ref={trashDrop}
				style={{
					marginTop: "20px",
					height: "50px",
					backgroundColor: "#f44336",
					color: "white",
					textAlign: "center",
					lineHeight: "50px",
				}}
			>
				Drag here to delete
			</div>
		</div>
	);
};

export default Field;
