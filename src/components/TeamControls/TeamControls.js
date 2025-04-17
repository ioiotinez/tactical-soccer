import React from "react";
import "../../styles/TeamControls.css";

const TeamControls = ({
	team,
	color,
	formations,
	isArrowMode,
	isRectangleMode,
	arrowColor,
	rectangleColor,
	onFormationChange,
	onAddPlayer,
	onToggleArrow,
	onToggleRectangle,
}) => {
	const isBlue = color === "blue";
	const colorClass = isBlue ? "blue" : "red";
	const activeArrow = isArrowMode && arrowColor === color;
	const activeRectangle = isRectangleMode && rectangleColor === color;

	return (
		<div className={`team-control-panel ${colorClass}`}>
			<select
				className={`formation-select ${colorClass}`}
				onChange={(e) => onFormationChange(team, e.target.value)}
			>
				<option value="">Formación Equipo {isBlue ? "1" : "2"}</option>
				{Object.keys(formations).map((formation) => (
					<option key={formation} value={formation}>
						{formation}
					</option>
				))}
			</select>
			<div className="controls-group">
				<button
					onClick={() => onAddPlayer(team)}
					className={`control-button ${colorClass}`}
					title={`Añadir Jugador Equipo ${isBlue ? "1" : "2"}`}
				>
					<span style={{ fontSize: "20px" }}>+</span>
				</button>
				<button
					onClick={() => onToggleArrow(color)}
					className={`control-button ${colorClass} ${
						activeArrow ? "active" : ""
					}`}
					title={`Dibujar Flechas Equipo ${isBlue ? "1" : "2"}`}
				>
					↗
				</button>
				<button
					onClick={() => onToggleRectangle(color)}
					className={`control-button ${colorClass} ${
						activeRectangle ? "active" : ""
					}`}
					title={`Dibujar Rectángulos Equipo ${isBlue ? "1" : "2"}`}
				>
					□
				</button>
			</div>
		</div>
	);
};

export default TeamControls;
