import React from "react";

const CentralCircle = () => {
	return (
		<div
			style={{
				position: "absolute",
				left: "50%",
				top: "50%",
				transform: "translate(-50%, -50%)",
				width: "100px",
				height: "100px",
				border: "2px solid white",
				borderRadius: "50%",
			}}
		></div>
	);
};

export default CentralCircle;
