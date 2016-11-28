// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  // $('#search-button').attr('disabled', false);
}

// Search for a specified string.
function loadFirstResult(q) {
  // var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'id, snippet'
  });

  request.execute(function(response) {
    // var str = JSON.stringify(response.result);
    // $('#search-container').html('<pre>' + str + '</pre>');

    player.loadVideoById(response.items[0].id.videoId);

  });
}
