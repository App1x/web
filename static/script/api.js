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
			return "success";
		} else {
			return "error";
		}
	})
}