
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
    if (event.data == YT.PlayerState.ENDED && amPartyHost) {
        party.update({currentlyPlaying: null});
        loadNextSong();
    }

    if (!amPartyHost) {
        player.pauseVideo();
    }
}

function loadNextSong() {
    party.once('value', function(partyRef) {
        if (partyRef) {
            var party_val= partyRef.val();
            var guest_list= party_val.guestList;

            var nextInLine= party_val.nextInLine;
            var nextUp= party_val.nextUp;

            if (nextUp) {
                nextUpTrack= guest_list[nextInLine].playlist[nextUp];
                // loadNextSong(nextUpTrack, nextInLine, true);
                party.update({currentlyPlaying: nextUpTrack});

                loadSpecificTrack(nextUpTrack);
                if (amPartyHost) remove_track(JSON.stringify(nextUpTrack), nextInLine, true);
            } else {
                player.loadVideoById(null);
            }
        }
    })
}

function loadCurrentlyPlaying(currentlyPlayingRef) {
    if (currentlyPlayingRef && currentlyPlayingRef.val()) {
        loadSpecificTrack(currentlyPlayingRef.val());
        if (amPartyHost) {
            player.playVideo();
        } else {
            player.pauseVideo();
        }
        noSongPlaying= false;
    } else if (!currentlyPlayingRef.val()) {
        player.loadVideoById(null);
        noSongPlaying= true;
    }
}

function loadSpecificTrack(track) {
    player.loadVideoById(track.trackUri);
    // var url= window.location.origin + "/loadVideo"
    // $.ajax({
    //     dataType: "json",
    //     url: url,
    //     data: {q: track.trackName+' '+track.trackArtist},
    //     success: function(data) {
    //         // console.log(data);
    //         player.loadVideoById(data.videoId);
    //     },
    //     error: function(data) {
    //         console.log(data);
    //     }
    // })
}














