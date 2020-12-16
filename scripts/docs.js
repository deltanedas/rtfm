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

<<<<<<< HEAD
rtfm.addSection("$rtfm.docs.title", {
	"$rtfm.docs.getting-started": [
		"# Setup",
		"Get [coral]sample.js[] from your RTFM zip/folder or from GitHub at https://github.com/DeltaNedas/rtfm/raw/master/sample.js",
		"Modify it to suit your needs, read the comments",

		"# Adding pages",
		"Use [green]rtfm.addPage(\"cool manpage\", [[\"line1\",\"line2\"])[] to add a page.",
		"Manual pages use a format documented in the [red]Format[] page.",

		"# Sections",
		"Sections are like pages but instead of containing a page's content, they show other pages.",
		"Use [green]rtfm.addSection(\"OP Walls\", {\"Router Wall\": []})[] to add a section.",
		"Sub-sections can be added with the third [sky]parent[] parameter of [stat]addSection[]."
	],

	"$rtfm.docs.library": [
		"# Functions",
		"[stat]addPage(String name, Page page)",
		"    Add a page to [stat]rtfm.pages[].",
		"    [sky]page[] may be a [stat]Page[] or the page's content, for simplicity.",
		"    See [stat]Page[] definition.\n",

		"[stat]buildPage(Page page)",
		"    Parses the manual page lines in [sky]page.content[] and adds the results to [sky]page.title[].",
		"    Default function for [stat]Page.build[stat].",
		"    See the [red]Format[] page for more info.\n",

		"[stat]addButton(Table parent, Page page)",
		"    Adds a button to the table that when clicked runs [stat]rtfm.showPage[].",
		"    Default for [stat]Page.button[].\n",

		"[stat]getTitle(Page page)",
		"    Returns the full \"path\" of a page.",
		"    If it is not in a section, the name is returned.",
		"    If it is, the section's title and the page's name is returned.",
		"    Default for [stat]Page.title[].\n",

		"[stat]showPage(Page name)",
		"    Show a manual page.",
		"    Name may be a String, for [stat]rtfm.pages[].",
		"    Called by [stat]rtfm.addButton[].\n",

		"[stat]showManual()",
		"    Show [stat]rtfm.dialog[], with the current page.",

		"# Fields",
		"[stat]Page currentPage[] = [coral]null",
		"    The page or section currently being viewed.\n",

		"[stat]Object<String name, Page page> pages",
		"    Map of names to root pages.\n",

		"[stat]ManualDialog dialog[] extends [royal]FloatingDialog",
		"    The manual page dialog.",
		"    Has a function [stat]view(Page page)[] which adjusts the dialog for the page or section.",

		"# [stat]Page[] definition",
		"    [royal]function(Page page)[] build = [coral]rtfm.buildPage",
		"        Function that fills [sky]page.table[].",
		"    [royal]function(Table parent, Page page)[] button = [stat]rtfm.addButton",
		"        Function that adds the page's opening button.",
		"    [royal]function(Page page)[] title = [stat]rtfm.getTitle",
		"        Returns the title shown at the top of the manual page.\n",

		"    [royal]String[[][] content",
		"        Raw page lines, not needed for a custom [sky]build[] function.",
		"        You can use Arc elements instead of strings.",
		"$rtfm.docs.bundle-line",
		"    [royal]Table[] table = [coral]null",
		"        Built table, shown when the button is clicked.",
		"    [royal]Page[] section = [coral]rtfm",
		"        Parent section of this page, or [stat]rtfm[] if a root page.",
		"    [stat]Object<String name, Page page> pages = [coral]undefined",
		"        Map of names to child pages, undefined for normal pages."
	],

	"$rtfm.docs.format": [
		"Headings start with [coral]#[] and are [stat][[stat][] by default, with an underline.",
		"Unlike markdown, heading size is proportional to number of [coral]#[]es, not inversely.\n",

		"~Lines can be centered with a [coral]tilde (~)[] at the start.\n",

		"You can add images with [coral]{texture[[:size]}[].",
		"The size is the image's height by default, width is scaled with it.",
		"Prefix your mod's textures with modname-, as always.",
		"Example:",
		"{rtfm-image-example}",

		"\nUnformatted text is simply added as labels to the page's table.",
		"You can use colours as usual with [coral][[][].",
	],

	"$rtfm.docs.colours": [
		"These colours in the docs have special meaning:",
		"- [sky][[sky][]: Function argument/variable",
		"- [stat][[stat][]: RTFM function/field/type",
		"- [coral][[coral][]: Default field/parameter",
		"- [green][[green][]: Code",
		// TODO: add links
		"- [red][[red][]: Reference to another section"
	]
});

})();
=======
/* Documentation for the library */
rtfm.addSection("$rtfm.docs.title", [
	"$rtfm.docs.getting-started",
	"$rtfm.docs.api",
	"$rtfm.docs.format",
	"$rtfm.docs.colours"
]);

/* Documentation for 6.0 stuff */
rtfm.addSection("$logic", [
	"$logic.instructions",
	"$logic.blocks",
	"$logic.builtinvars",
	"$logic.examples"
]);

/* Documentation for some modding stuff */
rtfm.addSection("Modding", [
	"Units"
]);

// If you need to add docs to a section RTFM added, it's here for convenience
module.exports = rtfm;
>>>>>>> origin/6.0
