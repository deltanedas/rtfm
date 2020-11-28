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

const rtfm = this.global.rtfm;

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
