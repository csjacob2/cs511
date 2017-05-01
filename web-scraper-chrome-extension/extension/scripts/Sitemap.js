var Sitemap = function (sitemapObj) {
	this.initData(sitemapObj);
};

Sitemap.prototype = {

	initData: function (sitemapObj) {
		for (var key in sitemapObj) {
			this[key] = sitemapObj[key];
		}

		var selectors = this.selectors;
		this.selectors = new SelectorList(this.selectors);
	},

	/**
	 * Returns all selectors or recursively find and return all child selectors of a parent selector.
	 * @param parentSelectorId
	 * @returns {Array}
	 */
	getAllSelectors: function (parentSelectorId) {

		return this.selectors.getAllSelectors(parentSelectorId);
	},

	/**
	 * Returns only selectors that are directly under a parent
	 * @param parentSelectorId
	 * @returns {Array}
	 */
	getDirectChildSelectors: function (parentSelectorId) {
		return this.selectors.getDirectChildSelectors(parentSelectorId);
	},

	/**
	 * Returns all selector id parameters
	 * @returns {Array}
	 */
	getSelectorIds: function () {
		var ids = ['_root'];
		this.selectors.forEach(function(selector){
			ids.push(selector.id);
		});
		return ids;
	},

	/**
	 * Returns only selector ids which can have child selectors
	 * @returns {Array}
	 */
	getPossibleParentSelectorIds: function () {
		var ids = ['_root'];
		this.selectors.forEach(function(selector){
			if(selector.canHaveChildSelectors()){
				ids.push(selector.id);
			}
		}.bind(this));
		return ids;
	},

	getStartUrls: function() {

		var startUrls = this.startUrl;
		// single start url
		if(this.startUrl.push === undefined) {
			startUrls = [startUrls];
		}

		var urls = [];
		startUrls.forEach(function(startUrl) {

			// zero padding helper
			var lpad = function(str, length) {
				while (str.length < length)
					str = "0" + str;
				return str;
			};

			var re = /^(.*?)\[(\d+)\-(\d+)(:(\d+))?\](.*)$/;
			var matches = startUrl.match(re);
			if(matches) {
				var startStr = matches[2];
				var endStr = matches[3];
				var start = parseInt(startStr);
				var end = parseInt(endStr);
				var incremental = 1;
				console.log(matches[5]);
				if(matches[5] !== undefined) {
					incremental = parseInt(matches[5]);
				}
				for (var i = start; i <= end; i+=incremental) {

					// with zero padding
					if(startStr.length === endStr.length) {
						urls.push(matches[1]+lpad(i.toString(), startStr.length)+matches[6]);
					}
					else {
						urls.push(matches[1]+i+matches[6]);
					}
				}
				return urls;
			}
			else {
				urls.push(startUrl);
			}
		});

		return urls;
	},

	updateSelector: function (selector, selectorData) {

		// selector is undefined when creating a new one
		if(selector === undefined) {
			selector = new Selector(selectorData);
		}

		// update child selectors
		if (selector.id !== undefined && selector.id !== selectorData.id) {
			this.selectors.forEach(function (currentSelector) {
				currentSelector.renameParentSelector(selector.id, selectorData.id)
			});

			// update cyclic selector
			var pos = selectorData.parentSelectors.indexOf(selector.id);
			if (pos !== -1) {
				selectorData.parentSelectors.splice(pos, 1, selectorData.id);
			}
		}

		selector.updateData(selectorData);

		if (this.getSelectorIds().indexOf(selector.id) === -1) {
			this.selectors.push(selector);
		}
	},
	deleteSelector: function (selectorToDelete) {

		this.selectors.forEach(function(selector) {
			if(selector.hasParentSelector(selectorToDelete.id)) {
				selector.removeParentSelector(selectorToDelete.id);
				if(selector.parentSelectors.length === 0) {
					this.deleteSelector(selector)
				}
			}
		}.bind(this));

		for (var i in this.selectors) {
			if (this.selectors[i].id === selectorToDelete.id) {
				this.selectors.splice(i, 1);
				break;
			}
		}
	},
	getDataTableId: function () {
		return this._id.replace(/\./g, '_');
	},
	exportSitemap: function () {
		var sitemapObj = JSON.parse(JSON.stringify(this));
		delete sitemapObj._rev;
		return JSON.stringify(sitemapObj);
	},
	importSitemap: function (sitemapJSON) {
		var sitemapObj = JSON.parse(sitemapJSON);
		this.initData(sitemapObj);
	},
	// return a list of columns than can be exported
	getDataColumns: function () {
		var columns = [];
		this.selectors.forEach(function (selector) {

			columns = columns.concat(selector.getDataColumns());
		});

		return columns;
	},
	getDataExportCsvBlob: function (data) {

		var columns = this.getDataColumns(),
			delimiter = ',',
			newline = "\n",
			csvData = ['\ufeff']; // utf-8 bom char

		// header
		csvData.push(columns.join(delimiter) + newline)

		// data
		data.forEach(function (row) {
			var rowData = [];
			columns.forEach(function (column) {
				var cellData = row[column];
				if (cellData === undefined) {
					cellData = "";
				}
				else if (typeof cellData === 'object') {
					cellData = JSON.stringify(cellData);
				}

				rowData.push('"' + cellData.replace(/"/g, '""').trim() + '"');
			});
			csvData.push(rowData.join(delimiter) + newline);
		});

		return new Blob(csvData, {type: 'text/csv'});
	},



    //new feature for CS511
    pushDataToLabeler: function (data) {
        var columns = this.getDataColumns();
        var string = '';

        data.forEach(function (row) {
            columns.forEach(function(column) {
                string += row[column] + '\n';
            });
        });
        alert (string);
        drawTable(string, []);
    },



	getSelectorById: function (selectorId) {
		return this.selectors.getSelectorById(selectorId);
	},
	/**
	 * Create full clone of sitemap
	 * @returns {Sitemap}
	 */
	clone: function () {
		var clonedJSON = JSON.parse(JSON.stringify(this));
		var sitemap = new Sitemap(clonedJSON);
		return sitemap;
	}
};


function drawTable (postData, curConstraints) {

    alert('draw table');

    //$('#cboxLoadingOverlay, #cboxLoadingGraphic').show();
    // console.log($('#cboxLoadingGraphic').size());

    /*
    // send postData to server
    // return tokenized data
    $.post("extractPubData.php", postData, function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
    $.post( "http://foreverdarkness.ca/cs511/test.php", function() {
        alert( "success");
    })
    .done(function() {
        alert( "second success" );
    })
    .fail(function() {
        alert( "error" );
    });
     */

    var tempData = 'model\tcompany\tcolor\ttype\tsize\tport\to\nWD2500AAJS WD2500AAJS\tWestern Digital\tCaviar Blue\t\t\tHard Drive\nMy Passport Ultra\tWD\tBlack\tPortable External\t1 TB\tUSB 3.0\t(Old Model) Hard Drive with Auto Backup';

    var rows = tempData.split('\n');                // create array of rows
    var headerRow = rows[0].split('\t');             // create header row into array of titles
    var dataRow = [];
    var printout = '';

    $.each(headerRow, function(index, value){
        //printout+=value + '\n';
        //print out header row
    });

    for (i = 1; i < rows.length; i++) {
        printout = '';
        dataRow[i] = rows[i].split('\t');
        $.each(dataRow, function(index,value){
           printout+=value + ' \n';
        });
    }

    alert (printout);

    alert('end of function');
}