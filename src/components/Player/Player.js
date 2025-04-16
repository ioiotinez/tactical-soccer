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
	number,
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

	const handleDelete = (e) => {
		e.stopPropagation();
		onDelete(id);
	};

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
				pointerEvents: "none",
				zIndex: 1,
			}}
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
					pointerEvents: "auto",
					position: "relative",
					zIndex: 2,
				}}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={(e) => {
					const rect = e.currentTarget.getBoundingClientRect();
					const isOverDeleteButton =
						e.clientX >= rect.right - 24 &&
						e.clientX <= rect.right + 8 &&
						e.clientY >= rect.top - 8 &&
						e.clientY <= rect.top + 24;

					if (!isOverDeleteButton) {
						setIsHovered(false);
					}
				}}
			>
				{id}
				{isHovered && (
					<button
						onClick={handleDelete}
						onMouseEnter={() => setIsHovered(true)}
						style={{
							position: "absolute",
							top: "-8px",
							right: "-8px",
							width: "16px",
							height: "16px",
							backgroundColor: "red",
							color: "white",
							border: "none",
							borderRadius: "50%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							fontSize: "12px",
							cursor: "pointer",
							padding: 0,
							lineHeight: 1,
							zIndex: 3,
						}}
					>
						×
					</button>
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
