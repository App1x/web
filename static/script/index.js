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

// var Song= function(songName) {
// 	this.next= null;
// 	this.previous= null;
// 	this.songName= songName;
// }

// var Guest= function(guestName) {
// 	this.next= null;
// 	this.previous= null;
// 	this.guestName= guestName;
// 	this.headSongName= null;
// }

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

function isEmpty(abc) {
    for(var prop in abc) {
        if(abc.hasOwnProperty(prop))
            return false;
    }
    return true;
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

function songListItem(song) {
	return "<tr><td>"+song.id+"</td><tr>"
}

function show_login_page() {
	$("#main_page").hide();
	$("#login_page").show();
}

function show_main_page() {
	$("#login_page").hide();
	$("#main_page").show();
}

function leave_party() {
	var name= this.myName;
	this.guestList.transaction(function(guest_list) {
		return removeNode(guest_list, guest_list[name]);
	})
	$("#list_my_songs").html("")
	$("#list_next_songs").html("")

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
					var songs= data.val();
					list_html= [];

					var currentSong= findHead(songs);
					while (currentSong!=null) {
						list_html.push(songListItem(currentSong));
						var nextSongName= currentSong.next;
						currentSong= songs[nextSongName];
					}
					
					$("#list_my_songs").html(list_html.join("\n"));
				// }
			})

			guestList.on('value', function(data) {
				guestList.once('value', function(guestListRef) {
					var partySize= guestListRef.numChildren();  //shut down party if empty
					if (partySize===0) {
						party.remove();
					}

					list_html= [];
					var guest_list= guestListRef.val();
					var currentGuest= findHead(guest_list);
					while (currentGuest!=null) {
						var nextSong= findHead(currentGuest.playlist);
						if (nextSong) {
							list_html.push(songListItem(nextSong));
						}
						var nextGuestName= currentGuest.next;
						currentGuest= guest_list[nextGuestName];
					}

					$("#list_next_songs").html(list_html.join("\n"));
				});
			})

			show_main_page();
		}
	});
};

function add_song(songName) {

	myStuff.transaction(function(guest) {
		if (guest) {
			var newSong= new Node(songName);
			guest.playlist= insertNode(guest.playlist, newSong, "end");
		}
		return guest;
	})
}






























