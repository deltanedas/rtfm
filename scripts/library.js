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

const translate = str => str[0] == '$' ? Core.bundle.get(str.substr(1)) : str;

// like old base.js readString
const currentMod = Reflect.get(Scripts, "currentMod");
const readString = path => {
	const file = currentMod.root.child(path);
	return file.readString();
};

const readTranslated = path => {
	const parts = path.split('/');
	for (var i in parts) {
		parts[i] = translate(parts[i]);
	}

	try {
		// Blocks/Router in language of choice, fallback to english
		return readString(parts.join("/"));
	} catch (e) {
		// $blocks/$block.router.name as a fallback for older mods
		return readString(path);
	}
};

const rtfm = {
	buildPage: require("rtfm/builder"),
	buildLegacyPage: require("rtfm/legacy-builder"),

	isLegacy(page) {
		// Read from a file or is a section, can't have anything special
		if (!Array.isArray(page.content)) {
			return false;
		}

		for (var line of page.content) {
			// If not a string (func/element), it can't be nicely parsed
			if (typeof(line) != "string") {
				return true;
			}
		}

		return false;
	},

	addButton(table, page) {
		const title = (page.pages ? "[stat]" : "") + page.name;
		const button = table.button(title, () => {
			rtfm.dialog.view(page, false);
		}).width(300).height(60).marginLeft(16).padBottom(8).get();
		button.getLabel().setAlignment(Align.left);
	},

	getTitle(page) {
		return page.section == rtfm
			// Bare name for root pages
			? page.name
			// Page "path" for section pages
			: page.section.title(page.section) + " / " + page.name;
	},

	addPage(name, page, section) {
		// Default section is the manual index
		section = rtfm.getPage(section || rtfm);
		var path = section.path + "/" + name;

		/* addPage(String) */
		if (page == null) {
			page = readTranslated(path)
				.replace(/\t/g, "    ");
		}

		/* addPage(String, Object[]/String) */
		if (Array.isArray(page) || typeof(page) == "string") {
			page = {content: page};
		}

		/* Defaults */
		if (!page.button) {
			page.button = rtfm.addButton;
		}

		if (!page.isLegacy) {
			page.isLegacy = rtfm.isLegacy;
		}

		if (!page.build) {
			page.build = page.isLegacy(page) ? rtfm.buildLegacyPage : rtfm.buildPage;
		}

		if (!page.title) {
			page.title = rtfm.getTitle;
		}

		/* Use $bundlename for page keys,
		   $bundlename for a page with a translated title,
		   <$bundlename> for translated pages */
		section.pages[name] = page;
		name = translate(name);

		page.table = null;
		page.scroll = 0;
		page.name = name;
		page.section = section;
		page.path = path;

		return page;
	},

	addPages(pages, section) {
		for (var i in pages) {
			rtfm.addPage(pages[i], null, section);
		}
	},

	addSection(name, pages, parent) {
		const section = rtfm.addPage(name, {
			pages: {},
			// Hopefully this isn't needed lol
			scroll: 0
		}, parent);

		// They're all files
		if (Array.isArray(pages)) {
			for (var name of pages) {
				rtfm.addPage(name, null, section);
			}
			return section;
		}

		for (var pname in pages) {
			var child = pages[pname];
			if (child == null) {
				// Read from file
				rtfm.addPage(pname, null, section);
			} else if (Array.isArray(child)) {
				// Inline page
				rtfm.addPage(pname, child, section);
			} else {
				// Subsection
				rtfm.addSection(pname, child, section);
			}
		}

		return section;
	},

	pageError(table, error) {
		// Remove any elements added before the error
		table.clear();

		// rhino errors are h
		if (typeof(error) == "object") {
			error = error + " (" + error.fileName + "#" + error.lineNumber + ")";
		}

		Log.err("Failed to build page: @", error);
		table.add("[red]Failed to build page![]").center();
		table.row();
		table.add(error + "").grow().center().top().get().wrap = true;
	},

	// "egg/block" -> rtfm.pages.egg.block
	getPage(path) {
		if (typeof(path) != "string") return path;

		const parts = path.split("/");
		var page = rtfm;
		for (var part of parts) {
			var section = page;
			page = section.pages[part];
			if (!page) {
				throw "Unknown page '" + part + "' in " + section.path +
					", valid pages are " + Object.keys(section.pages).join(", ");
			}
		}

		return page;
	},

	showPage(page, temporary) {
		rtfm.dialog.view(rtfm.getPage(page), temporary);
		rtfm.dialog.show();
	},

	showManual() {
		rtfm.dialog.show();
	},

	currentPage: null,
	dialog: null,

	/* Light Page implementation */
	pages: {},
	scroll: 0,
	path: "manuals"
};

module.exports = rtfm;
global.rtfm = rtfm;
