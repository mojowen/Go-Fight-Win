function setBindings (argument) {
	table_template();
	newRow_template();
	views_template();
	keyboardShortcuts();
	groups_template();
	graph_template();
	fields_template();
}

function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}
