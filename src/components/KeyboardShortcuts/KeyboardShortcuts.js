import React from "react";
import "../../styles/KeyboardShortcuts.css";

const KeyboardShortcuts = () => {
	return (
		<div className="shortcuts-container">
			<h3 className="shortcuts-title">Atajos de Teclado</h3>
			<div className="shortcuts-grid">
				<div className="team-shortcuts">
					<h4 className="team-shortcuts-title blue">Equipo 1 (Azul)</h4>
					<ul className="shortcuts-list">
						<li className="shortcut-item">
							<kbd className="shortcut-key">f</kbd>- Modo flecha
						</li>
						<li className="shortcut-item">
							<kbd className="shortcut-key">r</kbd>- Modo rectángulo
						</li>
						<li className="shortcut-item">
							<kbd className="shortcut-key">a</kbd>- Agregar jugador
						</li>
					</ul>
				</div>
				<div className="team-shortcuts">
					<h4 className="team-shortcuts-title red">Equipo 2 (Rojo)</h4>
					<ul className="shortcuts-list">
						<li className="shortcut-item">
							<kbd className="shortcut-key">Shift + f</kbd>- Modo flecha
						</li>
						<li className="shortcut-item">
							<kbd className="shortcut-key">Shift + r</kbd>- Modo rectángulo
						</li>
						<li className="shortcut-item">
							<kbd className="shortcut-key">Shift + a</kbd>- Agregar jugador
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default KeyboardShortcuts;
