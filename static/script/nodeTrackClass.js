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

	if (position==="start" || position==="beginning" || position===0) {
		var headNode= findHead(linkedList);
		node.previous= null;
		headNode.previous= node.id;
		node.next= headNode.id;
	} else if (position==="end" || position===(Object.keys(linkedList).length)) {
		var endNode= findTail(linkedList);
		node.next= null;
		endNode.next= node.id;
		node.previous= endNode.id;
	} else {
		var currentNode= findHead(linkedList);
		var index= 0;
		while (++index<position) {
			currentNode= linkedList[currentNode.next];
		}
		linkedList[currentNode.next].previous= node.id;
		node.next= currentNode.next;
		node.previous= currentNode.id;
		currentNode.next= node.id;
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
			delete linkedList[node.id];
			// linkedList[node.id]= null;
			break;
		}
		currentNode= linkedList[currentNode.next];
	}
	return linkedList;
}

function cycleNodes(linkedList, nextUp) {
	if (Object.keys(linkedList).length > 1) {
		do {
			var head= findHead(linkedList);
			var tail= findTail(linkedList);
			linkedList[head.next].previous= null;
			linkedList[head.id].next= null;
			linkedList[head.id].previous= tail.id;
			linkedList[tail.id].next= head.id;
			if (nextUp==null) break;
		} while (head.id!=nextUp)
	}
	return linkedList;
}

// function changePosition(linkedList, fromPos, toPos) {
// 	removeNode(fromPos);
// 	insertNode
// }
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