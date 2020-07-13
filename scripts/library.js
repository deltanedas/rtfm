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

/* Only load once when required many times */
if (this.global.rtfm) {
	module.exports = this.global.rtfm;
} else {

const rtfm = {
	buildPage: require("rtfm/build"),

	addButton(table, name) {
		const button = table.addButton(name, run(() => {
			rtfm.showPage(name);
		})).width(300).height(60).marginLeft(16).padBottom(8).get();
		button.getLabel().setAlignment(Align.left);
	},

	addPage(name, page) {
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

		page.dialog = null;

		rtfm.pages[name] = page;
	},

	pageError(table, error) {
		// Remove any elements added before the error
		table.clear();

		table.add("[red]Failed to build page![]");
		table.row();
		table.add(error + "");
	},

	showPage(name) {
		const page = rtfm.pages[name];
		if (!page.dialog) {
			page.dialog = new FloatingDialog(name);
			page.dialog.addCloseButton();
			try {
				page.build(page);
			} catch (e) {
				rtfm.pageError(page.dialog.cont, e);
			}
		}

		page.dialog.show();
	},

	showManual() {
		rtfm.dialog.show();
	},

	pages: {},
	dialog: null
};

module.exports = rtfm;
this.global.rtfm = rtfm;

}
})();
