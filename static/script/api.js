// function api_leave_party() {
// 	var name= myName;
// 	guestList.transaction(function(guest_list) {
// 		return removeNode(guest_list, guest_list[name]);
// 	}).then(function(data) {
// 		var partySize= data.snapshot.numChildren();  //shut down party if empty
// 		if (partySize===0) {
// 			party.remove();
// 		}

// 		$("#list_my_songs").html("")
// 		$("#list_next_songs").html("")
// 		player.loadVideoById(null);

// 		myPlaylist.off('value');
// 		guestList.off('value');

// 		party= null;
// 		guestList= null;
// 		myName= null;
// 		myStuff= null;
// 		myPlaylist= null;

// 		noSongPlaying= true;

// 		// show_login_page();
// 	})
// }

function api_create_or_join_party(partyName, password, guestName) {

	var got_in= true;
	var amHost= false;
	parties.child(partyName).transaction(function(party) {
		if (party) {
			if (party.password!==password) {  //abort if password doesn't match
				// $('#partyname').val("");
				// $('#partyname').attr("placeholder", "Party name already exists");
				return;
			}
			amHost= party.host===guestName;
		} else {
			party= {guestList: {}, password: password};  //create new party
			amHost= true;
		}

		if (party.guestList[guestName]==null) {
			party.guestList= insertNode(party.guestList, new Node(guestName), "end");
		}

		return party;
	}).then(function(data) {
		if (got_in) {
			$("#writesomething").html("success");
		} else {
			$("#writesomething").html("success");
		}
	})
}