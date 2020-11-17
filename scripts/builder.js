/*
	Copyright (c) DeltaNedas 2020

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

/* Build a page's dialog from page.content, a small markup language.
   This is the new builder that runs vhar by char, is much faster and produces
   a much slimmer page. */

// TODO: use a stack for content indices stuff, rewrite logic?
// TODO: use a table for headings to allow images and stuff
// TODO: do something to make inline images not fuck everything up

const Pattern = java.util.regex.Pattern;

var startLine, startImage, scriptStart, brackets, textStart, heading, headingStart, centered;

const getSize = Pattern.compile("^([\\w-]+)\\s*:\\s*(\\d+)$");

const addHeading = (table, line) => {
	line = line.replace(/^\s*/, "");

	table.row();
	const text = table.add("[stat]" + line).growX().center().padTop(16).get();
	text.fontScaleX = Math.sqrt(heading);
	text.fontScaleY = Math.sqrt(heading);
	text.alignment = Align.center;
	const textwidth = text.prefWidth;

	/* Underline */
	table.row();
	table.image().color(Pal.stat).size(textwidth, 2 + 2 * heading)
		.center().padBottom(16);
	table.row();
};

/* Add image in the format {texture[:size]} */
const addImage = (table, str) => {
	const matched = getSize.matcher(str);
	const found = matched.find();

	const name = found ? matched.group(1) : str;
	const region = Core.atlas.find(name);
	const size = found ? matched.group(2) : region.height;

	table.row();
//	const last = table.cells.peek().get();

	const img = table.image(region).left().top()
		.size(size * region.width / region.height, size);
	/* TODO: Fix indenting images
	if (last instanceof Label) {
		img.marginLeft(last.text.toString().match(/ *$/)[0].length * 8);
	} */

	if (centered) {
		img.center();
	} else {
		img.left();
	}
};

Core.app.post(() => {
	this.global.rtfm.addPage("test", [
		"Line 1",
		"# Line 2",
		"## Line 3",
		"~ Line 4",
		"{router}text{duo:64}", "",

		"# Bad stuff now",
		"I am an {image:64",
		"} that has been run on", "",

		"$('# bad trailing heading')",
		"$(table.add('gnu'); return null)"
	]);
});

module.exports = page => {
	Time.mark()
	var i;
	const table = page.table;
	table.defaults().left();
	table.row();

	if (Array.isArray(page.content)) {
		page.content = page.content.join("\n");
	}

	// Ensure POSIX file ending - flush headings and centered lines
	page.content += '\n';

	startLine = true;
	startImage = null;
	scriptStart = null; brackets = 0;
	textStart = 0;
	heading = 0;
	headingStart = null;
	centered = false;

	var textfunc = cell => {
		cell.growX().wrap();
		if (centered) {
			cell.center();
			cell.get().alignment = Align.center;
		} else {
			cell.left();
		}
	};

	const endString = i => {
		const text = page.content.slice(textStart, i);
		if (text.charAt(0) == '\n') table.row();
		textfunc(table.add(text));
		// Don't mess up images
		if (text.indexOf('\n') > 0) {
			table.row();
		}
		centered = false;
		textStart = i + 1;
	};

	const endHeading = i => {
		addHeading(table, page.content.slice(headingStart, i));
		heading = 0;
		headingStart = null;
		textStart = i + 1;
	};

	const endScript = () => {
		const script = page.content.slice(scriptStart, i)
			// return breaks with newlines
			.replace(/\n/g, " ")
			// comments break without newlines
			.replace(/\/\/.+\n^/g, "");
		var ret;
		eval("ret = (() => {" + (script.includes("return") ? script : "return " + script)+ "})()");

		ret = ret == null ? "" : ret;

		page.content = page.content.slice(0, scriptStart - 2) + ret + page.content.slice(i + 1, page.content.length);
		// Go back to before $(script)
		i -= script.length + 3;

		scriptStart = null;
	};

	const flush = i => {
		if (textStart != null && i > textStart) {
			if (heading) {
				endHeading(i);
			} else {
				endString(i);
			}
			textStart = null;
		}
	};

	for (i = 0; i < page.content.length; i++) {
		var char = page.content[i];
		/* Inline scripts - parsed first as to preserve line starts and what not */
		if (scriptStart == null) {
			if (char == '$' && page.content[i + 1] == '(') {
				scriptStart = i + 2;
				i++;
				brackets = 0;
				continue;
			}
		} else {
			if (char == '(') {
				brackets++;
			} else if(char == ')' && brackets-- == 0) {
				endScript();
			}
			continue;
		}

		if (char == '\n') {
			if (centered) {
				endString(i);
				table.row();
			}
			if (heading) endHeading(i);

			startImage = null;
			startLine = true;
			continue;
		}

		/* Headings and centering */
		if (startLine) {
			startLine = false;
			if (char == '#') {
				if (heading == 0) {
					flush(i);
				}

				heading++;
				headingStart = i + 1;
				// allow capturing more '#'s to increase bar thickness and text size
				startLine = true;
			} else if (char == '~' && heading == 0) {
				flush(i);
				centered = true;
				textStart = i + 1;
			}
			continue;
		}

		/* Images */
		if (char == '{' && startImage == null) {
			startImage = i + 1;
			continue;
		}
		if (char == '}' && startImage != null) {
			const img = page.content.slice(startImage, i);
			// Check for symbols that arent expected - this is how you escape images
			if (img.match(/[^\w:\d-]/)) continue;

			flush(startImage - 1);
			addImage(table, img);
			textStart = i + 1;
			startImage = null;
			continue;
		}
	}

	flush(i);
	print("Building page '" + page.name + "' took " + Time.elapsed());
};
