import React, { useState } from "react";
import Player from "../../components/Player/Player";
import CentralCircle from "../../components/CentralCircle/CentralCircle";
import Arrow from "../../components/Arrow/Arrow";
import TrashZone from "../../components/TrashZone/TrashZone";
import "../../styles/Field.css";
import { useDrop } from "react-dnd";
import {
	presetFormations,
	mirrorFormation,
} from "../../utils/presetFormations";

const Field = () => {
	const [players, setPlayers] = useState({
		team1: {},
		team2: {},
	});
	const [isArrowMode, setIsArrowMode] = useState(false);
	const [arrows, setArrows] = useState([]);
	const [arrowColor, setArrowColor] = useState("black");

	const getSafePlayers = (team) => {
		return players[team] || {}; // Ensure players[team] is always an object
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

	const setFormation = (team, formation) => {
		const fieldWidth = document.querySelector(".field").offsetWidth; // Get the actual field width
		setPlayers((prevPlayers) => {
			const baseFormation = presetFormations[formation];
			const newPlayers = (
				team === "team2"
					? mirrorFormation(baseFormation, fieldWidth)
					: baseFormation
			)
				.slice(0, 11)
				.reduce((acc, position, index) => {
					acc[index + 1] = { ...position, name: `Player ${index + 1}` };
					return acc;
				}, {});
			return {
				...prevPlayers,
				[team]: newPlayers,
			};
		});
	};

	const addPlayerToTeam = (team) => {
		setPlayers((prevPlayers) => {
			if (Object.keys(prevPlayers[team]).length >= 11) return prevPlayers; // Limit to 11 players
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

	const renderPlayers = (team, color) => {
		const safePlayers = getSafePlayers(team);
		return Object.entries(safePlayers).map(([id, { left, top, name }]) => (
			<Player
				key={`${team}-${id}`}
				id={id}
				left={left}
				top={top}
				team={team}
				color={color}
				name={`${name} (#${id})`}
			/>
		));
	};

	return (
		<div>
			<header style={{ marginBottom: "20px", textAlign: "center" }}>
				<h1>Pizzara de Futbol</h1>
			</header>
			<div
				ref={drop}
				className="field"
				onMouseDown={handleFieldMouseDown}
				onMouseMove={handleFieldMouseMove}
				onMouseUp={handleFieldMouseUp}
				style={{ position: "relative", marginBottom: "20px" }}
			>
				{/* Central circle */}
				<CentralCircle />
				{/* Render arrows */}
				{arrows.map((arrow, index) => (
					<Arrow
						key={index}
						x1={arrow.x}
						y1={arrow.y}
						x2={arrow.endX}
						y2={arrow.endY}
						color={arrow.color}
					/>
				))}
				{/* Render players */}
				{renderPlayers("team1", "blue")}
				{renderPlayers("team2", "red")}
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginTop: "10px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-start",
					}}
				>
					<select
						onChange={(e) => setFormation("team1", e.target.value)}
						style={{
							marginBottom: "10px",
							padding: "10px 20px",
							borderRadius: "5px",
							backgroundColor: "#007bff",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						<option value="">Select Formation</option>
						{Object.keys(presetFormations).map((formation) => (
							<option key={formation} value={formation}>
								{formation}
							</option>
						))}
					</select>
					<button
						onClick={() => addPlayerToTeam("team1")}
						style={{
							marginBottom: "10px",
							padding: "10px 20px",
							borderRadius: "5px",
							backgroundColor: "#007bff",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						Add Player to Team 1
					</button>
					<button
						onClick={() => toggleArrowMode("blue")}
						style={{
							marginBottom: "10px",
							padding: "10px 20px",
							borderRadius: "5px",
							backgroundColor: "blue",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						{isArrowMode && arrowColor === "blue"
							? "Disable Blue Arrows"
							: "Enable Blue Arrows"}
					</button>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "flex-end",
					}}
				>
					<select
						onChange={(e) => setFormation("team2", e.target.value)}
						style={{
							marginBottom: "10px",
							padding: "10px 20px",
							borderRadius: "5px",
							backgroundColor: "#dc3545",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						<option value="">Select Formation</option>
						{Object.keys(presetFormations).map((formation) => (
							<option key={formation} value={formation}>
								{formation}
							</option>
						))}
					</select>
					<button
						onClick={() => addPlayerToTeam("team2")}
						style={{
							marginBottom: "10px",
							padding: "10px 20px",
							borderRadius: "5px",
							backgroundColor: "#dc3545",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						Add Player to Team 2
					</button>
					<button
						onClick={() => toggleArrowMode("red")}
						style={{
							marginBottom: "10px",
							padding: "10px 20px",
							borderRadius: "5px",
							backgroundColor: "red",
							color: "white",
							border: "none",
							cursor: "pointer",
						}}
					>
						{isArrowMode && arrowColor === "red"
							? "Disable Red Arrows"
							: "Enable Red Arrows"}
					</button>
				</div>
			</div>
			<TrashZone ref={trashDrop} />
		</div>
	);
};

export default Field;
