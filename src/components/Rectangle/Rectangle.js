import React from "react";

const Rectangle = ({ x1, y1, x2, y2, color }) => {
	// Convertir nombres de colores a valores hexadecimales
	const colorMap = {
		blue: "#0000ff",
		red: "#ff0000",
	};
	const hexColor = colorMap[color] || color;

	const width = Math.abs(x2 - x1);
	const height = Math.abs(y2 - y1);
	const left = Math.min(x1, x2);
	const top = Math.min(y1, y2);

	return (
		<div
			style={{
				position: "absolute",
				left: left,
				top: top,
				width: width,
				height: height,
				border: `2px solid ${hexColor}`,
				backgroundColor: `${hexColor}40`,
				pointerEvents: "auto",
				cursor: "pointer",
			}}
		/>
	);
};

export default Rectangle;
