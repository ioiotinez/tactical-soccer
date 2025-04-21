import React, { useState } from "react";
import Arrow from "../Arrow/Arrow";
import Rectangle from "../Rectangle/Rectangle";

const DrawingLayer = ({
	isArrowMode,
	isRectangleMode,
	arrowColor,
	rectangleColor,
	onDrawingComplete,
}) => {
	const [arrows, setArrows] = useState([]);
	const [rectangles, setRectangles] = useState([]);
	const [hoveredShape, setHoveredShape] = useState(null);

	const handleMouseDown = (e) => {
		if (!isArrowMode && !isRectangleMode) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (isArrowMode) {
			setArrows((prev) => [
				...prev,
				{
					x,
					y,
					endX: x,
					endY: y,
					isDrawing: true,
					color: arrowColor,
				},
			]);
		} else if (isRectangleMode) {
			setRectangles((prev) => [
				...prev,
				{
					x,
					y,
					endX: x,
					endY: y,
					isDrawing: true,
					color: rectangleColor,
				},
			]);
		}
	};

	const handleMouseMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (
			isArrowMode &&
			arrows.length > 0 &&
			arrows[arrows.length - 1].isDrawing
		) {
			setArrows((prev) => {
				const updated = [...prev];
				updated[updated.length - 1] = {
					...updated[updated.length - 1],
					endX: x,
					endY: y,
				};
				return updated;
			});
		} else if (
			isRectangleMode &&
			rectangles.length > 0 &&
			rectangles[rectangles.length - 1].isDrawing
		) {
			setRectangles((prev) => {
				const updated = [...prev];
				updated[updated.length - 1] = {
					...updated[updated.length - 1],
					endX: x,
					endY: y,
				};
				return updated;
			});
		}
	};

	const handleMouseUp = () => {
		if (isArrowMode && arrows.length > 0) {
			setArrows((prev) => {
				const updated = [...prev];
				updated[updated.length - 1].isDrawing = false;
				return updated;
			});
			onDrawingComplete("arrow");
		} else if (isRectangleMode && rectangles.length > 0) {
			setRectangles((prev) => {
				const updated = [...prev];
				updated[updated.length - 1].isDrawing = false;
				return updated;
			});
			onDrawingComplete("rectangle");
		}
	};

	const handleDeleteShape = (type, index) => {
		if (type === "arrow") {
			setArrows((prev) => prev.filter((_, i) => i !== index));
		} else if (type === "rectangle") {
			setRectangles((prev) => prev.filter((_, i) => i !== index));
		}
	};

	return (
		<div
			style={{ position: "absolute", inset: 0 }}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
		>
			{arrows.map((arrow, index) => {
				const isHovered = hoveredShape === `arrow-${index}`;
				const width = Math.abs(arrow.endX - arrow.x);
				const height = Math.abs(arrow.endY - arrow.y);
				const left = Math.min(arrow.x, arrow.endX);
				const top = Math.min(arrow.y, arrow.endY);
				const x1 = arrow.x < arrow.endX ? 0 : width;
				const y1 = arrow.y < arrow.endY ? 0 : height;
				const x2 = arrow.x < arrow.endX ? width : 0;
				const y2 = arrow.y < arrow.endY ? height : 0;
				return (
					<div
						key={`arrow-${index}`}
						style={{
							position: "absolute",
							left,
							top,
							width,
							height,
							pointerEvents: "auto",
						}}
						onMouseEnter={() => setHoveredShape(`arrow-${index}`)}
						onMouseLeave={(e) => {
							if (!e.currentTarget.contains(e.relatedTarget)) {
								setHoveredShape(null);
							}
						}}
					>
						<Arrow x1={x1} y1={y1} x2={x2} y2={y2} color={arrow.color} />
						{isHovered && (
							<button
								style={{
									position: "absolute",
									top: 0,
									right: 0,
									zIndex: 1001,
									width: 24,
									height: 24,
									backgroundColor: "red",
									color: "white",
									border: "2px solid white",
									borderRadius: "50%",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									fontSize: 16,
									cursor: "pointer",
									boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
									padding: 0,
								}}
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteShape("arrow", index);
								}}
								onMouseDown={(e) => e.stopPropagation()}
							>
								×
							</button>
						)}
					</div>
				);
			})}
			{rectangles.map((rect, index) => {
				const isHovered = hoveredShape === `rect-${index}`;
				const width = Math.abs(rect.endX - rect.x);
				const height = Math.abs(rect.endY - rect.y);
				const left = Math.min(rect.x, rect.endX);
				const top = Math.min(rect.y, rect.endY);
				return (
					<div
						key={`rect-${index}`}
						style={{
							position: "absolute",
							left,
							top,
							width,
							height,
							pointerEvents: "auto",
						}}
						onMouseEnter={() => setHoveredShape(`rect-${index}`)}
						onMouseLeave={(e) => {
							if (!e.currentTarget.contains(e.relatedTarget)) {
								setHoveredShape(null);
							}
						}}
					>
						<Rectangle
							x1={0}
							y1={0}
							x2={width}
							y2={height}
							color={rect.color}
						/>
						{isHovered && (
							<button
								style={{
									position: "absolute",
									top: 0,
									right: 0,
									zIndex: 1001,
									width: 24,
									height: 24,
									backgroundColor: "red",
									color: "white",
									border: "2px solid white",
									borderRadius: "50%",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									fontSize: 16,
									cursor: "pointer",
									boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
									padding: 0,
								}}
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteShape("rectangle", index);
								}}
								onMouseDown={(e) => e.stopPropagation()}
							>
								×
							</button>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default DrawingLayer;
