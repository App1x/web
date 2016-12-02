function transfer_host(newHost) {
	var success= false;
	party.child("host").transaction(function(host) {
		if (host) {
			if (amPartyHost) {
				guest_list= [];
				guestList.once('value', function(guestListRef) {
					if (guestListRef) {
						guest_list= guestListRef.val();
					}
				})

				if (newHost in guest_list) {
					host= newHost;
					$("#transfer_host_input").attr("placeholder", newHost+" is now the host!");
					success= true;
				} else {
					$("#transfer_host_input").attr("placeholder", "That guest is not in this party");
				}
				
			} else {
				$("#transfer_host_input").attr("placeholder", "You cannot transfer host privileges");
				success= true;
			}
			$("#transfer_host_input").val("")
		}
		return host;
	})
}