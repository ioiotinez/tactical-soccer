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

	const DeleteButton = ({ onClick }) => (
		<div
			onClick={onClick}
			style={{
				position: "absolute",
				width: "24px",
				height: "24px",
				backgroundColor: "red",
				color: "white",
				border: "2px solid white",
				borderRadius: "50%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				fontSize: "16px",
				cursor: "pointer",
				zIndex: 1000,
				pointerEvents: "auto",
				boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
			}}
		>
			×
		</div>
	);

	const getDeleteButtonPosition = (shape) => {
		const midX = (shape.x + shape.endX) / 2;
		const midY = (shape.y + shape.endY) / 2;
		return {
			left: `${midX - 12}px`,
			top: `${midY - 12}px`,
		};
	};

	return (
		<div
			style={{ position: "absolute", inset: 0 }}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
		>
			{arrows.map((arrow, index) => (
				<div
					key={`arrow-${index}`}
					style={{ position: "relative" }}
					onMouseEnter={() => setHoveredShape(`arrow-${index}`)}
					onMouseLeave={() => setHoveredShape(null)}
				>
					<Arrow
						x1={arrow.x}
						y1={arrow.y}
						x2={arrow.endX}
						y2={arrow.endY}
						color={arrow.color}
					/>
					{hoveredShape === `arrow-${index}` && (
						<div style={getDeleteButtonPosition(arrow)}>
							<DeleteButton
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteShape("arrow", index);
								}}
							/>
						</div>
					)}
				</div>
			))}
			{rectangles.map((rect, index) => (
				<div
					key={`rect-${index}`}
					style={{ position: "relative" }}
					onMouseEnter={() => setHoveredShape(`rect-${index}`)}
					onMouseLeave={() => setHoveredShape(null)}
				>
					<Rectangle
						x1={rect.x}
						y1={rect.y}
						x2={rect.endX}
						y2={rect.endY}
						color={rect.color}
					/>
					{hoveredShape === `rect-${index}` && (
						<div style={getDeleteButtonPosition(rect)}>
							<DeleteButton
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteShape("rectangle", index);
								}}
							/>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default DrawingLayer;
