import React, { useRef } from "react";
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
	onExport,
	onImport,
}) => {
	const fileInputRef = useRef(null);
	const isBlue = color === "blue";
	const colorClass = isBlue ? "blue" : "red";
	const activeArrow = isArrowMode && arrowColor === color;
	const activeRectangle = isRectangleMode && rectangleColor === color;

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

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
				<button
					onClick={onExport}
					className={`control-button ${colorClass}`}
					title={`Exportar Formación Equipo ${isBlue ? "1" : "2"}`}
				>
					⬇
				</button>
				<button
					onClick={handleImportClick}
					className={`control-button ${colorClass}`}
					title={`Importar Formación Equipo ${isBlue ? "1" : "2"}`}
				>
					⬆
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept=".json"
					style={{ display: "none" }}
					onChange={onImport}
				/>
			</div>
		</div>
	);
};

export default TeamControls;
