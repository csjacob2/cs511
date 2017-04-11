function getSelectionText() {
	var text = "";
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
		text = document.selection.createRange().text;
	}
	return text;
}

$('head').append('<link rel="stylesheet" type="text/css" href="http://www.jacklmoore.com/colorbox/example1/colorbox.css"/>');

var txt = getSelectionText();
txt = txt.replace(/\n\s*\n/g, '\n');
console.log("Highlighted text is");
console.log(txt);
var postData = {};
postData.data = txt;
postData.intializeAndEnforceConstraints = 1;
postData.intializeConstraintsSeparately = 1;
// $.colorbox({title:'Notice',width:'90%',html:'hello'});
// $.colorbox({title:'Notice',width:'90%',html:'<h4>It may take a few seconds to extract publication data. Please wait and do not close this window! <br/> FYI, we are processing the following text: </h4> ' + txt.replace("\n","<br/>")});
alert('It may take a few seconds to extract publication data. Please wait! FYI, we are processing the following text: ' + txt.replace("\n","<br/>"));
$('#spreadsheet_minimize_button').show();
drawTable(postData, []);