// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  // $('#search-button').attr('disabled', false);
}

// Search for a specified string.
function loadNextSong(guest_list, nextUpTrack, songOwner, autoplay=false) {
  // var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: nextUpTrack.trackName+' '+nextUpTrack.trackArtist,
    part: 'id, snippet',
    type: 'video'
  });

  request.execute(function(response) {
    // var str = JSON.stringify(response.result);
    // $('#search-container').html('<pre>' + str + '</pre>');

    if (autoplay) {
      player.loadVideoById(response.items[0].id.videoId);
    } else {
      player.cueVideoById(response.items[0].id.videoId);
    }

    // console.log(amPartyHost);
    // if (!amPartyHost) {
    //   console.log("pause");
    //   player.pauseVideo();
    // }

    remove_track(JSON.stringify(nextUpTrack), songOwner, true);
    // party.update({guestList: cycleNodes(guest_list)});

  });
}
