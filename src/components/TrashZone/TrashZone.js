import React from "react";

const TrashZone = React.forwardRef((props, ref) => {
	return (
		<div
			ref={ref}
			style={{
				marginTop: "20px",
				height: "50px",
				backgroundColor: "#f44336",
				color: "white",
				textAlign: "center",
				lineHeight: "50px",
			}}
		>
			Drag here to delete
		</div>
	);
});

export default TrashZone;
