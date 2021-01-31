var menuHTML;
var dishDict = {'Drink': ['Milk', 'Water', 'Vitamin water', 'Plain o\' water', 'Sparkling water', 'Coca-Cola', 'Root Beer', 'Sprite', 'whatever is in your waterbottle right now']};

function renderMenu() {
    // Get JSON for the menu information from Bowdoin API
    response = $.ajax({
        type: "POST",
        url: "https://apps.bowdoin.edu/orestes/api.jsp",
        data: {
            unit: 49, // 49 = Thorne
            date: 20210131,
            meal: "lunch",
            tra: "guide"
        },
        dataType: "html"
    })

    // Loads HTML of the menu from the JSON response text 
    response.done(function (menu) {
        menuHTML = $(menu).html();

        $("#mbox").append(menuHTML);

        // console.log(menuHTML);
        parseMenuHTML(menuHTML);
    });
}

/*
Populates dictionary
*/
function parseMenuHTML(menuString) {
    // Note: SPECIALLY STORE first category & last category!! 
    // First category is like: `<p class="unit"> <strong>Thorne Hall  <br>  Lunch, 2021-01-31</strong> </p>`
    // Last category is like: `<p style="font-size:.75rem;color:#999;"> <em> Salad Bar, Steamed Rice ... Menu Subject to Change.</em> </p>
    
    // pre-process the string for splitting into categories
    menuString = menuHTML.replace('<p style="font-size:.75rem;color:#999;">', '<h3 style="clear:both;">')

    // 1. Parse menu categories
    const categories = menuString.split('<h3 style="clear:both;">');

    // DEBUG code (excludes non-categories)
    // for (let i = 1; i < categories.length - 1; i++) {
    //     console.log(`Category ${i}: ${categories[i]}`);
    // }

    dishDict['header'] = categories[0]; // first category (see beginning of func for ex.)
    dishDict['footer'] = categories[categories.length - 1]; // last category (see beginning of func for ex.)

    // 2. Parse items for each category (except header & footer)
    for (let catIdx = 1; catIdx < categories.length - 1; catIdx++) {
        // split each item by span
        var items = categories[catIdx].split('<span>');

        // replace HTML tags + print test code
        items[0] = items[0].replace('</h3>', '');
        for (let itemIdx = 1; itemIdx < items.length; itemIdx++) {
            items[itemIdx] = items[itemIdx].replace('</span>\n<br>', '');
            // console.log(`${items[0]}: ${items[itemIdx]}`);
        }
        // Populate dictionry, example: {key : val} --> soup : [cookies & cream, jam & jelly]
        dishDict[items[0]] = items.slice(1);
    }
    console.log(dishDict);
}


function returnMenuToDisplay() {
    var menuToReturn = ""
    
}

renderMenu();