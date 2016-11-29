
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
    // videoId: 'M7lc1UVf-VE',
    events: {
      // 'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// // 4. The API will call this function when the video player is ready.
// function onPlayerReady(event) {
//   event.target.playVideo();
// }

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
// var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    party.once('value', function(partyRef) {
      if (partyRef) {
        var party_val= partyRef.val();
        var guest_list= party_val.guestList;

        var songOwner= party_val.songOwner;
        console.log(songOwner);
        var nextUp= party_val.nextUp;

        nextUpTrack= guest_list[songOwner].playlist[nextUp];
        loadNextSong(guest_list, nextUpTrack, songOwner, true, songOwner===myName);
      }
    })

    // guestList.transaction(function(guest_list) {
    //   if (guest_list) {

    //     // var nextUpTrack= null;
    //     // var songOwner= null;
    //     party.once('value', function(partyRef) {
    //       if (partyRef) {
    //         party_val= partyRef.val();

    //         songOwner= party_val.songOwner;
    //         console.log(songOwner);

    //         nextUpTrack= guest_list[songOwner].playlist[party_val.nextUp];
    //         guest_list= loadNextSong(guest_list, nextUpTrack, songOwner, true);
    //       }
    //     })

    //     // nowPlaying= nextUpTrack;

    //     // cycleNodes(guest_list);
    //     // remove_track(JSON.stringify(nowPlaying), songOwner);
    //     // party.update({"songOwner": songOwner})
    //   }
    //   return guest_list;
    // })
  }
}

// function stopVideo() {
//   player.stopVideo();
// }