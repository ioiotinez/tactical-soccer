import React from "react";
import { useDrag } from "react-dnd";
import "../../styles/Ball.css";

const Ball = ({ left, top }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "ball",
		item: { type: "ball" },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	return (
		<div
			style={{
				position: "absolute",
				left: `${left}px`,
				top: `${top}px`,
				transform: "translate(-50%, -50%)",
				pointerEvents: "auto",
				zIndex: 1000,
			}}
		>
			<div
				ref={drag}
				className="ball"
				style={{
					opacity: isDragging ? 0.5 : 1,
					cursor: "move",
				}}
			/>
		</div>
	);
};

export default Ball;
