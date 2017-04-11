# Publication Extraction Web Data View Chrome Extension
This is a subproject of Web Data View project, where you can visually select an area of publication text, or highlight the text, and then the Chrome extension will automatically organize the data into a web table, which can be copied to clipboard, or exported as an Excel file.

Download the code from this page and follow the guildline [here](https://wiki.illinois.edu/wiki/download/attachments/586662115/WebDataViewInstallationGuide.pdf?version=2&modificationDate=1465568899000&api=v2) to install Web Data View Chrome extension. Please note to not use the zip file mentioned in the guide. Instead using the code from this repository because it is more updated.

For the current version, we recommend using "Extract Publications From Highlighted Text" as it is more stable. After installing the extension, do the following steps:
* Highlight the publication text you want to extract. You can highlight one or more citations, but each citation must be complete. 
* Click on the WDV button on the right corner of your Chrome browser, and then click on button "Extract Publications From Highlighted Text"
* There will be an alert showing the text you highlighted. You should click "OK" to dismiss the alert.
* The extraction will take about 8-15 seconds for less than 10 citations, so please be patient.
* After the extraction is done, a table will pop up.
* You can click on "Copy" button at the top of the pop-up window to copy the data to clipboard, which can be pasted to anywhere like Excel.
* You can also select a few constraints that we suggested at the bottom of the pop-up window, and then click on button "Enforce constraints selected below" to enforce the constraints. The constraint enforcement may take 10 seconds to finish.
* You can also right click to any column to let our system know that such field should not exist. After the right click, you will see a red constraint in the list of constraints, which write something like "title does not appear". After adding the constraint, you can also click on button "Enforce constraints selected below" to enforce it, and the system will move content from that field to other fields.

Please note that our Chrome extension at this moment can operate only on non-HTTPS page. Most UIUC professor publication pages use non-HTTPS, but it is not the cases for other universities like UMass, UIC, etc. 
