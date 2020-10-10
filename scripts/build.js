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

/* Build a page's dialog from page.content, a small subset of markdown */

const Pattern = java.util.regex.Pattern;

var centered;

/* Precompiled regular expressions */

// /^(#+)\s*([^]+)/
const getSection = line => {
	var depth = 0, spaces = 0;

	for (var i in line) {
		var c = line[i];
		if (c == ' ') {
			spaces++;
		} else if (c == '#') {
			depth++;
		} else if (spaces != 0) {
			break;
		}
	}

	return depth == 0 ? null : {
		depth: depth,
		line: line.substr(depth + spaces)
	};
};

const getImage = Pattern.compile("^([\s\S]+?)?\\{([\\w-]+(?::\\d+)?)\\}([\s\S]*)$");
const getSize = Pattern.compile("^([\\w-]+)\\s*:\\s*(\\s+)$");

const addSection = (table, section, size) => {
	const text = table.add("[stat]" + section).growX().center().padTop(16).get();
	text.alignment = Align.center;
	const textwidth = text.prefWidth;

	/* Underline */
	table.row();
	table.image().color(Pal.stat).height(2 + 2 * size)
		.width(textwidth).center().padBottom(16);
};

/* Add image in the format {texture[:size]} */
const addImage = (table, str) => {
	const matched = getSize.matcher(str);
	const found = matched.find();

	const name = found ? matched.group(1) : str;
	const region = Core.atlas.find(name);
	const size = found ? matched.group(2) : region.height;

	const img = table.image(region).left().top()
		.height(size).width(size * (region.width / region.height));
	if (centered) {
		img.center();
	}
};

module.exports = page => {
Core.app.post(() => {
	const table = page.table;
	table.defaults().left();
	table.row();

	for (var i in page.content) {
		var line = page.content[i];
		table.row();

		/* Preserve empty lines */
		if (!line) {
			table.add(" ");
			continue;
		}

		centered = false;
		var textfunc = cell => {
			cell.get().wrap = true;
			if (centered) {
				cell.center();
				cell.get().alignment = Align.center;
			} else {
				cell.left();
			}
		};

		/* Custom elements */
		if (typeof(line) == "function") line = line();
		if (typeof(line) != "string") {
			table.add(line);
			continue;
		}

		// [^] = lua and maybe c regex ".", match ALL characters, even evil newlines.
		var section = getSection(line);
		if (section) {
			addSection(table, section.line, section.depth);
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
			var image = getImage.matcher(line);
			if (!image.find()) break;

			var before = image.group(1);
			var img = image.group(2);
			var after = image.group(3);
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
});
};
