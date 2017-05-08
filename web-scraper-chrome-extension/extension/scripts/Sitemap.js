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
                string += row[column] + '\n\n';
            });
        });
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
    // create dataTable object
    $('#viewport').html('<table id="masterTable"></table>');
    if ( $.fn.DataTable.isDataTable('#masterTable') ) {
        $('#masterTable').DataTable().destroy();
    }
    $('#masterTable').empty();

    // send postData to server
    // return tokenized data

    $.post("http://127.0.0.1:5000/hello", postData, function(data, status) {
        //tests
        //alert(data);
        // end tests

        $('#viewport').append(data);


        // output is returned as a variable (data)

        /*
        // this posts from a test data file in proper order but requires all fields to exist
        $('#viewport').html('<table id="masterTable" border="1">' +
             '<thead><tr>'+
                 '<th>company</th>' +
                 '<th>misc</th>' +
                 '<th>rate</th>' +
                 '<th>model</th>' +
                 '<th>type</th>' +
                 '<th>size</th>' +
                 '</tr></thead></table>');

        $.post("data.json", function(data) {
             var tbl_body = '';
             var odd_even = false;
             var tableHeaders = ['company', 'misc', 'rate', 'model', 'type', 'size'];

             $.each(data, function(key, subset){
                 var tbl_row = '';

                 for (var i = 0; i < tableHeaders.length; i++) {
                     $.each(this, function (key2, harddrives) {
                         //key2 is the column name

                         if (tableHeaders[i] == key2) {
                            tbl_row += '<td>' + harddrives + '</td>';
                         } else if (key2.hasOwnProperty(tableHeaders[i])){
                            tbl_row += '<td> &nbsp; </td>';
                         }
                     });
                 }

                 tbl_body += "<tr class=\""+( odd_even ? "odd" : "even")+"\">"+tbl_row+"</tr>";
                 odd_even = !odd_even;
            });

        $("#masterTable").append(tbl_body);
        $('#masterTable').DataTable();
        */

        // object method of building table -- if we can get the extension/function to stop hanging :(
        var masterTable = $('#masterTable').DataTable({
            data: data,
            columns: [
                {data: "company"},
                {data: "model"},
                {data: "size"},
                {data: "type"},
                {data: "port"},
                {data: "misc"},
                {data: "rate"},
                {data: "dimension"},
                {data: "speed"},
                {data: "color"}
            ]
        });

        // populate table into viewport
        $('#viewport').append(masterTable);


    });
}