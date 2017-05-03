# Web Data View Chrome Extractor - Team Nexus
This tool selects the titles of **hard drives**, predicts the labels and displays them in a tabular manner.
## Mentor
Long Tuan Pham
## Installation
1. Add extension to Chrome.
2. Tools -> More tools -> Extensions
3. Check “Developer Mode”
4. Click “Load upacked extensions”
5. Navigate to folder “web-scraper-chrome-extension/extension”, click “ok”
6. Ensure “Enabled” is checked and “Collect errors” is disabled”

## Usage
1. To use: Navigate to [test site](http://webscraper.io/test-sites/e-commerce/allinone) for easy use first
2. Open web tools (F12), then select “Web Scraper” tab:
3. Click “Create new sitemap -> Create sitemap”, then enter a test name and the test URL from above, then click “Create Sitemap”.
4. Sitemap name: testrun

```
Start URL: http://webscraper.io/test-sites/e-commerce/allinone
```

5. Click “Add new selector”, then enter in test data. Select the data you want to scrape, ideally the “Title” of the products in the test page. This is done by highlighting the product and clicking on it. You want to click on at least two so the extension can be more specific. When finished selecting, click on “Done selecting!” in the top pane. Then click “Save selector”

```
Id: testTitle
Type: Text
Selector: Select
Multiple: Checked
Regex: LEAVE BLANK
Delay (ms): LEAVE BLANK
Parent Selectors: _root (selected)
```

6. Selecting “Element preview” in the Sitemap screen will highlight the elements that fit the selector criteria. Selecting “Data preview” will give a preliminary data scrape.
7. To run the Scrape, select “Sitemap” (make sure your sitemap name is next to it in the main menu), then “Scrape”, then “Start scraping”. A list will be produced.
8. In the main directory, do `python chrome.py 5000` which will start the flask server. In the folder there's a trained model for testing the new data.
9. Click on Send to Labeler which will return back the labelled json object for each product in the Web Scraper console.

## What you can contribute?

* Improve usability to allow the output to show as a popup instead and allow user to make changes to errors(if any).
* Expand the amount of information used by parsing the descriptions and other page contents to give more complete info
* Allow tool to be used for multiple domains.
* Create self-improving models that allow user feedback and corrections and automatic training of the model.

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Credits
Arpit Garg, Cassandra Jacobs, Chen Zhang, Revanth Reddy

