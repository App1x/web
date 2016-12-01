var config = {
	apiKey: "AIzaSyBMPtIpoTX-tsTuMi3NtWdJrn_-9AuSl5k",
	authDomain: "djparty-74e77.firebaseapp.com",
	databaseURL: "https://djparty-74e77.firebaseio.com",
	storageBucket: "djparty-74e77.appspot.com",
	messagingSenderId: "530519324755"
};
firebase.initializeApp(config);
var parties= firebase.database().ref('parties');
var party= null;
var guestList= null;
var myName= null;
var myStuff= null;
var myPlaylist= null;

var noSongPlaying= true;
var amPartyHost= false;
var amSongOwner= false;
var nowPlaying= null;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    // ...
    console.log(uid);
  } else {
    // User is signed out.
    console.log('logged out');
    // ...
    leave_party(myName);
  }
  // ...
});

firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  console.log(error);
});

function isEmpty(abc) {
    for(var prop in abc) {
        if(abc.hasOwnProperty(prop))
            return false;
    }
    return true;
}

//class Node
var Node= function(id) {
	this.next= null;
	this.previous= null;
	this.id= id;
}

function findHead(linkedList) {
	var head= null;
	$.each(linkedList, function(index, node) {
		if (node.previous==null) {
			head= node;
			return false;
		}
	})
	return head;
}

function findTail(linkedList) {
	var tail= null;
	$.each(linkedList, function(index, node) {
		if (node.next==null) {
			tail= node;
			return false;
		}
	})
	return tail;
}

function insertNode(linkedList, node, position) {
	if (linkedList==null || isEmpty(linkedList)) {
		var linkedList= {};
		linkedList[node.id]= node;
		return linkedList;
	}

	if (position==="start" || position==="beginning") {
		var headNode= findHead(linkedList);
		headNode.previous= node.id;
		node.next= headNode.id;
	} else if (position==="end") {
		var endNode= findTail(linkedList);
		endNode.next= node.id;
		node.previous= endNode.id;
	} else {
		var currentNode= findHead(linkedList);
		var index= 0;
		while (currentNode.next!=null && index<position) {
			currentNode= linkedList[currentNode.next];
		}
		node.next= currentNode.next;
		currentNode.next= node.id;
		node.previous= currentNode.id;
	}
	linkedList[node.id]= node;
	return linkedList;
}

function removeNode(linkedList, node) {
	if (linkedList==null || isEmpty(linkedList)) {
		return linkedList;
	}

	var currentNode= findHead(linkedList);
	while (currentNode!=null) {
		if (currentNode.id===node.id) {
			if (node.previous!=null) linkedList[node.previous].next= node.next || null;
			if (node.next!=null) linkedList[node.next].previous= node.previous || null;
			linkedList[node.id]= null;
			break;
		}
		currentNode= linkedList[currentNode.next];
	}
	return linkedList;
}

function cycleNodes(linkedList) {
	if (Object.keys(linkedList).length > 1) {
		var head= findHead(linkedList);
		var tail= findTail(linkedList);
		linkedList[head.next].previous= null;
		linkedList[head.id].next= null;
		linkedList[head.id].previous= tail.id;
		linkedList[tail.id].next= head.id;
	}
	return linkedList;
}
//end class Node

//class Track
function Track(trackUri, trackName, trackArtist, trackDuration) {
	Node.call(this, trackUri);
	this.trackUri= trackUri;
	this.trackName= trackName;
	this.trackArtist= trackArtist;
	this.trackDuration= trackDuration;

	var nameElement= jQuery('<span/>', {
	    class: "track_name",
	    text: trackName
	});

	var artistElement= jQuery('<span/>', {
		class: "track_artist",
		text: trackArtist
	});

	this.displayNameHTML= nameElement.prop('outerHTML')+" - "+artistElement.prop('outerHTML');
}
//end class Track

function show_login_page() {
	$("#login_page").show();
	$("#play_page").hide();
	$("#my_page").hide();
}

function show_play_page() {
	$("#login_page").hide();
	$("#play_page").show();
	$("#my_page").hide();
}

function show_my_page() {
	$("#login_page").hide();
	$("#play_page").hide();
	$("#my_page").show();
}

function leave_party() {
	var name= this.myName;
	this.guestList.transaction(function(guest_list) {
		return removeNode(guest_list, guest_list[name]);
	}).then(function(data) {
		var partySize= data.snapshot.numChildren();  //shut down party if empty
		if (partySize===0) {
			this.party.remove();
		}
	})
	$("#list_my_songs").html("")
	$("#list_next_songs").html("")

	this.myPlaylist.off('value');
	this.guestList.off('value');

	var party= null;
	var guestList= null;
	var myName= null;
	var myStuff= null;
	var myPlaylist= null;
	show_login_page();
}

function track_html_listing_header() {
	var tr= jQuery('<tr/>');
	$.each(["Title", "Artist", ""], function(index, header) {
		jQuery('<th/>', {
			text: header
		}).appendTo(tr);
	});

	return tr.prop("outerHTML");
}

