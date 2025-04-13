import React from "react";

const Arrow = ({ x1, y1, x2, y2, color }) => {
	return (
		<svg
			style={{ position: "absolute", left: 0, top: 0 }}
			height="100%"
			width="100%"
		>
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				style={{ stroke: color, strokeWidth: 2 }}
			/>
			<circle cx={x2} cy={y2} r={5} fill={color} />
		</svg>
	);
};

export default Arrow;
