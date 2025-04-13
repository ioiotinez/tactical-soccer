const mirrorFormation = (formation, fieldWidth) => {
	const midfield = fieldWidth / 2;
	return formation.map((player) => {
		const distanceToMidfield = midfield - player.left;
		return {
			left: player.left + distanceToMidfield * 2, // Reflect position across the midfield
			top: player.top, // Keep the vertical position unchanged
		};
	});
};

const presetFormations = {
	"4-4-2": [
		{ left: 50, top: 250 }, // Goalkeeper at mid-height
		{ left: 150, top: 100 },
		{ left: 150, top: 200 },
		{ left: 150, top: 300 },
		{ left: 150, top: 400 },
		{ left: 300, top: 100 },
		{ left: 300, top: 200 },
		{ left: 300, top: 300 },
		{ left: 300, top: 400 },
		{ left: 450, top: 150 },
		{ left: 450, top: 350 },
	],
	"4-3-3": [
		{ left: 50, top: 250 }, // Goalkeeper at mid-height
		{ left: 150, top: 50 },
		{ left: 150, top: 150 },
		{ left: 150, top: 350 },
		{ left: 150, top: 450 },
		{ left: 300, top: 150 },
		{ left: 300, top: 250 },
		{ left: 300, top: 350 },
		{ left: 450, top: 100 },
		{ left: 450, top: 250 },
		{ left: 450, top: 400 },
	],
	"3-5-2": [
		{ left: 50, top: 250 }, // Goalkeeper at mid-height
		{ left: 150, top: 100 },
		{ left: 150, top: 250 },
		{ left: 150, top: 400 },
		{ left: 300, top: 50 },
		{ left: 300, top: 150 },
		{ left: 300, top: 250 },
		{ left: 300, top: 350 },
		{ left: 300, top: 450 },
		{ left: 450, top: 150 },
		{ left: 450, top: 350 },
	],
	"4-2-3-1": [
		{ left: 50, top: 250 }, // Goalkeeper at mid-height
		{ left: 150, top: 50 },
		{ left: 150, top: 150 },
		{ left: 150, top: 350 },
		{ left: 150, top: 450 },
		{ left: 300, top: 200 },
		{ left: 300, top: 300 },
		{ left: 450, top: 100 },
		{ left: 450, top: 200 },
		{ left: 450, top: 300 },
		{ left: 450, top: 400 },
		{ left: 600, top: 250 },
	],
};

export { presetFormations, mirrorFormation };
