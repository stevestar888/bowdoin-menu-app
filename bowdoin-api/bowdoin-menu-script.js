var menuDate;
var tim = new Date();
var date;
var unit = 49;
var meal = "lunch";
var dows = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var tod = 0;
var dow = 0;

$(function() {
    $.urlParam = function (name) {
        var rtn = null;
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    
        if(null != results) {
    		rtn = results[1];
    	}
    	return rtn;
    }
    
    meal =  $.urlParam('meal');
    date =  $.urlParam('date');

	SetDate(0);

	$(".larr").click( function() { //left arrow
		SetDate(-1);
	});

	$(".rarr").click( function() { //right arrow
		SetDate(1);
	});

	$(".mealbox").click( function() {
		SetMeal( $(this) );
		SetDate(0);
	});
});

function SetMeal(me) {
    $("#mbox").html("");
	meal = me.html().toLowerCase();	
	//console.error("Meal:"+meal);
}

function SetDate(delta) {
    $("#mbox").html("");
	// default current date
	if(null == date) {
		menuDate = new Date();
		date = menuDate.toISOString().split('T')[0];
		date = date.replace(/-/g,"");
	} else {
		menuDate = new Date(date.substring(0,4), parseInt(date.substring(4,6))-1, date.substring(6,8));
	}

	if(delta != 0) { 
		menuDate.setDate(menuDate.getDate() + delta);
		date = menuDate.toISOString().split('T')[0];
		date = date.replace(/-/g,"");
	}

	dow = menuDate.getDay();
	tod = tim.getHours();

	$(".dt").html(dows[dow]+", "+ months[menuDate.getMonth()]+" " +menuDate.getDate());


// Jesse Jones from dining says he wants weekend meals listed as breakfast  and lunch
// now.  So no need for brunch ever?  20200908df
    if(dow == 0 || dow == 6) {
//		$("#brunchl").show();
//		$("#breakfastl").show();
//		$("#lunchl").hide();
//	} else {
		
		$("#brunchl").hide();
		$("#breakfastl").show();
		$("#lunchl").show();
	}
	
// Jesse requests no more brunch displays: 20200908	
	if(null == meal) {

		if( tod < 11 ) { //&& dow < 6 && dow > 0) {
			meal = "breakfast";
		}
		if( tod >=11 && tod < 14 ) { // && dow < 6 && dow > 0) {
			meal = "lunch";
		}
		//if(tod < 14 && (dow == 0 || dow == 6) ) {
		//	meal ="brunch";
		//}
		
		
		if(tod >= 14 ) {
			meal = "dinner";
		}

	} 
	

	showMenu(49, date, meal);
	showMenu(48, date, meal);	
}

function showMenu(un, ds, me) {
	$("div.mnav div").each( function() {
		$(this).attr('class','mealbox');
	});

	$("#"+me+"l").toggleClass("seld");

	$("div#u49").attr("class","unitbox");
	$("div#u48").attr("class","unitbox");
	$("#u"+un).toggleClass("ueld");

   $.ajax({
        type: "POST",
//      url: "https://www.bowdoin.edu/taki/cors.jsp?url=https://apps.bowdoin.edu/orestes/api.jsp",
        url: "https://apps.bowdoin.edu/orestes/api.jsp",
		data: {
			unit: un,
			date: ds,
			meal: me,
			tra: "guide"
		},
        dataType: "html",
	    error: function (xhr, ajaxOptions, thrownError) {
//        alert(xhr.status);
//        alert(thrownError);
        }
    }).done(function(menu) {
        html = "<div id='u"+un+"' class='unit col-md-6'>"+$(menu).html()+"</div>";
        html = html.replace("Service Unit:", "Service Unit<br/>");
        html = html.replace(/\<h3\>/g,'<h4>').replace(/\<\/h3\>/g,'</h4>');
        html = html.replace('<strong>','<h3>').replace('</strong>','</h3>');
        html = html.replace('<p class="unit"></p>','');
        
        
        // 20200908 undoing request to have a single entry
        //$("#u48").hide();
        //$("#u49").css("display","block");
        
       // html.replace("Thorne Hall", "Dining Hall Menu");
        
        html = html.replace('.75rem;','2rem;margin-top:1.5rem;border-top:1px solid #777;display:none;');
        var pos = html.indexOf('<center>');
        if (pos > -1) {
            if (un === 48) {
                html = [html.slice(0,pos), '<h3>Moulton Union Service Unit</h3>', html.slice(pos)].join('');
            } else {
                html = [html.slice(0,pos), '<h3>Thorne Hall Service Unit</h3>', html.slice(pos)].join('');
            }
            html = html.replace("<center>", '<p>').replace('</center>', '</p>').replace('<em>','').replace('</em>','');
        }
        if (un == 48) {
	        $("#mbox").append(html);
        } else {
            $("#mbox").prepend(html);
        }
	});
}