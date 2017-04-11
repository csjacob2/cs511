var cv;
cv = document.getElementById('long-canvas');
if (cv == null) {
	// Create a blank div where we are going to put the canvas into.
	var canvasContainer = document.createElement('div');
	// Add the div into the document
	document.body.appendChild(canvasContainer);
	canvasContainer.style.position="absolute";
	// Set to 100% so that it will have the dimensions of the document
	canvasContainer.style.left="0px";
	canvasContainer.style.top="0px";
	canvasContainer.style.width="100%";
	canvasContainer.style.height="100%";
	// Set to high index so that this is always above everything else
	// (might need to be increased if you have other element at higher index)
	canvasContainer.style.zIndex="1000";

	console.log("document width: " + $(document).width());
	console.log("document height: " + $(document).height());
	// var body = document.body,
	// 	html = document.documentElement;
	// var height = Math.max( body.scrollHeight, body.offsetHeight,
	// 	html.clientHeight, html.scrollHeight, html.offsetHeight );
	// console.log(height);
	// Now we create the canvas
	myCanvas = document.createElement('canvas');
	myCanvas.style.width = $(document).width();
	myCanvas.style.height = $(document).height();
	// You must set this otherwise the canvas will be streethed to fit the container
	myCanvas.width=$(document).width();
	myCanvas.height=$(document).height();
	myCanvas.style.overflow = 'visible';
	myCanvas.style.position = 'absolute';
	// Add int into the container
	canvasContainer.appendChild(myCanvas);

	// Long's change
	myCanvas.id='long-canvas';
	console.log("canvas width: " + myCanvas.width);
	console.log("canvas height: " + myCanvas.height);

	// var context=myCanvas.getContext('2d');
	// context.fillStyle = 'red';
	// context.fillRect(0,0, myCanvas.width, myCanvas.height);
}

cv = document.getElementById('long-canvas');
initDraw(cv);

function initDraw(canvas) {
	var ctx = canvas.getContext("2d");

	// function setMousePosition(e) {
	// 	var ev = e || window.event; //Moz || IE
	// 	if (ev.pageX) { //Moz
	// 		mouse.x = ev.pageX + window.pageXOffset;
	// 		mouse.y = ev.pageY + window.pageYOffset;
	// 	} else if (ev.clientX) { //IE
	// 		mouse.x = ev.clientX + document.body.scrollLeft;
	// 		mouse.y = ev.clientY + document.body.scrollTop;
	// 	}
	// };

	function setMousePosition(e) {
		var r = canvas.getBoundingClientRect();
		mouse.x = e.clientX - r.left;
		mouse.y = e.clientY - r.top;
	};


	var mouse = {
		x: 0,
		y: 0,
		startX: 0,
		startY: 0
	};
	var element = null;

	canvas.style.cursor = "crosshair";

	canvas.onmousemove = function (e) {
		setMousePosition(e);
		if (element !== null) {
			// element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
			// element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
			// element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
			// element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';

			element.width = Math.abs(mouse.x - mouse.startX);
			element.height = Math.abs(mouse.y - mouse.startY);
			element.left = (mouse.x - mouse.startX < 0) ? mouse.x : mouse.startX;
			element.top = (mouse.y - mouse.startY < 0) ? mouse.y : mouse.startY;
			// console.log(element);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.fillStyle = "grey";
			ctx.globalAlpha=0.2;
			ctx.fillRect(element.left, element.top, element.width, element.height);
			ctx.stroke();
		}
	}

	canvas.onmouseup = function (e) {

		console.log("click at " + mouse.x + " " + mouse.y);
		if (element !== null) {
			canvas.style.cursor = "default";
			console.log("finished.");
			console.log("final rectangle is as below:");
			console.log(element);
			var x1 = element.left;
			var y1 = element.top;
			var x2 = element.left+element.width;
			var y2 = element.top+element.height;
			var txt = getText(document.body, x1, y1, x2, y2);
			txt = txt.replace(/\n\s*\n/g, '\n');
			console.log("Extracted text is");
			console.log(txt);
			element = null;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			var postData = {};
			postData.data = txt;
			//******
			postData.intializeAndEnforceConstraints = 1;
			postData.intializeConstraintsSeparately = 1;

			//******
			//http://localhost/wdv/extractPubData.php
			//"http://kite.cs.illinois.edu/wdv/extractPubData.php"

			// $('#spreadsheet_minimize_button').trigger("click");
			$.colorbox({title:'Notice',width:'90%',html:'<h4>It may take a few seconds to extract publication data. Please wait and do not close this window! <br/> FYI, we are processing the following text: </h4> ' + txt.replace("\n","<br/>")});
			$('#spreadsheet_minimize_button').show();
			$('#long-canvas').remove();
			drawTable(postData, []);


		}
		// 	else {
		// 		console.log("begun.");
		// 		mouse.startX = mouse.x;
		// 		mouse.startY = mouse.y;
		// 		element = {};
		// 	// element = document.createElement('div');
		// 	// element.className = 'rectangle'
		// 	// element.style.left = mouse.x + 'px';
		// 	// element.style.top = mouse.y + 'px';
		// 	// canvas.appendChild(element)
		//
		// 		canvas.style.cursor = "crosshair";
		// }
	}
	canvas.onmousedown = function(e) {
		console.log("begun.");
		mouse.startX = mouse.x;
		mouse.startY = mouse.y;
		element = {};
		// element = document.createElement('div');
		// element.className = 'rectangle'
		// element.style.left = mouse.x + 'px';
		// element.style.top = mouse.y + 'px';
		// canvas.appendChild(element)

		canvas.style.cursor = "crosshair";
	}
}

