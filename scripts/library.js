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

/* rtfm for the manual, frontend in library.js */

(() => {

/* Only load once when required multiple times */
if (this.global.rtfm) {
	module.exports = this.global.rtfm;
	return;
}

const rtfm = {
	buildPage: require("rtfm/build"),

	addButton(table, page) {
		const title = (page.pages ? "[stat]" : "") + page.name;
		const button = table.addButton(title, run(() => {
			rtfm.dialog.view(page);
		})).width(300).height(60).marginLeft(16).padBottom(8).get();
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
		if (name[0] == '$') {
			name = Core.bundle.get(name.substr(1));
		}

		/* Default section is the manual index */
		section = section || rtfm;

		/* Alt-arg of just the content */
		if (Array.isArray(page)) {
			page = {content: page};
		}

		/* Defaults */
		if (!page.button) {
			page.button = rtfm.addButton;
		}

		if (!page.build) {
			page.build = rtfm.buildPage;
		}

		if (!page.title) {
			page.title = rtfm.getTitle;
		}

		page.table = null;
		page.name = name;
		page.section = section;

		section.pages[name] = page;
		return page;
	},

	addSection(name, pages, parent) {
		const section = rtfm.addPage(name, {
			pages: {}
		}, parent);

		for (var pname in pages) {
			rtfm.addPage(pname, pages[pname], section);
		}

		return section;
	},

	pageError(table, error) {
		// Remove any elements added before the error
		table.clear();

		table.add("[red]Failed to build page![]");
		table.row();
		table.add(error + "").get().wrap = true;
	},

	showPage(page) {
		if (typeof(page) == "string") {
			page = rtfm.pages[page];
		}

		rtfm.dialog.view(page);
		rtfm.dialog.show();
	},

	showManual() {
		rtfm.dialog.show();
	},

	pages: {},
	currentPage: null,
	dialog: null
};

module.exports = rtfm;
this.global.rtfm = rtfm;

})();
