
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100',
    width: '300',
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        party.once('value', function(partyRef) {
            if (partyRef) {
                var party_val= partyRef.val();
                var guest_list= party_val.guestList;

                var songOwner= party_val.songOwner;
                console.log(songOwner);
                var nextUp= party_val.nextUp;

                if (nextUp) {
                    nextUpTrack= guest_list[songOwner].playlist[nextUp];
                    loadNextSong(guest_list, nextUpTrack, songOwner, true);
                }
            }
        })
    }

    console.log(amPartyHost);
    if (!amPartyHost) {
        player.pauseVideo();
    }
}

function loadNextSong(guest_list, nextUpTrack, songOwner, autoplay=false) {
  var request = gapi.client.youtube.search.list({
    q: nextUpTrack.trackName+' '+nextUpTrack.trackArtist,
    part: 'id, snippet',
    type: 'video'
  });

  request.execute(function(response) {

    if (autoplay) {
      player.loadVideoById(response.items[0].id.videoId);
    } else {
      player.cueVideoById(response.items[0].id.videoId);
    }

    remove_track(JSON.stringify(nextUpTrack), songOwner, true);

  });
}