// x1, y1 would be mouse coordinates onmousedown
// x2, y2 would be mouse coordinates onmouseup
// all coordinates are considered relative to the document
// function rectangleSelect(selector, x1, y1, x2, y2) {
// 	var elements = [];
// 	jQuery(selector).each(function() {
// 		var $this = jQuery(this);
// 		var offset = $this.offset();
// 		var x = offset.left;
// 		var y = offset.top;
// 		var w = $this.width();
// 		var h = $this.height();
//
// 		if (x >= x1
// 			&& y >= y1
// 			&& x + w <= x2
// 			&& y + h <= y2) {
// 			// this element fits inside the selection rectangle
// 			elements.push($this.get(0));
// 		}
// 	});
// 	return elements;
// }

// var rv = "";
// var elements = rectangleSelect("*", 0, 1000, 1699, 4940);
// var itm = elements.length;
// while(itm--) {
// 	var n = elements[itm];
// 	// n.style.color = 'red';
// 	console.log(n.text);
// 	console.log(n);
// 	if (n.nodeType == 3) {
// 		// console.log(n);
// 		// console.log(n.nodeValue);
// 		rv += n.nodeValue;
// 	} else {
// 		var d = getComputedStyle(n).getPropertyValue('display');
// 		if (d.match(/^block/) || d.match(/list/) || n.tagName == 'BR') {
// 			rv += "\n";
// 		}
// 	}
// 	// console.log(elements[itm]);
// }
// console.log(rv);
// var x1 = 0;
// var y1 = 1000;
// var x2 = 1699;
// var y2 = 4940;

function getText(n, x1, y1, x2, y2) {
	var rv = '';

	if (n.nodeType == 3) {
		var $this2 = $(n).parent(); //use the parent of text node to find position/size
		var offset = $this2.offset();
		var x = offset.left;
		var y = offset.top;
		var w = $this2.width();
		var h = $this2.height();
		if (x >= x1
			&& y >= y1
			&& x + w <= x2
			&& y + h <= y2) {
			// this element fits inside the selection rectangle
			// rv = n.nodeValue + "[" + x + "," + y + "," + w + "," + h + "]";
			rv = n.nodeValue;
		}
		// console.log(rv);
	} else {
		for (var i = 0; i < n.childNodes.length; i++) {
			rv += getText(n.childNodes[i], x1, y1, x2, y2);
		}
		try {
			var d = getComputedStyle(n).getPropertyValue('display');
			if (d.match(/^block/) || d.match(/list/) || n.tagName == 'BR') {
				rv += "\n";
			}
		} catch(err){
			console.log("Error on " + n);
			console.log(err.message);
		}

	}

	return rv;

}; // getText()