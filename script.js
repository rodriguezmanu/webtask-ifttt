'use latest';
'use strict';

var handlebars = require('handlebars');

function getHtml() {
    return `
    <html>
        <head>
        <title>Best Buy Playstation News</title>
        </head>
        <body>
            {{#if products.length}}
                <ul>
                    {{#each products}}
                    <li>
                    <a href={{productUrl}}>
                        <img src="{{productImage}}" alt="image-product">
                            {{productSKU}}: {{productName}} - USD {{productPrice}}
                        </li>
                    </a>
                    {{/each}}
                </ul>
            {{else}}
                <h1>No news yet!</h1>
            {{/if}}
        </body>
    </html>
    `;
}

function checkSKU(data, id) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].productSKU === id) {
            return false;
        }
    }
    return true;
}

module.exports = function (context, req, res) {

    context.storage.get((error, data) =>  {
        if (error) {
            return cb(error);
        }

        if (data === undefined) {
            var data = [];
            data.push(context.data);
        } else if (checkSKU(data, context.data.productSKU)) {
            data.push(context.data);
        }
        context.storage.set(data, (error) => {
            if (error) {
                return cb(error);
            }
        });
    });
    //would be great use Q ;) instead of timeout
    setTimeout(function () {
        context.storage.get((error, data) => {
            if (error) {
                return cb(error);
            }
            const template = handlebars.compile(getHtml());

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(template({products : data}));
        });
    }, 500);
}
