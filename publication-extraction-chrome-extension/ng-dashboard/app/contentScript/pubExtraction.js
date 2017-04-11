// var css = document.createElement("style");
// css.type = "text/css";
// css.innerHTML = ".rectangle {\
// 	border: 1px solid #FF0000;\
// 	position: absolute;\
// }";
// document.body.appendChild(css);
//
$('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.12/datatables.css"/>');
$('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/1.2.2/css/buttons.dataTables.min.css"/>');
$('head').append('<link rel="stylesheet" type="text/css" href="http://www.jacklmoore.com/colorbox/example1/colorbox.css"/>');
$('head').append('<link rel="stylesheet" type="text/css" href="http://kite.cs.illinois.edu/wdv/wdvpage.css"/>');

$('#long_container_all_table').remove();
$('#spreadsheet_minimize_button').remove();
$(document.body).append('<div id="long_container_all_table" style="display:none"><div id="pub_spreadsheet_container_long"> <table id="pub_spreadsheet" class="display" width="100%"></table>Suggested constraints: <div id="constraints_long"></div> <button id="apply-constraints"> Apply constraints and reload table!</button> </div></div>');
$(document.body).append('<button id="spreadsheet_minimize_button" style="display:none">Retrieve The Previous Publication Spreadsheet</button>');
$('#spreadsheet_minimize_button').colorbox({inline:true, href:$('#pub_spreadsheet_container_long'), width:"90%"});

