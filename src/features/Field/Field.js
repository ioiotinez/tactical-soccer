import React, { useState, useEffect, useCallback } from "react";
import { useDrop } from "react-dnd";
import Player from "../../components/Player/Player";
import Ball from "../../components/Ball/Ball";
import CentralCircle from "../../components/CentralCircle/CentralCircle";
import TeamControls from "../../components/TeamControls/TeamControls";
import KeyboardShortcuts from "../../components/KeyboardShortcuts/KeyboardShortcuts";
import DrawingLayer from "../../components/DrawingLayer/DrawingLayer";
import {
	presetFormations,
	mirrorFormation,
} from "../../utils/presetFormations";
import { importFormation, exportFormation } from "../../utils/formationUtils";
import "../../styles/Field.css";

const Field = () => {
	const [players, setPlayers] = useState({ team1: {}, team2: {} });
	const [ballPosition, setBallPosition] = useState({ left: 400, top: 300 });
	const [isArrowMode, setIsArrowMode] = useState(false);
	const [isRectangleMode, setIsRectangleMode] = useState(false);
	const [arrowColor, setArrowColor] = useState("black");
	const [rectangleColor, setRectangleColor] = useState("black");

	const toggleArrowMode = useCallback(
		(color) => {
			setIsArrowMode((prev) => (arrowColor === color ? !prev : true));
			setArrowColor(color);
			setIsRectangleMode(false);
		},
		[arrowColor]
	);

	const toggleRectangleMode = useCallback(
		(color) => {
			setIsRectangleMode((prev) => (rectangleColor === color ? !prev : true));
			setRectangleColor(color);
			setIsArrowMode(false);
		},
		[rectangleColor]
	);

	const addPlayerToTeam = useCallback((team) => {
		setPlayers((prevPlayers) => {
			if (Object.keys(prevPlayers[team]).length >= 11) return prevPlayers;
			const newId = Object.keys(prevPlayers[team]).length + 1;
			const defaultPosition =
				team === "team1" ? { left: 50, top: 50 } : { left: 750, top: 50 };
			return {
				...prevPlayers,
				[team]: {
					...prevPlayers[team],
					[newId]: { ...defaultPosition, name: `Player ${newId}` },
				},
			};
		});
	}, []);

	useEffect(() => {
		const handleKeyDown = (e) => {
			switch (e.key.toLowerCase()) {
				case "r":
					toggleRectangleMode(e.shiftKey ? "red" : "blue");
					break;
				case "f":
					toggleArrowMode(e.shiftKey ? "red" : "blue");
					break;
				case "a":
					addPlayerToTeam(e.shiftKey ? "team2" : "team1");
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleArrowMode, toggleRectangleMode, addPlayerToTeam]);

	const [, drop] = useDrop(() => ({
		accept: ["player", "ball"],
		drop: (item, monitor) => {
			const delta = monitor.getDifferenceFromInitialOffset();
			if (!delta) return;

			if (item.type === "ball") {
				setBallPosition((prev) => ({
					left: prev.left + delta.x,
					top: prev.top + delta.y,
				}));
				return;
			}

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
		return Object.entries(players[team] || {}).map(
			([id, { left, top, name }]) => (
				<Player
					key={`${team}-${id}`}
					id={id}
					left={left}
					top={top}
					team={team}
					color={color}
					name={name}
					onDelete={() => handlePlayerDelete(team, id)}
					onNameChange={(id, newName) =>
						handlePlayerNameChange(team, id, newName)
					}
				/>
			)
		);
	};

	const handleFormationChange = (team, formation) => {
		if (!formation) return;
		const fieldWidth = document.querySelector(".field").offsetWidth;
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

	const handleDrawingComplete = (type) => {
		if (type === "arrow") {
			setIsArrowMode(false);
		} else if (type === "rectangle") {
			setIsRectangleMode(false);
		}
	};

	const handleExportFormation = (team) => {
		const formation = players[team];
		exportFormation(formation, team);
	};

	const handleImportFormation = (team, event) => {
		const file = event.target.files[0];
		if (file) {
			importFormation(file)
				.then((formation) => {
					setPlayers((prevPlayers) => ({
						...prevPlayers,
						[team]: formation,
					}));
				})
				.catch((error) => {
					console.error("Error al importar la formación:", error);
					alert(
						error.message || "Error al importar el archivo. Formato inválido."
					);
				});
		}
		// Limpiar el input para permitir cargar el mismo archivo nuevamente
		event.target.value = "";
	};

	return (
		<div>
			<header className="field-header">
				<h1>Pizarra de Fútbol</h1>
			</header>

			<div className="team-controls-container">
				<TeamControls
					team="team1"
					color="blue"
					formations={presetFormations}
					isArrowMode={isArrowMode}
					isRectangleMode={isRectangleMode}
					arrowColor={arrowColor}
					rectangleColor={rectangleColor}
					onFormationChange={handleFormationChange}
					onAddPlayer={addPlayerToTeam}
					onToggleArrow={toggleArrowMode}
					onToggleRectangle={toggleRectangleMode}
					onExport={() => handleExportFormation("team1")}
					onImport={(e) => handleImportFormation("team1", e)}
				/>
				<TeamControls
					team="team2"
					color="red"
					formations={presetFormations}
					isArrowMode={isArrowMode}
					isRectangleMode={isRectangleMode}
					arrowColor={arrowColor}
					rectangleColor={rectangleColor}
					onFormationChange={handleFormationChange}
					onAddPlayer={addPlayerToTeam}
					onToggleArrow={toggleArrowMode}
					onToggleRectangle={toggleRectangleMode}
					onExport={() => handleExportFormation("team2")}
					onImport={(e) => handleImportFormation("team2", e)}
				/>
			</div>

			<div ref={drop} className="field">
				<CentralCircle />
				<Ball left={ballPosition.left} top={ballPosition.top} />
				<DrawingLayer
					isArrowMode={isArrowMode}
					isRectangleMode={isRectangleMode}
					arrowColor={arrowColor}
					rectangleColor={rectangleColor}
					onDrawingComplete={handleDrawingComplete}
				/>
				{renderPlayers("team1", "blue")}
				{renderPlayers("team2", "red")}
			</div>

			<KeyboardShortcuts />
		</div>
	);
};

export default Field;
