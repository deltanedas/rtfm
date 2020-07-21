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
	const dialog = new FloatingDialog("$rtfm.manual-pages");
	const cont = dialog.cont;
	rtfm.dialog = dialog;

	var rebuild;

	cont.table(cons(search => {
		search.left();
		search.addImage(Icon.zoom);
		search.addField("", cons(text => {
			rebuild(text.toLowerCase());
		})).growX();
	})).fillX().padBottom(4);
	cont.row();

	cont.pane(cons(pages => {
		pages.top().margin(20);
		rebuild = query => {
			pages.clear();
			for (var name in rtfm.pages) {
				if (query && !name.toLowerCase().includes(query)) {
					continue;
				}

				rtfm.pages[name].button(pages, name);
				pages.row();
			}
		};
	}));

	rebuild();

	dialog.addCloseButton();
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
