function RenderMenu() {
    // Get JSON for the menu information
    ret = $.ajax({
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
    
    ret.done(function(menu) { // Loads HTML of the menu from the JSON response text
        html = "<div id='u"+4949+"' class='unit col-md-6'>"+$(menu).html()+"</div>";
        html = html.replace("Service Unit:", "Service Unit<br/>");
        html = html.replace(/\<h3\>/g,'<h4>').replace(/\<\/h3\>/g,'</h4>');
        html = html.replace('<strong>','<h3>').replace('</strong>','</h3>');
        html = html.replace('<p class="unit"></p>','');
        

        html = html.replace('.75rem;','2rem;margin-top:1.5rem;border-top:1px solid #777;display:none;');
        var pos = html.indexOf('<center>');
        if (pos > -1) {
            if (4949 === 48) {
                html = [html.slice(0,pos), '<h3>Moulton Union Service Unit</h3>', html.slice(pos)].join('');
            } else {
                html = [html.slice(0,pos), '<h3>Thorne Hall Service Unit</h3>', html.slice(pos)].join('');
            }
            html = html.replace("<center>", '<p>').replace('</center>', '</p>').replace('<em>','').replace('</em>','');
        }
            $("#mbox").append(html);
    
    });

    // TODO: parse ret 
}

RenderMenu()