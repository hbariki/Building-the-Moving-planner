
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ',' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address +' ';
    $body.append( '<img class="bgimg" src="' + streetviewUrl + '">');

    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr +
        '&sortnewest&api-key=6366822d75c64c0fa83b4e39a57a5bde';
    $.getJSON(nytimesUrl, function (data) {
        $nytHeaderElem.text('New York Times Articles About' + cityStr);
        articles = data.response.docs;
        for (var i=0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class = "article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+ article.snippet +'</p>'+
            '<li>');
        };

    }).fail(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+ cityStr +'&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources")
    }, 8000);
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp is a callback
         }).done(function(response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href = "' + url + '">' + articleStr + '</a></li>');

            };
            clearTimeout(wikiRequestTimeout);



    });

    return false;
}
$('#form-container').submit(loadData);
