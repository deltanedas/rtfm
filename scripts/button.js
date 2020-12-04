/*
	Copyright (c) DeltaNedas 2020

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.	If not, see <https://www.gnu.org/licenses/>.
*/

/* Add buttons with DeltaNedas/ui-lib */

const rtfm = this.global.rtfm;

try {
	const ui = require("ui-lib/library");

	ui.addButton("manuals", "bookOpen", rtfm.showManual);
	ui.addMenuButton("$rtfm.manuals", "bookOpen", rtfm.showManual);
} catch (e) {
	// ui-lib not installed, oh no
	Log.warn("Install [#00aaff]DeltaNedas/ui-lib[] for extra manual buttons.");
}

/* Add a button for the logic manual inside the processor dialog */

Events.on(ClientLoadEvent, () => {
	Vars.ui.logic.buttons.button(Icon.book, () => {
		rtfm.showPage("$logic/$logic.instructions");
	}).size(64);
});