function drawTable(postData, curConstraints) {
	$('#cboxLoadingOverlay, #cboxLoadingGraphic').show();
	// console.log($('#cboxLoadingGraphic').size());
	$.post("http://kite.cs.illinois.edu/wdv/extractPubData.php", postData, function(data, status){
		console.log("Data: " + data + "\nStatus: " + status);
		// $('#colorbox').remove();
		// $.colorbox({html:'<table id="pub_spreadsheet" class="display" width="70%"></table>'});
		// $.colorbox({html:'<div> hello how are you </div>'});
		var rows = data.split("\n");
		var tmp = rows[0].split("\t");
		var fields = [];
		for (var i=0; i < tmp.length; i++) {
			fields[i] = {}
			fields[i]['title']= tmp[i];
		}
		var pubs = [];
		for (var i =1; i < rows.length; i++) {
			var tmp = rows[i].split("\t");
			if (tmp.length === fields.length) {
				pubs[i-1] = rows[i].split("\t");
			}
		}
		// console.log(pubs);
		// console.log(fields);
		// console.log($('#pub_spreadsheet'));
		// $('#pub_spreadsheet').innerHTML = "dfasdfkdjasflkjdalkfdjalfdjs";
		if ( $.fn.DataTable.isDataTable('#pub_spreadsheet') ) {
			$('#pub_spreadsheet').DataTable().destroy();
		}
		$('#pub_spreadsheet').empty();
		var table = $('#pub_spreadsheet').DataTable( {
			data: pubs,
			columns: fields,
			dom: 'Bfrtip',
			buttons: [
				{
					text: 'Enforce constraints selected below',
					action: function ( e, dt, node, config ) {
						var cs = [];
						$('.constraint-on').each(function() {
							var c = {};
							c["field"] = this.getAttribute("cField");
							c["relationship"] = this.getAttribute("cRelationship");
							c["token"] = this.getAttribute("cToken");
							cs.push(c);
						})
						var csJson = JSON.stringify(cs);
						curConstraints = cs;
						console.log("Applying constraints: " + csJson);
						postData.enforceConstraints = csJson;
						// $('#cboxLoadingGraphic').show();
						drawTable(postData, curConstraints);
						// table.clear().draw();
					}
				},
				'copyHtml5',
				'excelHtml5',
				'csvHtml5',
				'pdfHtml5'
			]
		} );
		$("#pub_spreadsheet thead th").contextmenu(function(e) {
			e.preventDefault();
			console.log(this);
			var c = document.createElement("button");
			c.setAttribute("class", "constraint constraint-on remove-field");
			c.setAttribute("cField", $(this).text());
			c.setAttribute("cToken", "oO_Oo");
			c.setAttribute("cRelationship", "ends at");
			c.innerHTML = $(this).text() + " does not appear";
			// console.log(c);
			// console.log($('#constraints_long'));
			$('#constraints_long').append(c);
		} );

		if (postData.intializeConstraintsSeparately == 1) {
			$.get( "http://kite.cs.illinois.edu/wdv/getConstraints.php", function( data ) {
				var constraints = JSON.parse(data);
				// console.log(constraints);
				$('.constraint').remove();
				for (var i = 0; i < constraints.length; i++) {
					var c = document.createElement("button");
					c.setAttribute("class", "constraint");
					c.setAttribute("cField", constraints[i]["field"]);
					c.setAttribute("cToken", constraints[i]["token"]);
					c.setAttribute("cRelationship",constraints[i]["relationship"]);
					c.innerHTML = constraints[i]["field"] + " " + constraints[i]["relationship"] + " " + constraints[i]["token"];
					// console.log(c);
					// console.log($('#constraints_long'));
					$('#constraints_long').append(c);
				}
				$(".constraint").each(function(){
					for (var i=0; i<curConstraints.length; i++) {
						if ((this.getAttribute("cField").localeCompare(curConstraints[i]["field"])===0) &&
							(this.getAttribute("cToken").localeCompare(curConstraints[i]["token"])===0) &&
							(this.getAttribute("cRelationship").localeCompare(curConstraints[i]["relationship"])===0)) {
							// console.log("cur constraint " );
							// console.log(curConstraints[i]);
							// console.log(this);
							$(this).addClass("constraint-on");
						}
					}
				})
				$( ".constraint" ).click(function() {
					if ($(this).hasClass("constraint-on")) {
						$(this).removeClass("constraint-on");
					} else {
						$(this).addClass("constraint-on");
					}
					// console.log("A constraint is clicked!");
				});

				// console.log("Number of click button: " + $('#apply-constraints').size());
				$('#apply-constraints').off('click').click(function() {
					var cs = [];
					$('.constraint-on').each(function() {
						var c = {};
						c["field"] = this.getAttribute("cField");
						c["relationship"] = this.getAttribute("cRelationship");
						c["token"] = this.getAttribute("cToken");
						cs.push(c);
					})
					var csJson = JSON.stringify(cs);
					curConstraints = cs;
					console.log("Applying constraints: " + csJson);
					postData.enforceConstraints = csJson;
					// $('#cboxLoadingGraphic').show();
					drawTable(postData, curConstraints);
					// table.clear().draw();
				});
			});

		}
		$('#spreadsheet_minimize_button').trigger("click");
		// $.colorbox({inline:true, href:$('#pub_spreadsheet_wrapper'), width:"70%"});

		// $('#pub_spreadsheet_container_long').remove();
		// $('#long-canvas').remove();
		// var filename = 'vips_' + window.location.host + '.csv';
		// var blob = new Blob([data], {type: "text/csv;charset=utf-8"});
		// saveAs(blob, filename);
	});
}

// function getTextNodeHeight(textNode) {
// 	var width = 0;
// 	var height = 0;
// 	if (document.createRange) {
// 		var range = document.createRange();
// 		range.selectNodeContents(textNode);
// 		if (range.getBoundingClientRect) {
// 			var rect = range.getBoundingClientRect();
// 			if (rect) {
// 				width = rect.right - rect.left;
// 				height = rect.bottom - rect.top;
// 			}
// 		}
// 	}
// 	return [width, height];
// }

// console.log($("#sites-canvas-main-content"));
// var tmp = document.getElementById(document.body);
// var txt = getText(document.getElementById("sites-canvas-main-content")).replace(/\n\s*\n/g, '\n');
// console.log("Extracted text is");
// console.log(txt);