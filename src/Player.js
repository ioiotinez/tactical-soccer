import React, { useState } from "react";
import { useDrag } from "react-dnd";
import "./Player.css";

const Player = ({ id, left, top, team, color, name }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "player",
		item: { id, team },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	const [playerName, setPlayerName] = useState(name);

	const handleNameChange = (e) => {
		setPlayerName(e.target.value);
	};

	return (
		<div
			ref={drag}
			className="player"
			style={{
				left: `${left}px`,
				top: `${top}px`,
				backgroundColor: color,
				opacity: isDragging ? 0.5 : 1,
				position: "absolute",
			}}
		>
			<input
				type="text"
				value={playerName}
				onChange={handleNameChange}
				style={{
					width: "80px",
					textAlign: "center",
					border: "none",
					background: "transparent",
					color: "white",
					fontWeight: "bold",
				}}
			/>
		</div>
	);
};

export default Player;
