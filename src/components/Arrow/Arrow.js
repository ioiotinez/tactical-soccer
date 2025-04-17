import React from "react";

const Arrow = ({ x1, y1, x2, y2, color }) => {
	// Calcular dimensiones con un padding extra para interacción
	const padding = 20;
	const arrowWidth = Math.abs(x2 - x1) + padding * 2;
	const arrowHeight = Math.abs(y2 - y1) + padding * 2;
	const left = Math.min(x1, x2) - padding;
	const top = Math.min(y1, y2) - padding;

	// Ajustar las coordenadas al sistema de coordenadas local del SVG con el padding
	const localX1 = x1 - left;
	const localY1 = y1 - top;
	const localX2 = x2 - left;
	const localY2 = y2 - top;

	return (
		<div
			style={{
				position: "absolute",
				left: left,
				top: top,
				width: arrowWidth,
				height: arrowHeight,
				cursor: "pointer",
			}}
		>
			<svg
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					width: "100%",
					height: "100%",
					overflow: "visible",
				}}
			>
				<line
					x1={localX1}
					y1={localY1}
					x2={localX2}
					y2={localY2}
					style={{ stroke: color, strokeWidth: 2 }}
				/>
				<circle cx={localX2} cy={localY2} r={5} fill={color} />
			</svg>
		</div>
	);
};

export default Arrow;