function track_html_listing(track, add_or_remove, odd) {
	var trackTr= jQuery('<tr/>');
	// if (odd) trackTr.addClass("w3-white");

	func= "add";
	if (add_or_remove=="-") func= "remove";

	var trackNameTd= jQuery('<td/>', {
		text: track.trackName
	});
	var trackArtistTd= jQuery('<td/>', {
		text: track.trackArtist
	});
	var buttonTd= jQuery('<td/>');
	var button= jQuery('<button/>', {
		track: JSON.stringify(track),
		onclick: func+"_track($(this).attr('track'))",
		text: add_or_remove
	});

	trackNameTd.appendTo(trackTr);
	trackArtistTd.appendTo(trackTr);
	if (add_or_remove) {
		button.appendTo(buttonTd);
		buttonTd.appendTo(trackTr);
	} else {
		jQuery('<td/>').appendTo(trackTr);
	}
	return trackTr.prop("outerHTML");
}

function create_or_join_party(partyName, password, guestName) {

	var got_in= true
	parties.child(partyName).transaction(function(party) {
		if (party) {
			if (party.password!==password) {  //abort if password doesn't match
				$('#partyname').val("");
				$('#partyname').attr("placeholder", "Party name already exists");
				return;
			}
			amPartyHost= party.host===guestName;
		} else {
			party= {guestList: {}, password: password};  //create new party
			amPartyHost= true;
		}

		if (party.guestList[guestName]==null) {
			party.guestList= insertNode(party.guestList, new Node(guestName), "end");
		}

		return party;
	}, function(error, committed, snapshot) {  //initialize listeners
		if (got_in) {
			myName= guestName;
			party= parties.child(partyName);
			guestList= party.child('guestList');
			myStuff= guestList.child(guestName);
			myPlaylist= myStuff.child('playlist');

			//save party host
			if (amPartyHost) {
				party.update({host: myName});
			} else {
				console.log("dothis");
			}

			//update my playlist
			myPlaylist.on('value', function(data) {
				var tracks= data.val();
				list_html= [];

				var currentTrack= findHead(tracks);
				var odd= 0;
				while (currentTrack!=null) {
					list_html.push(track_html_listing(currentTrack, "-", 1-(++odd)===0));
					var nextTrackName= currentTrack.next;
					currentTrack= tracks[nextTrackName];
				}
				
				$("#list_my_tracks").html(track_html_listing_header()+list_html.join("\n"));
			})

			guestList.on('value', function(data) {

				var guest_list= data.val();
				var headGuest= findHead(guest_list);

				//populate next up
				var nextUpTrack= null;
				var songOwner= null;
				var list_html= [];
				var odd= 0;
				currentGuest= headGuest;
				while (currentGuest!=null) {
					var nextTrack= findHead(currentGuest.playlist);
					if (nextTrack) {
						if (list_html.length==0) {
							console.log(nextTrack);
							nextUpTrack= nextTrack;
							songOwner= currentGuest.id;

							party.update({nextUp: nextTrack.id, songOwner: songOwner}).then(function(data) {
								if (noSongPlaying || player.getPlayerState()==YT.PlayerState.ENDED) {
									noSongPlaying= false;
									loadNextSong(guest_list, nextUpTrack, songOwner, true);
								}
							});
						}
						list_html.push(track_html_listing(nextTrack, null, 1-(++odd)===0));
					} else {
						party.update({nextUp: null, songOwner: null});
					}
					var nextGuestName= currentGuest.next;
					currentGuest= guest_list[nextGuestName];
				}
				$("#list_next_tracks").html(track_html_listing_header()+list_html.join("\n"));
			})

			show_play_page();
		}
	});
};

function search_song(track, page=1, limit=5) {

	var q= [];
	// track= []
	var type= ["track"];
	if (track) {
		q.push(track);
		// type.push("track");
	}

	var url= "https://api.spotify.com/v1/search";

	$.ajax({
		dataType: "json",
		url: url,
		data: {q:q.join("+"), type:type.join(","), limit:limit, offset:(limit*(page-1))},
		success: function(data) {
			console.log(data);

			var html= [];
			$.each(data.tracks.items, function(index, track) {
				var trackName= track.name;
				var artists= [];
				$.each(track.artists, function(ind, artist) {
					artists.push(artist.name);
				})
				artists= artists.join(", ")
				var uri= track.uri;
				var duration= Math.floor((track.duration_ms/1000)/120)+':'+Math.floor((track.duration_ms/1000)%120);

				var newTrack= new Track(uri, trackName, artists, duration);
				var rowElement= track_html_listing(newTrack, "+", (index+1)%2===1)

				html.push(rowElement);
			});

			$("#search_results").html(track_html_listing_header()+html);
		},
		error: function(error) {
			console.log(error);
		}
	})
}

function add_track(newTrack) {
	newTrack= JSON.parse(newTrack);

	myStuff.transaction(function(guest) {
		if (guest) {
			guest.playlist= insertNode(guest.playlist, newTrack, "end");
		}
		return guest;
	})
}

function remove_track(track, username=myName, cycleGuests=false) {
	track= JSON.parse(track);


	guestList.transaction(function(guest_list) {
		if (guest_list) {
			var playlist= guest_list[username].playlist;
			track= playlist[track.id];
			guest_list[username].playlist= removeNode(playlist, track);
		}
		
		return guest_list;
	}).then(function(guestListRef) {
		console.log(guestListRef);
		var guest_list= guestListRef.snapshot.val();
	    party.update({guestList: cycleNodes(guest_list)});
	});
}






























