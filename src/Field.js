import React, { useState } from "react";
import Player from "./Player";
import "./Field.css";
import { useDrop } from "react-dnd";

const Field = () => {
	const [players, setPlayers] = useState({
		team1: {},
		team2: {},
	});

	const [, drop] = useDrop(() => ({
		accept: "player",
		drop: (item, monitor) => {
			const delta = monitor.getDifferenceFromInitialOffset();
			if (!delta) return;

			setPlayers((prevPlayers) => {
				const team = item.team;
				const player = prevPlayers[team][item.id];
				return {
					...prevPlayers,
					[team]: {
						...prevPlayers[team],
						[item.id]: {
							...player,
							left: player.left + delta.x,
							top: player.top + delta.y,
						},
					},
				};
			});
		},
	}));

	const [, trashDrop] = useDrop(() => ({
		accept: "player",
		drop: (item) => {
			setPlayers((prevPlayers) => {
				const { [item.id]: _, ...remainingPlayers } = prevPlayers[item.team];
				return {
					...prevPlayers,
					[item.team]: remainingPlayers,
				};
			});
		},
	}));

	const addPlayerToTeam = (team) => {
		setPlayers((prevPlayers) => {
			const newId = Object.keys(prevPlayers[team]).length + 1;
			const defaultPosition =
				team === "team1"
					? { left: 50, top: 50 } // Left side for Team 1
					: { left: 750, top: 50 }; // Right side for Team 2 (corrected position)
			return {
				...prevPlayers,
				[team]: {
					...prevPlayers[team],
					[newId]: { ...defaultPosition, name: `Player ${newId}` },
				},
			};
		});
	};

	return (
		<div>
			<div style={{ marginBottom: "10px" }}>
				<button
					onClick={() => addPlayerToTeam("team1")}
					style={{ marginRight: "10px" }}
				>
					Add Player to Team 1
				</button>
				<button onClick={() => addPlayerToTeam("team2")}>
					Add Player to Team 2
				</button>
			</div>
			<div ref={drop} className="field">
				<div className="penalty-area"></div>
				<div className="penalty-area-right"></div>
				<div className="center-circle"></div>
				{Object.entries(players.team1).map(([id, { left, top, name }]) => (
					<Player
						key={`team1-${id}`}
						id={id}
						left={left}
						top={top}
						team="team1"
						color="blue"
						name={name}
					/>
				))}
				{Object.entries(players.team2).map(([id, { left, top, name }]) => (
					<Player
						key={`team2-${id}`}
						id={id}
						left={left}
						top={top}
						team="team2"
						color="red"
						name={name}
					/>
				))}
			</div>
			<div
				ref={trashDrop}
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
		</div>
	);
};

export default Field;
