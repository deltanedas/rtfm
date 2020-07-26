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

var centered;

const addSection = (table, section, size) => {
	const text = table.add("[stat]" + section).growX().center().padTop(16).get();
	text.setAlignment(Align.center);
	const textwidth = text.prefWidth;

	/* Underline */
	table.row();
	table.addImage().color(Pal.stat).height(2 + 2 * size)
		.width(textwidth).center().padBottom(16);
};

/* Add image in the format {texture[:size]} */
const addImage = (table, str) => {
	const matched = str.match(/^([\w-]+)\s*:\s*(\d+)$/);
	const name = matched ? matched[1] : str;
	const region = Core.atlas.find(name);
	const size = matched ? matched[2] : region.height;

	const img = table.addImage(region).left().top()
		.height(size).width(size * (region.width / region.height));
	if (centered) {
		img.center();
	}
};

module.exports = page => {
	const table = page.table;
	table.defaults().left();
	table.row();

	for (var i in page.content) {
		var line = page.content[i];
		table.row();

		centered = false;
		var textfunc = cell => {
			cell.get().wrap = true;
			if (centered) {
				cell.center();
				cell.get().alignment = Align.center;
			}
		};

		/* Custom elements */
		if (typeof(line) != "string") {
			table.add(line);
			continue;
		}

		// [^] = lua and maybe c regex ".", match ALL characters, even evil newlines.
		var section = line.match(/^(#+)\s*([^]+)/);
		if (section) {
			addSection(table, section[2], section[1].length);
			continue;
		}

		/* Center non-headings */
		var center = line.match(/^~([^]+)/);
		if (center) {
			line = center[1];
			centered = true;
		}

		/* Check for images */
		while (true) {
			var image = line.match(/^([^]+?)?\{([\w-]+(?::\d+)?)\}([^]*)$/)
			if (!image) break;

			var before = image[1], img = image[2], after = image[3];
			if (before) {
				textfunc(table.add(before));
			}

			addImage(table, img);
			line = after;
		}

		if (line) {
			textfunc(table.add(line));
		}
	}
};

})();
