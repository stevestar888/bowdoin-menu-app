var menuHTML;
var foodDict = { 'Drink': ['Decaf coffee', 'Dark coffee', 'Coffee with cream, sugar, honey', 'Tea of choice', 'Iced tea', 'Lemonade', 'Juice of your choice', 'Milk', 'Mineral Water', 'Vitamin water', 'Plain o\' water', 'Sparkling water', 'Coca-Cola', 'Root Beer', 'Sprite', 'whatever is in your waterbottle right now'] };

function renderMenu(meal) {
    menuDate = new Date();

    if(null == meal) {
        tod = menuDate.getHours();
        if( tod < 11 ) { //&& dow < 6 && dow > 0) {
            meal = 'breakfast';
        }
        if( tod >=11 && tod < 14 ) { // && dow < 6 && dow > 0) {
            meal = 'lunch';
        }
       
       
        if(tod >= 14 ) {
            meal = 'dinner';
        }
  
    }
 
    today = menuDate.toISOString().split('T')[0];
    today = today.replace(/-/g,"");

    diningHall = 49 // 49 = Thorne

    // Get JSON for the menu information from Bowdoin API
    response = $.ajax({
        type: "POST",
        url: "https://apps.bowdoin.edu/orestes/api.jsp",
        data: {
            unit: diningHall, 
            date: today,
            meal: meal, //breakfast, lunch, or dinner
            tra: "guide" //preset (no idea what this is)
        },
        dataType: "html"
    })

    // Loads HTML of the menu from the JSON response text 
    response.done(function (menu) {
        menuHTML = $(menu).html();

        $("#mbox").empty();
        $("#mbox").append(menuHTML);

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

    foodDict['header'] = categories[0]; // first category (see beginning of func for ex.)
    foodDict['footer'] = categories[categories.length - 1]; // last category (see beginning of func for ex.)

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
        foodDict[items[0]] = items.slice(1);
    }

    return foodDict;
}
 
 
/* 
* called to display/hide the "make me a fun meal" modal
*/
window.addEventListener('load', function() {
    var modal = document.getElementById('funMealModal');
	var btn = document.getElementById('funMealBtn');
	var span = document.getElementById('funMealSpan');
 
	// display modal in main window
	btn.onclick = function() {
        getFunMeal();
        modal.style.display = 'block';
	};
 
	// close modal on clicking (x)
	span.onclick = function() {
		modal.style.display = 'none';
	};
 
	// close modal when user clicks on window (outside modal)
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
});
 
 
function getFunMeal() {
    console.log("getFunMeal()");
    var preppedMeal = "Your meal is... (in this order): </br></br>";
 
    for (var food in foodDict) {
        if (food === "header" || food === "footer") { // ignore header/footer categories
        } else {
            foodList = foodDict[food];
 
            //get random num from 0 to foodList.length - 1
            randomItemIdx = Math.floor(Math.random() * (foodList.length - 1));
 
            preppedMeal += foodList[randomItemIdx];
            preppedMeal += "</br>"
        }
    }
    
    $("#fun-meal-box").empty();
    $("#fun-meal-box").append(preppedMeal);
    console.log(preppedMeal);
}



renderMenu();