// Validación de la estructura y contenido de una formación
export const validateFormation = (formation) => {
	// Verificar que sea un objeto
	if (
		typeof formation !== "object" ||
		formation === null ||
		Array.isArray(formation)
	) {
		throw new Error("Formato de formación inválido");
	}

	// Verificar número máximo de jugadores
	if (Object.keys(formation).length > 11) {
		throw new Error("La formación no puede tener más de 11 jugadores");
	}

	// Verificar cada jugador
	for (const [id, player] of Object.entries(formation)) {
		// Verificar que el ID sea un número válido
		if (!/^\d+$/.test(id) || parseInt(id) > 11) {
			throw new Error("ID de jugador inválido");
		}

		// Verificar que el jugador tenga las propiedades requeridas
		if (!player || typeof player !== "object" || Array.isArray(player)) {
			throw new Error("Datos de jugador inválidos");
		}

		// Verificar coordenadas
		if (typeof player.left !== "number" || typeof player.top !== "number") {
			throw new Error("Coordenadas de jugador inválidas");
		}

		// Verificar rangos de coordenadas
		if (
			player.left < 0 ||
			player.left > 800 ||
			player.top < 0 ||
			player.top > 600
		) {
			throw new Error("Coordenadas de jugador fuera de rango");
		}

		// Verificar nombre del jugador
		if (player.name && typeof player.name !== "string") {
			throw new Error("Nombre de jugador inválido");
		}

		// Sanitizar el nombre del jugador si existe
		if (player.name) {
			player.name = player.name.replace(/[<>]/g, "").slice(0, 30);
		}
	}

	return true;
};

// Validación del archivo de formación
export const validateFormationFile = (file) => {
	// Verificar tipo de archivo
	if (!file.type.match("application/json") && !file.name.endsWith(".json")) {
		throw new Error("Solo se permiten archivos JSON");
	}

	// Verificar tamaño del archivo (máximo 50KB)
	if (file.size > 50 * 1024) {
		throw new Error("El archivo es demasiado grande. Máximo 50KB permitido.");
	}

	return true;
};

// Función para importar una formación
export const importFormation = (file) => {
	return new Promise((resolve, reject) => {
		validateFormationFile(file);

		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const formation = JSON.parse(e.target.result);
				validateFormation(formation);
				resolve(formation);
			} catch (error) {
				reject(error);
			}
		};

		reader.onerror = () => reject(new Error("Error al leer el archivo"));
		reader.readAsText(file);
	});
};

// Función para exportar una formación
export const exportFormation = (formation, team) => {
	const fileName = `formacion_equipo_${team === "team1" ? "1" : "2"}.json`;
	const jsonStr = JSON.stringify(formation, null, 2);
	const blob = new Blob([jsonStr], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};
