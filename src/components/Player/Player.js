import React, { useState } from "react";
import { useDrag } from "react-dnd";
import "../../styles/Player.css";

const Player = ({
	id,
	left,
	top,
	team,
	color,
	name,
	onDelete,
	onNameChange,
	onEditStart,
	onEditEnd,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [tempName, setTempName] = useState(name || `Jugador ${id}`);

	const [{ isDragging }, drag] = useDrag(() => ({
		type: "player",
		item: { id, team },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	const handleNameClick = (e) => {
		e.stopPropagation();
		setIsEditing(true);
		if (onEditStart) onEditStart();
	};

	const handleNameChange = (e) => {
		setTempName(e.target.value);
	};

	const handleNameBlur = () => {
		setIsEditing(false);
		onNameChange(id, tempName);
		if (onEditEnd) onEditEnd();
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleNameBlur();
		}
	};

	const handleDeleteClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (onDelete) {
			onDelete();
		}
	};

	return (
		<div
			className="player-container"
			style={{
				position: "absolute",
				left: `${left}px`,
				top: `${top}px`,
				transform: "translate(-50%, -50%)",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "5px",
				userSelect: "none",
				pointerEvents: "auto",
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div
				ref={drag}
				className="player"
				style={{
					backgroundColor: color,
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
					opacity: isDragging ? 0.5 : 1,
					cursor: "move",
					position: "relative",
				}}
			>
				{id}
				{isHovered && (
					<div onClick={handleDeleteClick} className="player-delete">
						×
					</div>
				)}
			</div>
			<div
				className="player-name"
				style={{
					position: "relative",
					zIndex: 2,
					pointerEvents: "auto",
					marginTop: "5px",
				}}
			>
				{isEditing ? (
					<input
						type="text"
						value={tempName}
						onChange={handleNameChange}
						onBlur={handleNameBlur}
						onKeyPress={handleKeyPress}
						style={{
							width: "40px",
							padding: "2px",
							fontSize: "8px",
							textAlign: "center",
							border: `1px solid ${color}`,
							borderRadius: "3px",
							backgroundColor: "white",
						}}
						autoFocus
					/>
				) : (
					<div
						onClick={handleNameClick}
						style={{
							fontSize: "8px",
							color: "white",
							cursor: "pointer",
							padding: "2px 4px",
							borderRadius: "3px",
							backgroundColor: `${color}CC`,
							maxWidth: "50px",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}
					>
						{tempName}
					</div>
				)}
			</div>
		</div>
	);
};

export default Player;
