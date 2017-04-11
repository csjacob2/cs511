'use strict';

angular.module('app').controller('domSelectionCtrl', function ($scope) {

	$scope.init = function(){
    };
    
	$scope.activateDomSelection = function() {
		chrome.tabs.executeScript(null, {file: "app/contentScript/activateDomSelection.js"});
	}

	$scope.deactivateDomSelection = function() {
		chrome.tabs.executeScript(null, {file: "app/contentScript/deactivateDomSelection.js"});
	}

	$scope.pubExtraction = function(){
		// chrome.tabs.executeScript(null, {file: "app/jquery-2.1.4.min.js"}, function() {
		// 	chrome.tabs.executeScript(null, {file: "lib/jquery.colorbox.js"});
		// });
		chrome.tabs.executeScript(null, {file: "app/jquery-2.1.4.min.js"});
        chrome.tabs.executeScript(null, {file: "lib/datatables/datatables.js"});
        chrome.tabs.executeScript(null, {file: "lib/datatables/dataTables.buttons.min.js"});
        chrome.tabs.executeScript(null, {file: "lib/datatables/buttons.html5.min.js"});
        chrome.tabs.executeScript(null, {file: "lib/datatables/jszip.min.js"});
        chrome.tabs.executeScript(null, {file: "lib/datatables/pdfmake.min.js"});
        chrome.tabs.executeScript(null, {file: "lib/datatables/vfs_fonts.js"});

        // chrome.tabs.executeScript(null, {file: "https://cdn.datatables.net/v/dt/jszip-2.5.0/pdfmake-0.1.18/dt-1.10.12/af-2.1.2/b-1.2.2/b-colvis-1.2.2/b-flash-1.2.2/b-html5-1.2.2/b-print-1.2.2/cr-1.3.2/fc-3.2.2/fh-3.1.2/kt-2.1.3/r-2.1.0/rr-1.1.2/sc-1.4.2/se-1.2.0/datatables.js"});
		chrome.tabs.executeScript(null, {file: "lib/jquery.colorbox.js"});
		chrome.tabs.executeScript(null, {file: "lib/FileSaver.min.js"});
		chrome.tabs.executeScript(null, {file: "app/contentScript/pubExtraction.js"});
	};

    $scope.pubExtractionFromVisualSelection = function(){
        $scope.pubExtraction();
        chrome.tabs.executeScript(null, {file: "app/contentScript/pubExtractionFromVisualSelection.js"});
    }

    $scope.pubExtractionFromHighlightedText = function(){
        $scope.pubExtraction();
        chrome.tabs.executeScript(null, {file: "app/contentScript/pubExtractionFromHighlightedText.js"});
    }
    
});