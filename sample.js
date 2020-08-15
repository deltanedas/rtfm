// This example script has no copyright and may be used freely by anyone.

try {
	const rtfm = require("rtfm/library");

	/* Lone pages, good for small mods */
	// Page is stored in manuals/Epic file page
	rtfm.addPage("Epic file page");
	rtfm.addPage("How to play [coral]mindustry", [
		"# Steps",
		"1. stop chaining routers",
		"2. done"
	]);

	/* Sections for bigger mods.
		 Files have content as null.
		 Sections have content as an object, not an array. */
	rtfm.addSection("OP Walls", {
		"$op-walls.epic-bundle": [
			"# Bundle page",
			"This page is [coral]sick[] and uses a bundle in its title.",
		],
		"Page 2 from a file": null
	});

	/* Custom elements with the default builder.
		 Cannot be done with a file. */
	rtfm.addPage("hack zone", [
		"You are now hack",
		new Label(prov(() => Mathf.random(0, 10) + ""))
	]);

	/* Entirely custom page! */
	rtfm.addPage("s p a c e", {
		build(page) {
			page.table.table(t => {
				t.button("[yellow]egg", Icon.trash, () => {
					print("Execute router 66");
				}).center().size(500, 40);
			}).size(4000);
		}
	});

	// Still here? Check out RTFM Docs / API or scripts/library.js and get your hands real dirty.
} catch (e) {
	// Message here
	Log.warn("Please install [#00aaff]DeltaNedas/rtfm[] to view OP Walls's manual pages.");
}
