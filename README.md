vproduct
=======
The Node.js challenge
Use whatever npm projects you would like

Create a RESTful resource, in Node, that accesses the BBYOPEN Products API (https://bbyopen.com/documentation/products-api/).

Resource should accept the following parameters (all are optional):

 * minimum-price - Number that should be the lower end of the product prices returned
 * maximum-price - Number that should be the upper end of the product prices returned
 * marketplace - Boolean for whether-or-not returned items come from the BBY marketplace
 * new - Boolean for whether-or-not to include include "new" items
 * keyword - String that searches product name
 * per-page - Default 100, only applicable if request is for JSON
 * page - Default 1 (count starts at 1), only applicable if request is for JSON

Response should support be:
 * Full CSV dump of all item URLs
 * JSON representation of results (use best judgment for snippet of each item). JSON should also include count of total items matched

Try it out the below will return a json object with a products attribute containing 5 items which item attributes:
 
* image
* price
* url
 
This example returns json:

```
http://vproduct.herokuapp.com/products?maximum-price=100&keyword=mp3&marketplace=true&per-page=5&format=json
```

This example downloads the data in csv format:

```
http://vproduct.herokuapp.com/products?maximum-price=100&keyword=mp3&marketplace=true&per-page=5&format=csv
```