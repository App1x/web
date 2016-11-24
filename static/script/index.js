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
var myUsername= null;
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
    leave_party(myUsername);
  }
  // ...
});

// firebase.auth().signInAnonymously().catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });

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
	var myUsername= null;
	var myStuff= null;
	var myPlaylist= null;
	show_login_page();
}

function shut_party_down() {
	this.party.remove();
}

function create_or_join_party(partyName, password, username) {

	var got_in= true
	parties.child(partyName).transaction(function(party) {

		var new_user= {
			order: 1,
			nextSongOrder: 0
		}

		// console.log("party: "+party);
		if (party) {  //join party
			// console.log("join");
			if (party.password===password) {  //bounce these fools
				// console.log("pass matches");
				if (party.guestList==null) {
					party.guestList= {};
				}
				if (party.guestList[username]==null) {
					// console.log("new guest")
					new_user.order= ++party.guestOrder;
					party.guestList[username]= new_user;
				}
			} else {
				// console.log("pass doesn't match");
				$('#partyname').val("");
				$('#partyname').attr("placeholder", "Party name already exists");
				// got_in= false;
			}
		} else {  //create party
			// console.log("create");

			party= {guestOrder: 1, guestList: {}, password: password};
			party.guestList[username]= new_user;
		}

		return party;
	}, function(error, committed, snapshot) {
		if (got_in) {
			party= parties.child(partyName);
			guestList= party.child('guestList');
			myUsername= username;
			myStuff= guestList.child(username);
			myPlaylist= myStuff.child('playlist');

			//update my playlist
			myPlaylist.on('value', function(data) {
				// console.log(data.val());
				// $("#list_songs").append("<tr><td>"+data.val().songName+"</td><tr>");
				if (data.val()) {
					list_html= [];
					data.val().forEach(function(song) {
						// console.log(song.key);
						list_html[song.order]= ("<tr><td>"+song.songName+"</td><tr>");
					});
					$("#list_songs").html(list_html.join("\n"));
				}
			})

			//update guestOrder
			guestList.on('value', function(data) {
				guestList.once("value", function(guest_list) {
					var partySize= guest_list.numChildren();
					if (partySize===0) {
						party.remove();
					}
				});
			})


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

	var new_song= {
		order: 1,
		songName: songName
	}
	// myPlaylist.push(new_song);

	myStuff.transaction(function(stuff) {  //update nextSongOrder
		// console.log(guestList.child(myUsername).toString());
		// console.log(stuff);
		if (stuff) {
			console.log(stuff);
			console.log(stuff.playlist);
			if (stuff.playlist==null) {
				// console.log('does not have playlist')
				stuff.playlist= {};
				// console.log(stuff);
			}
			new_song.order= ++stuff.nextSongOrder
			stuff.playlist[new_song.order]= new_song
		}
		return stuff;
	})
}






























