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

function show_main_page() {
	$("#login_page").hide();
	$("#main_page").show();
}

function leave_party(username) {
	guestList.child(username).remove();
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
			myPlaylist.on('child_added', function(data) {
				console.log(data.val());
				$("#list_songs").append("<tr><td>"+data.val().songName+"</td><tr>");
			})

			show_main_page();
		}
	});
};

function add_song(songName) {

	var new_song= {
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
				console.log('does not have playlist')
				stuff.playlist= {};
				console.log(stuff);
			}
			stuff.playlist[++stuff.nextSongOrder]= new_song
		}
		return stuff;
	})
	// }).then(function(snapshot) {  //actually add the songs
	// 	myPlaylist.push(new_song);
	// 	$("#search_song").val("");
	// 	myPlaylist.transaction(function(list) {
	// 		new_list_html= []
	// 		list.val().forEach(function(song) {
	// 			console.log(song);
	// 			new_list_html[song.val().order]= "<tr><td>"+song.val().songName+"</td><tr>";
	// 		})
	// 		// myShownPlaylist= $("#list_songs")
	// 		$("#list_songs").html(new_list_html.join(""));
	// 	})
	// })
}






























