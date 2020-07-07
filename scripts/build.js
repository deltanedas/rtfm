/*
	Copyright (c) DeltaNedas 2020

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* Build a page's dialog from page.content, a small subset of markdown */

(() => {

const addSection = (table, section, size) => {
	const text = table.add("[stat]" + section).growX().center().get();
	text.setAlignment(Align.center);
	const textwidth = text.prefWidth;

	table.row();
	/* Underline */
	table.addImage().color(Pal.stat).height(2 + 2 * size).width(textwidth).padBottom(16);
};

module.exports = page => {
	const table = new Table();
	table.left().margin(32);
	const pane = new ScrollPane(table);
	page.dialog.cont.add(pane).grow();
	Core.app.post(run(() => Core.scene.setScrollFocus(pane)));

	for (var i in page.content) {
		var line = page.content[i];
		table.row();

		var section = line.match(/^(#+)\s*(.+)/);
		if (section) {
			addSection(table, section[2], section[1].length);
			continue;
		}

		if (line.length > 0) {
			table.add(line).left().get().setWrap(true);
		}
	}
};

})();
