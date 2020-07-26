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

(() => {

const rtfm = require("rtfm/library");
require("rtfm/docs");
require("rtfm/button");

const setup = () => {
	const dialog = extendContent(FloatingDialog, "$rtfm.manual-pages", {
		view(page) {
			rtfm.currentPage = page;

			this.buttons.clearChildren();

			if (page == rtfm) {
				this.title.text = Core.bundle.get("rtfm.manual-pages");
				this.addCloseButton();
			} else {
				this.title.text = page.title(page);
				this.buttons.addImageTextButton("$back", Icon.left, run(() => {
					this.view(page.section);
				}));
			}

			this.cont.clear();
			if (page.pages) {
				this.rebuildSection(page);
			} else {
				this.rebuild(page);
			}
		},

		/* Show a search bar and the page list */
		rebuildSection(section) {
			const t = this.cont;
			var rebuild;

			t.table(cons(search => {
				search.left();
				search.addImage(Icon.zoom);
				search.addField("", cons(text => {
					rebuild(text.toLowerCase());
				})).growX();
			})).fillX().padBottom(4);
			t.row();

			t.pane(cons(pages => {
				rebuild = query => {
try{
					pages.clear();

					/* ls --group-directories-first */
					const pagenames = [];
					const sectionnames = Object.keys(section.pages).filter(name => {
						if (section.pages[name].pages) {
							return true;
						}
						pagenames.push(name);
					});

					const func = names => {
						for (var i in names) {
							var name = names[i];
							if (query && !name.toLowerCase().includes(query)) {
								continue;
							}

							var page = section.pages[name]
							page.button(pages, page);
							pages.row();
						}
					};

					func(sectionnames.sort());
					func(pagenames.sort());
}catch(e){print(e)}
				};
				rebuild();
			})).top().margin(20).padBottom(8);
		},

		/* Show the manual page */
		rebuild(page) {
try{
print("rebuild page " + page.title(page))
			if (!page.table) {
				page.table = new Table();
				try {
					page.build(page);
				} catch (e) {
					rtfm.pageError(page.table, e);
				}
			}

			const pane = new ScrollPane(page.table);
			this.cont.add(pane).grow();
			Core.app.post(run(() => Core.scene.setScrollFocus(pane)));
}catch(e){print(e)}
		}
	});

	rtfm.dialog = dialog;
	dialog.view(rtfm);
};

Events.on(EventType.ClientLoadEvent, run(setup));

const addButton = () => {
	// AboutDialog clears after 1 tick, so this waits 2
	Vars.ui.about.shown(run(() => Time.run(2, run(() => {
		Vars.ui.about.buttons.addButton("$rtfm.manuals", rtfm.showManual)
			.size(200, 64).name("manuals");
	}))));
};

if (Vars.ui.about) {
	/* Not loaded on game start, check for old button */
	if (!Vars.ui.about.cells.find(boolf(cell => cell.get().name == "manuals"))) {
		addButton();
	}
} else {
	Events.on(EventType.ClientLoadEvent, run(addButton));
}

})();
