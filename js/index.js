var quoteQueries = [];
var currentQuote = null;

function getNextQuote() {
  if (currentQuote === null || currentQuote === quoteQueries.length - 1) {
    $.getJSON("http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?", quoteReady);
  } else if (currentQuote < quoteQueries.length - 1) {
    currentQuote++;
    var json = quoteQueries[currentQuote];
    setQuoteText(json.quoteText.trim(), json.quoteAuthor);
  }
}

function getLastQuote() {
  if (currentQuote > 0) {
    currentQuote--;
    var json = quoteQueries[currentQuote];
    setQuoteText(json.quoteText.trim(), json.quoteAuthor)
  }
}

function quoteReady(json) {
  setQuoteText(json.quoteText.trim(), json.quoteAuthor);
  quoteQueries.push(json);
  if (currentQuote === null) {
    currentQuote = 0;
  } else {
    currentQuote++;
  }
}

function setQuoteText(quote, quoteAuthor) {
  $(".quote-text").html("\"" + quote + "\"");
  if (quoteAuthor) {
    $("div.quote-author > h2").html("- " + quoteAuthor);
  } else {
    $("div.quote-author > h2").html("");
  }
}

function shareToTwitter() {
  var quoteText = quoteQueries[currentQuote].quoteText.trim();
  var quoteAuthor = quoteQueries[currentQuote].quoteAuthor;
  if(!quoteAuthor) {
    quoteAuthor = "Unknown";
  }
  var maxTextLength = 124 - quoteAuthor.length; 
  if(quoteText.length > maxTextLength) {
    quoteText = quoteText.substring(0, maxTextLength - 4);
    quoteText = quoteText + "...";
  }
  var link = "https://twitter.com/intent/tweet/?text=" + "%22" + quoteText + "%22%20-%20" + quoteAuthor + "&hashtags=Quotomaton";
  $("a.twitter-share-link").attr("href", link);
}

$(document).ready(function() {
  getNextQuote();
  $("#get-next-quote").click(getNextQuote);
  $("#get-last-quote").click(getLastQuote);
  $("a.twitter-share-link").click(shareToTwitter);
});