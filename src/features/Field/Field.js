import React, { useState } from "react";
import Player from "../../components/Player/Player";
import CentralCircle from "../../components/CentralCircle/CentralCircle";
import Arrow from "../../components/Arrow/Arrow";
import Rectangle from "../../components/Rectangle/Rectangle";
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
	const [isRectangleMode, setIsRectangleMode] = useState(false);
	const [arrows, setArrows] = useState([]);
	const [rectangles, setRectangles] = useState([]);
	const [arrowColor, setArrowColor] = useState("black");
	const [rectangleColor, setRectangleColor] = useState("black");

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
		if (!isArrowMode && !isRectangleMode) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (isArrowMode) {
			setArrows((prevArrows) => [
				...prevArrows,
				{ x, y, endX: x, endY: y, isDrawing: true, color: arrowColor },
			]);
		} else if (isRectangleMode) {
			setRectangles((prevRectangles) => [
				...prevRectangles,
				{ x, y, endX: x, endY: y, isDrawing: true, color: rectangleColor },
			]);
		}
	};

	const handleFieldMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (
			isArrowMode &&
			arrows.length > 0 &&
			arrows[arrows.length - 1].isDrawing
		) {
			setArrows((prevArrows) => {
				const updatedArrows = [...prevArrows];
				updatedArrows[updatedArrows.length - 1] = {
					...updatedArrows[updatedArrows.length - 1],
					endX: x,
					endY: y,
				};
				return updatedArrows;
			});
		} else if (
			isRectangleMode &&
			rectangles.length > 0 &&
			rectangles[rectangles.length - 1].isDrawing
		) {
			setRectangles((prevRectangles) => {
				const updatedRectangles = [...prevRectangles];
				updatedRectangles[updatedRectangles.length - 1] = {
					...updatedRectangles[updatedRectangles.length - 1],
					endX: x,
					endY: y,
				};
				return updatedRectangles;
			});
		}
	};

	const handleFieldMouseUp = () => {
		if (isArrowMode && arrows.length > 0) {
			setArrows((prevArrows) => {
				const updatedArrows = [...prevArrows];
				updatedArrows[updatedArrows.length - 1].isDrawing = false;
				return updatedArrows;
			});
		} else if (isRectangleMode && rectangles.length > 0) {
			setRectangles((prevRectangles) => {
				const updatedRectangles = [...prevRectangles];
				updatedRectangles[updatedRectangles.length - 1].isDrawing = false;
				return updatedRectangles;
			});
		}
	};

	const toggleArrowMode = (color) => {
		setIsArrowMode((prev) => (arrowColor === color ? !prev : true));
		setArrowColor(color);
		setIsRectangleMode(false);
	};

	const toggleRectangleMode = (color) => {
		setIsRectangleMode((prev) => (rectangleColor === color ? !prev : true));
		setRectangleColor(color);
		setIsArrowMode(false);
	};

	const handlePlayerDelete = (team, playerId) => {
		setPlayers((prevPlayers) => {
			const { [playerId]: _, ...remainingPlayers } = prevPlayers[team];
			return {
				...prevPlayers,
				[team]: remainingPlayers,
			};
		});
	};

	const handlePlayerNameChange = (team, playerId, newName) => {
		setPlayers((prevPlayers) => ({
			...prevPlayers,
			[team]: {
				...prevPlayers[team],
				[playerId]: {
					...prevPlayers[team][playerId],
					name: newName,
				},
			},
		}));
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
				name={name || `Jugador ${id}`}
				onDelete={() => handlePlayerDelete(team, id)}
				onNameChange={(id, newName) =>
					handlePlayerNameChange(team, id, newName)
				}
			/>
		));
	};

	return (
		<div>
			<header style={{ marginBottom: "20px", textAlign: "center" }}>
				<h1>Pizzara de Futbol</h1>
			</header>

			{/* Toolbar/Controls Panel */}
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					gap: "20px",
					marginBottom: "20px",
					padding: "15px",
					backgroundColor: "#f5f5f5",
					borderRadius: "10px",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
				}}
			>
				{/* Team 1 Controls */}
				<div
					style={{
						display: "flex",
						gap: "10px",
						alignItems: "center",
						padding: "10px",
						backgroundColor: "#e3f2fd",
						borderRadius: "8px",
					}}
				>
					<select
						onChange={(e) => setFormation("team1", e.target.value)}
						style={{
							padding: "8px 15px",
							borderRadius: "5px",
							border: "1px solid #007bff",
							backgroundColor: "white",
							color: "#007bff",
							cursor: "pointer",
						}}
					>
						<option value="">Formación Equipo 1</option>
						{Object.keys(presetFormations).map((formation) => (
							<option key={formation} value={formation}>
								{formation}
							</option>
						))}
					</select>

					<div style={{ display: "flex", gap: "5px" }}>
						<button
							onClick={() => addPlayerToTeam("team1")}
							style={{
								padding: "8px",
								borderRadius: "5px",
								backgroundColor:
									isArrowMode && arrowColor === "blue" ? "#004ba0" : "#007bff",
								color: "white",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: "40px",
								height: "40px",
							}}
							title="Añadir Jugador Equipo 1"
						>
							<span style={{ fontSize: "20px" }}>+</span>
						</button>
						<button
							onClick={() => toggleArrowMode("blue")}
							style={{
								padding: "8px",
								borderRadius: "5px",
								backgroundColor:
									isArrowMode && arrowColor === "blue" ? "#004ba0" : "#007bff",
								color: "white",
								border: "none",
								cursor: "pointer",
								width: "40px",
								height: "40px",
							}}
							title="Dibujar Flechas Equipo 1"
						>
							↗
						</button>
						<button
							onClick={() => toggleRectangleMode("blue")}
							style={{
								padding: "8px",
								borderRadius: "5px",
								backgroundColor:
									isRectangleMode && rectangleColor === "blue"
										? "#004ba0"
										: "#007bff",
								color: "white",
								border: "none",
								cursor: "pointer",
								width: "40px",
								height: "40px",
							}}
							title="Dibujar Rectángulos Equipo 1"
						>
							□
						</button>
					</div>
				</div>

				{/* Team 2 Controls */}
				<div
					style={{
						display: "flex",
						gap: "10px",
						alignItems: "center",
						padding: "10px",
						backgroundColor: "#ffebee",
						borderRadius: "8px",
					}}
				>
					<select
						onChange={(e) => setFormation("team2", e.target.value)}
						style={{
							padding: "8px 15px",
							borderRadius: "5px",
							border: "1px solid #dc3545",
							backgroundColor: "white",
							color: "#dc3545",
							cursor: "pointer",
						}}
					>
						<option value="">Formación Equipo 2</option>
						{Object.keys(presetFormations).map((formation) => (
							<option key={formation} value={formation}>
								{formation}
							</option>
						))}
					</select>

					<div style={{ display: "flex", gap: "5px" }}>
						<button
							onClick={() => addPlayerToTeam("team2")}
							style={{
								padding: "8px",
								borderRadius: "5px",
								backgroundColor:
									isArrowMode && arrowColor === "red" ? "#b71c1c" : "#dc3545",
								color: "white",
								border: "none",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: "40px",
								height: "40px",
							}}
							title="Añadir Jugador Equipo 2"
						>
							<span style={{ fontSize: "20px" }}>+</span>
						</button>
						<button
							onClick={() => toggleArrowMode("red")}
							style={{
								padding: "8px",
								borderRadius: "5px",
								backgroundColor:
									isArrowMode && arrowColor === "red" ? "#b71c1c" : "#dc3545",
								color: "white",
								border: "none",
								cursor: "pointer",
								width: "40px",
								height: "40px",
							}}
							title="Dibujar Flechas Equipo 2"
						>
							↗
						</button>
						<button
							onClick={() => toggleRectangleMode("red")}
							style={{
								padding: "8px",
								borderRadius: "5px",
								backgroundColor:
									isRectangleMode && rectangleColor === "red"
										? "#b71c1c"
										: "#dc3545",
								color: "white",
								border: "none",
								cursor: "pointer",
								width: "40px",
								height: "40px",
							}}
							title="Dibujar Rectángulos Equipo 2"
						>
							□
						</button>
					</div>
				</div>
			</div>

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
						key={`arrow-${index}`}
						x1={arrow.x}
						y1={arrow.y}
						x2={arrow.endX}
						y2={arrow.endY}
						color={arrow.color}
					/>
				))}
				{/* Render rectangles */}
				{rectangles.map((rect, index) => (
					<Rectangle
						key={`rect-${index}`}
						x1={rect.x}
						y1={rect.y}
						x2={rect.endX}
						y2={rect.endY}
						color={rect.color}
					/>
				))}
				{/* Render players */}
				{renderPlayers("team1", "blue")}
				{renderPlayers("team2", "red")}
			</div>
			<TrashZone ref={trashDrop} />
		</div>
	);
};

export default Field;
