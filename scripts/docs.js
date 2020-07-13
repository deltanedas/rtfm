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

/* Documentation for the library */

(() => {

const rtfm = require("rtfm/library");

rtfm.addPage("$rtfm.page-title", [
	"## Getting Started",
	"Add [green]const rtfm = require(\"rtfm/library\")[] [stat]in a try/catch block[].",
	"Try to not break everything if RTFM isn't installed, instead perhaps print a warning to the log:",
	"[green]Log.warn(\"RTFM missing, OP Walls' manual will not be available.\");[]\n",

	"Use [green]rtfm.addPage(\"manpage\", [[\"line1\",\"line2\"])[] to add a page.",
	"It uses a simplified version of markdown, described in the Format section.",

	"## API\n",

	"# Functions",
	"[stat]addPage(String name, Page page)[]",
	"    Add a page to [stat]rtfm.pages[].",
	"    [sky]page[] may be a [stat]Page[] or the page's content, for simplicity.",
	"    See [stat]Page[] definition.\n",

	"[stat]buildPage(Page page)[]",
	"    Parses the manual page lines in [sky]page.content[] and adds the results to [sky]page.dialog[].",
	"    Default function for [stat]Page.build[stat].",
	"    See the [coral]Format[] section for more info.\n",

	"[stat]addButton(Table parent, String name)[]",
	"    Adds a button to the table that when clicked:",
	"    - Checks if [sky]page.dialog[] is set",
	"    - If not, builds it with [green]page.build(page)[]",
	"    - Shows it",
	"    Default for [stat]Page.button[].\n",

	"[stat]showPage(String name)[]",
	"    Show a manual page's dialog.",
	"    Called by [stat]rtfm.addButton[].\n",

	"[stat]showManual()[]",
	"    Show [stat]rtfm.dialog[].",

	"# Fields",
	"[stat]Object<String name, Page page> pages[]",
	"    Map of names to pages.\n",

	"[stat]FloatingDialog dialog[]",
	"    The manual page list dialog.",

	"# Types",
	"[stat]Page[]: {",
	"    [royal]function(Page page)[] build = [stat]rtfm.buildPage[]",
	"        Function that fills [sky]page.dialog.cont[].",
	"    [royal]function(Table parent, String name)[] button = [stat]rtfm.addButton[]",
	"        Funcion that adds the page's opening button.\n",

	"    [royal]String[[][] content",
	"        Raw page lines, not needed for a custom [sky]build[] functions.",
	"        You can use Arc elements instead of strings.",
	"$rtfm.bundle-line",
	"    [royal]FloatingDialog[] dialog = [coral]null[]",
	"        Built dialog, shown when the button is clicked.",
	"}",

	"# Format",
	"Headings start with [coral]#[] and are [stat][[stat][] by default, with an underline.",
	"Unlike markdown, heading size is proportional to number of [coral]#[]es, not inversely.\n",

	"Lines can be centered with a [coral]~[] at the start.\n",

	"You can add images with [coral]{texture[[:size]}[].",
	"The size is the image's height by default, width is scaled with it.",
	"Prefix your mod's textures with modname-, as always.",
	"Example:",
	"{rtfm-image-example}",

	"\nUnformatted text is simply added as labels to the page's table.",
	"You can use colours as usual with [coral][[][].",

	"# Colours",
	"These colours have special meaning:",
	"- [sky][[sky][]: Function argument/variable",
	"- [stat][[stat][]: RTFM function/field/type",
	"- [green][[green][]: Code"
]);

})();
