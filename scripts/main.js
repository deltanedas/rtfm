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

const rtfm = require("rtfm/library");
require("rtfm/docs");
require("rtfm/button");

const setup = () => {
	const dialog = extendContent(BaseDialog, "$rtfm.manual-pages", {
		view(page) {
			rtfm.currentPage = page;

			this.buttons.clearChildren();

			if (page == rtfm) {
				this.title.text = Core.bundle.get("rtfm.manual-pages");
				this.addCloseButton();
			} else {
				this.title.text = page.title(page);
				this.buttons.button("$back", Icon.left, () => {
					this.view(page.section);
				});
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

			t.table(extend(Cons, {get(search) {
				search.left();
				search.image(Icon.zoom);
				search.field("", text => {
					rebuild(text.toLowerCase());
				}).growX();
			}})).fillX().padBottom(4);
			t.row();

			t.pane(pages => {
				rebuild = query => {
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
				};
				rebuild();
			}).top().margin(20).padBottom(8);
		},

		/* Show the manual page */
		rebuild(page) {
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
			Core.app.post(() => Core.scene.setScrollFocus(pane));
		}
	});

	rtfm.dialog = dialog;
	dialog.view(rtfm);
};

Events.on(ClientLoadEvent, setup);

const addButton = () => {
	// AboutDialog clears after 1 tick, so this waits 2
	const override = () => Time.run(2, () => {
		Vars.ui.about.buttons.button("$rtfm.manuals", rtfm.showManual)
			.size(200, 64).name("manuals");
	});

	Vars.ui.about.shown(override);
	Events.on(ResizeEvent, override);
};

if (Vars.ui.about) {
	addButton();
} else {
	Events.on(ClientLoadEvent, addButton);
}
