import React from "react";
import { useDrag } from "react-dnd";
import "../../styles/Player.css";

const Player = ({ id, left, top, team, color, name, number }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "player",
		item: { id, team },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	return (
		<div
			ref={drag}
			className="player"
			style={{
				left: `${left}px`,
				top: `${top}px`,
				position: "absolute",
				transform: "translate(-50%, -50%)",
				width: "50px",
				height: "50px",
				borderRadius: "50%",
				backgroundColor: color,
				boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
				opacity: isDragging ? 0.5 : 1,
			}}
		></div>
	);
};

export default Player;
