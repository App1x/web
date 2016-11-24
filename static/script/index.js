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

var Song= function(songName) {
	this.nextSongName= null;
	this.previousSongName= null;
	this.songName= songName;
}

var Guest= function(guestName) {
	this.guestName= guestName;
	this.nextGuestName= null;
	this.previousGuestName= null;
	this.headSongName= null;
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
	// console.log("leave")
	this.myStuff.remove();
	$("#list_songs").html("")

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
		if (party) {
			if (party.password!==password) {  //abort if password doesn't match
				$('#partyname').val("");
				$('#partyname').attr("placeholder", "Party name already exists");
				return;
			}
		} else {
			party= {guestList: {}, headGuestName: guestName, password: password};  //create new party
		}

		party.guestList[guestName]= party.guestList[guestName] || new Guest(guestName);

		return party;
	}, function(error, committed, snapshot) {
		console.log(committed);
		if (got_in) {
			myName= guestName;
			party= parties.child(partyName);
			guestList= party.child('guestList');
			myStuff= guestList.child(guestName);
			myPlaylist= myStuff.child('playlist');

			//update my playlist
			myPlaylist.on('value', function(data) {
				if (data) {
					var songs= data.val();
					console.log(songs);
					list_html= [];

					$.each(songs, function(index, song) {
						if (song.previousSongName==null) {
							var currentSong= song;
							do {
								list_html.push("<tr><td>"+currentSong.songName+"</td><tr>");
								var nextSongName= currentSong.nextSongName;
								currentSong= songs[nextSongName];
							} while (currentSong!=null)
							return false;
						}
					})
					
					$("#list_songs").html(list_html.join("\n"));
				}
			})

			//shut down party if empty
			guestList.on('value', function(data) {
				guestList.once('value', function(guest_list) {
					var partySize= guest_list.numChildren();
					if (partySize===0) {
						party.remove();
					}
				});
			})

			// //update guestOrder
			// 	party.transaction(function(party_info) {
			// 		if (party_info) {
			// 			partySize= -1;
			// 			guestList.once("value", function(guest_list) {
			// 				partySize= guest_list.numChildren();
			// 			});
			// 			party_info.guestOrder= partySize;

			// 		}
			// 		return party_info;
			// 	})
			// })

			show_main_page();
		}
	});
};

function add_song(songName) {

	myStuff.transaction(function(guest) {
		if (guest) {
			var newSong= new Song(songName);
			if (guest.playlist==null) {
				guest.playlist= {};
				guest.headSongName= songName;
			} else {
				myPlaylist.transaction(function(data) {  //attach song to tail of linked list
					console.log(data);
					if (data) {
						$.each(data, function(index, song) {
							if (song.nextSongName==null) {
								guest.playlist[song.songName].nextSongName= songName
								newSong.previousSongName= song.songName;
							}
						});
					}
					return data;
				})
			}
			guest.playlist[songName]= newSong;
		}
		return guest;
	})
}






























