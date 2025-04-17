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
	};

	const handleNameChange = (e) => {
		setTempName(e.target.value);
	};

	const handleNameBlur = () => {
		setIsEditing(false);
		onNameChange(id, tempName);
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
					width: "50px",
					height: "50px",
					borderRadius: "50%",
					backgroundColor: color,
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
					opacity: isDragging ? 0.5 : 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					color: "white",
					fontWeight: "bold",
					fontSize: "14px",
					cursor: "move",
					padding: "8px",
					position: "relative",
				}}
			>
				{id}
				{isHovered && (
					<div
						onClick={handleDeleteClick}
						style={{
							position: "absolute",
							top: "-10px",
							right: "-10px",
							width: "24px",
							height: "24px",
							backgroundColor: "red",
							color: "white",
							border: "2px solid white",
							borderRadius: "50%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							fontSize: "16px",
							cursor: "pointer",
							zIndex: 1000,
							pointerEvents: "auto",
							boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
						}}
					>
						×
					</div>
				)}
			</div>
			<div
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
							width: "60px",
							padding: "2px",
							fontSize: "12px",
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
							fontSize: "12px",
							color: "white",
							cursor: "pointer",
							padding: "2px 4px",
							borderRadius: "3px",
							backgroundColor: `${color}CC`,
							maxWidth: "80px",
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
