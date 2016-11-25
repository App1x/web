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

// firebase.auth().signInAnonymously().catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });

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
		if (node.prev==null) {
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
		// if (headNode!=null) {
			headNode.prev= node.id;
			node.next= headNode.id;
		// }
	} else if (position==="end") {
		var endNode= findTail(linkedList);
		// if (endNode!=null) {
			endNode.next= node.id;
			node.prev= endNode.id;
		// }
	} else {
		var currentNode= findHead(linkedList);
		var index= 0;
		// if (currentNode!=null) {
			while (currentNode.next!=null && index<position) {
				currentNode= linkedList[currentNode.next];
			}
			node.next= currentNode.next;
			currentNode.next= node.id;
			node.prev= currentNode.id;
		// }
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
		if (currentNode===node) {
			if (node.prev!=null) linkedList[node.prev].next= node.next || null;
			if (node.next!=null) linkedList[node.next].prev= node.prev || null;
			linkedList[node.id]= null;
			break;
		}
		currentNode= linkedList[currentNode.next];
	}
	return linkedList;
}
//end class Node

// function trackListElement(track) {
// 	var nameElement= jQuery('<span/>', {
// 	    class: "track_name",
// 	    text: track.trackName
// 	});

// 	var artistElement= jQuery('<span/>', {
// 		class: "track_artist",
// 		text: track.trackArtist
// 	});
// 	return nameElement.prop('outerHTML')+" - "+artistElement.prop('outerHTML')
// }

//class Song
function Track(trackUri, trackName, trackArtist) {
	Node.call(this, trackUri);
	this.trackUri= trackUri;
	this.trackName= trackName;
	this.trackArtist= trackArtist;

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
//end class Song

function show_login_page() {
	$("#main_page").hide();
	$("#login_page").show();
}

function show_main_page() {
	$("#login_page").hide();
	$("#main_page").show();
}

// function shut_down_party() {
// 	console.log(party.toString());
// 	firebase.database().ref('parties/a').remove();
// }

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

function shut_party_down() {
	this.party.remove();
}

function create_or_join_party(partyName, password, guestName) {

	var got_in= true
	parties.child(partyName).transaction(function(party) {
		// newGuest= new Node(guestName);
		if (party) {
			if (party.password!==password) {  //abort if password doesn't match
				$('#partyname').val("");
				$('#partyname').attr("placeholder", "Party name already exists");
				return;
			}
		} else {
			party= {guestList: {}, password: password};  //create new party
		}

		if (party.guestList[guestName]==null) {
			party.guestList= insertNode(party.guestList, new Node(guestName), "end");
		}

		return party;
	}, function(error, committed, snapshot) {
		if (got_in) {
			myName= guestName;
			party= parties.child(partyName);
			guestList= party.child('guestList');
			myStuff= guestList.child(guestName);
			myPlaylist= myStuff.child('playlist');

			//update my playlist
			myPlaylist.on('value', function(data) {
				// if (data) {
					var tracks= data.val();
					console.log(tracks);
					list_html= [];

					var currentTrack= findHead(tracks);
					// console.log(currentTrack);
					while (currentTrack!=null) {
						list_html.push("<tr><td>"+currentTrack.displayNameHTML+"</td></tr>");
						var nextTrackName= currentTrack.next;
						// console.log(nextTrackName);
						currentTrack= tracks[nextTrackName];
					}
					
					$("#list_my_tracks").html(list_html.join("\n"));
				// }
			})

			guestList.on('value', function(data) {
				guestList.once('value', function(guestListRef) {
					// var partySize= guestListRef.numChildren();  //shut down party if empty
					// if (partySize===0) {
					// 	party.remove();
					// }

					list_html= [];
					var guest_list= guestListRef.val();
					var currentGuest= findHead(guest_list);
					while (currentGuest!=null) {
						var nextTrack= findHead(currentGuest.playlist);
						if (nextTrack) {
							list_html.push("<tr><td>"+nextTrack.displayNameHTML+"</td></tr>");
						}
						var nextGuestName= currentGuest.next;
						currentGuest= guest_list[nextGuestName];
					}

					$("#list_next_tracks").html(list_html.join("\n"));
				});
			})

			show_main_page();
		}
	});
};

function search_song(track, artist, album, page=1, limit=5) {
	// var base_url = window.location.origin;
	// var url= base_url+'/spotify_search'

	var q= [];
	// track= []
	var type= ["track"];
	if (track) {
		q.push(track);
		// type.push("track");
	}
	if (artist) {
		q.push(artist);
		// type.push("artist");
	}
	if (album) {
		q.push(album);
		// type.push("album");
	}

	// var url= "https://api.spotify.com/v1/search?q="+q.join("+")+"&type="+type.join(",")+"&limit="+limit+"&offset="+(limit*(page-1))
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

				var newTrack= new Track(uri, trackName, artists);

				// // html elements
				// var nameElement= jQuery('<span/>', {
				//     class: "track_name",
				//     text: trackName
				// });

				// var artistElement= jQuery('<span/>', {
				// 	class: "track_artist",
				// 	text: artists
				// });

				var resultTD= jQuery('<td/>', {
					id: "search_result"+index,
					track: JSON.stringify(newTrack)
				}).html(newTrack.displayNameHTML);

				var addButton= jQuery('<button/>', {
					onclick: 'add_track($("#search_result'+index+'").attr("track"))',
					text: "+"
				});

				var rowElement= jQuery('<tr/>').html(resultTD.prop('outerHTML')+"<td>"+addButton.prop('outerHTML')+"</td>");

				console.log(rowElement);

				html.push(rowElement);
			});

			$("#search_results").html(html);
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
			// var newTrack= new Track(trackUri, trackName, trackArtist);
			guest.playlist= insertNode(guest.playlist, newTrack, "end");
		}
		return guest;
	})
}






























