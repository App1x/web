
var party= null;
var guestList= null;
var myName= null;
var myStuff= null;
var myPlaylist= null;

var noSongPlaying= true;
var amPartyHost= false;
var amSongOwner= false;
var nowPlaying= null;

function show_login_page() {
	if (party) leave_party();
	$("#login_page").show();
	$("#play_page").hide();
	$("#my_page").hide();
	$("#settings_page").hide();
	window.location.hash= "login";
}

function show_play_page() {
	$("#login_page").hide();
	$("#play_page").show();
	$("#my_page").hide();
	$("#settings_page").hide();
	window.location.hash= "play";
}

function show_my_page() {
	$("#login_page").hide();
	$("#play_page").hide();
	$("#my_page").show();
	$("#settings_page").hide();
	window.location.hash= "my";
}

function show_settings_page() {
	$("#login_page").hide();
	$("#play_page").hide();
	$("#my_page").hide();
	$("#settings_page").show();
	window.location.hash= "settings";
}

function am_host() {
	amPartyHost= true;
	$("#transfer_host_input").attr("placeholder", "Transfer host priveleges to...");
	$("#transfer_host_input").attr("disabled", false);
	$("#transfer_host_button").attr("disabled", false);
	// $("#transfer_host_button").click(function() {transfer_host($("#transfer_host_input"))})
	party.child("currentlyPlaying").once('value', function(data) {
		loadCurrentlyPlaying(data);
	})
}

function am_not_host() {
	amPartyHost= false;
	$("#transfer_host_input").attr("placeholder", "You cannot transfer host privileges");
	$("#transfer_host_input").attr("disabled", true);
	$("#transfer_host_button").attr("disabled", true);
    player.pauseVideo();
}

function leave_party() {
	var name= myName;
	guestList.transaction(function(guest_list) {
		return removeNode(guest_list, guest_list[name]);
	}).then(function(data) {
		var partySize= data.snapshot.numChildren();  //shut down party if empty
		if (partySize===0) {
			party.remove();
		}

		$("#list_my_songs").html("")
		$("#list_next_songs").html("")
		player.loadVideoById(null);

		myPlaylist.off('value');
		guestList.off('value');

		party= null;
		guestList= null;
		myName= null;
		myStuff= null;
		myPlaylist= null;

		noSongPlaying= true;

		// show_login_page();
	})
}

function track_html_listing_header(moveable) {
	var tr= jQuery('<tr/>');
	if (moveable) {
		jQuery('<th/>', {
			text: ""
		}).appendTo(tr);
	}
	$.each(["Title", "Artist", ""], function(index, header) {
		jQuery('<th/>', {
			text: header
		}).appendTo(tr);
	});

	return tr.prop("outerHTML");
}

function track_html_listing(track, add_or_remove, odd, moveable) {
	var trackTr= jQuery('<tr/>');
	// if (odd) trackTr.addClass("w3-white");

	func= "add";
	if (add_or_remove=="-") func= "remove";

	var moveableIconTd= jQuery('<td/>', {
		class: "moveThis"
	}).append(jQuery('<span/>', {
		class: "ui-icon ui-icon-grip-dotted-vertical",
		text: "hi"
	}));
	// var moveableIcon= jQuery('<span/>', {
	// 	class: "ui-icon ui-icon-grip-dotted-vertical"
	// });
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

	if (moveable) {
		moveableIconTd.appendTo(trackTr);
		// moveableIcon.prependTo(trackNameTd);
	}
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

function html_table(bodyHead, bodyRows) {
	return "<thead>"+bodyHead+"</thead><tbody>"+bodyRows+"</tbody>"
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
				am_not_host();
			}

			//update my playlist
			myPlaylist.on('value', function(data) {
				var tracks= data.val();
				list_html= [];

				var currentTrack= findHead(tracks);
				var odd= 0;
				while (currentTrack!=null) {
					list_html.push(track_html_listing(currentTrack, "-", 1-(++odd)===0, true));
					var nextTrackName= currentTrack.next;
					currentTrack= tracks[nextTrackName];
				}
				
				$("#list_my_tracks").html(html_table(track_html_listing_header(true),list_html.join("\n")));
				$("#list_my_tracks>tbody").sortable({
					handle: ".moveThis",
			        stop: function(event, ui) {
			        	movedTrack= JSON.parse($($(ui.item[0]).find("button")[0]).attr("track"));
			        	newPosition= ui.item.index();
			        	tracks= removeNode(tracks, movedTrack);
			        	tracks= insertNode(tracks, movedTrack, newPosition);
			            myStuff.update({playlist: tracks});
				    }
				});
			})

			//listen to guest or playlist changes
			guestList.on('value', function(data) {

				var guest_list= data.val();
				var headGuest= findHead(guest_list);

				//populate next up
				var nextUpTrack= null;
				var nextInLine= null;
				var list_html= [];
				var odd= 0;
				currentGuest= headGuest;
				while (currentGuest!=null) {
					var nextTrack= findHead(currentGuest.playlist);
					if (nextTrack) {
						if (list_html.length==0) {
							nextUpTrack= nextTrack;
							nextInLine= currentGuest.id;

							party.update({nextUp: nextTrack.id, nextInLine: nextInLine}).then(function(data) {
								if (noSongPlaying || player.getPlayerState()==YT.PlayerState.ENDED) {
									noSongPlaying= false;

									var currentlyPlaying= null;
									party.child("currentlyPlaying").once('value', function(data) {
										if (data) {
											currentlyPlaying= data.val();
										}
									}).then(function(data) {
										if (currentlyPlaying) {
											loadSpecificTrack(data.val());
										} else if (amPartyHost) {
											loadNextSong();
										}
									})
								}
							});
						}
						list_html.push(track_html_listing(nextTrack, null, 1-(++odd)===0, false));
					}
					var nextGuestName= currentGuest.next;
					currentGuest= guest_list[nextGuestName];
				}
				if (!nextUpTrack) {
					party.update({nextUp: null});
					// noSongPlaying= true;
				}
				$("#list_next_tracks").html(html_table(track_html_listing_header(false), list_html.join("\n"), false));
			})

			//listen for next up change (non host)
			party.child("currentlyPlaying").on('value', function(data) {
				loadCurrentlyPlaying(data);
			})

			//listen for host
			party.child("host").on('value', function(data) {
				if (data && data.val()) {
					if (data.val()==myName) {
						am_host();
					} else {
						am_not_host();
					}
				}
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
			// console.log(data);

			var songAndArtists= [];
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
				var rowElement= track_html_listing(newTrack, "+", (index+1)%2===1, false)

				var songAndArtist= trackName + artists;
				if (songAndArtists.indexOf(songAndArtist)===-1) {  //if track name and artist is not already added
					html.push(rowElement);
					songAndArtists.push(songAndArtist);
				}
			});

			$("#search_results").html(html_table(track_html_listing_header(false), html));
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
		if (cycleGuests) {
			var guest_list= guestListRef.snapshot.val();
			var nextInLine= null;
			party.once('value', function(partyRef) {
				party_obj= partyRef.val()
				nextInLine= party_obj.nextInLine;
			}).then(function(partyRef) {
			    party.update({guestList: cycleNodes(guest_list, nextInLine)});
			})
		}
	});
}






























