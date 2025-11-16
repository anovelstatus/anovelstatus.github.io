import { sumLevelNotes } from "./sumLevelNotes";
import { saveStatus } from "./saveStatus";

/** Run when the spreadsheet opens */
/* @ts-expect-error no-unused-local */
function onOpen() {
	SpreadsheetApp.getUi().createMenu("ANC").addItem("Show Sidebar", "showSidebar").addToUi();
	showSidebar();
}

// Sidebar Functions

/** Create sidebar for spreadsheet */
function showSidebar() {
	const output = HtmlService.createHtmlOutputFromFile("sidebar").setTitle("A Novel Concept");
	SpreadsheetApp.getUi().showSidebar(output);
}

/** Save stat sheet from chapter to Attributes sheet */
/* @ts-expect-error no-unused-local */
function save(status: string, chapter: number) {
	return saveStatus(status, chapter);
}

// Custom spreadsheet functions

/**
 * Custom function to get the total number of levels gained from a note describing those gains
 * @param {string} notes Description of levels gained from each log entry for that skill
 * @return Total levels gained
 * @customfunction
 */
/* @ts-expect-error no-unused-local */
function getTotalGainedLevels(notes: string) {
	return sumLevelNotes(notes);
}
