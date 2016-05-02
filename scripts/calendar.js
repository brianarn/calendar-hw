(function calendar() {

	'use strict';

	var HOURS_PER_DAY = 12, //number of hours in a calendar day
		START_TIME = 9, //start of the calendar day
		START_OF_DAY = new Date().setHours(START_TIME, 0, 0, 0);

	/**
	 * Returns a negative Number if CalendarEvent 'a' should be rendered before CalendarEvent 'b' in the DOM
	 *
	 * @param CalendarEvent a
	 * @param CalendarEvent b
	 */
	function sortByEarliestEvent(a, b) {
		var delta = a.starts_at - b.starts_at;
		if (delta === 0) {
			//if two events begin at the same time, show the shorter event first
			return a.duration - b.duration;
		}

		return delta;
	}

	/**
	 * Returns a boolean of whether CalendarEvent 'a' overlaps in time with CalendarEvent 'b'
	 *
	 * @param CalendarEvent a
	 * @param CalendarEvent b
	 */
	function eventsOverlap(a, b) {
		return a === b ||
			(a.starts_at >= b.starts_at && a.starts_at < (b.starts_at + b.duration)) ||
			(b.starts_at >= a.starts_at && b.starts_at < (a.starts_at + a.duration));
	}

	/**
	 * Returns all CalendarEvents that are concurrent to a given CalendarEvent 'e'
	 * Concurrent is defined as any CalendarEvent that overlaps in time with 'e' OR...
	 * any event that overlaps in time with an event that overlaps in time with 'e'
	 *
	 * NOTE: This method returns the events (including the given event) in the order they
	 *       are to be rendered into the DOM
	 *
	 * @param CalendarEvent e
	 * @param Array<CalendarEvent> allEvents
	 */
	function getConcurrentEvents(e, allEvents) {
		var concurrent = [],
			notConcurrent = [],
			adjacentConcurrent, j;

		//get the concurrent events to e
		allEvents.forEach(function(thisE) {
			if (eventsOverlap(e, thisE)) {
				concurrent.push(thisE);
			} else {
				notConcurrent.push(thisE);
			}
		});

		//now check all concurrent nodes for THEIR concurrent nodes until there are no matches
		adjacentConcurrent = concurrent;
		while (adjacentConcurrent.length) {
			adjacentConcurrent.forEach(function(conncurrentE, i) {
				if (i === 0) {
					adjacentConcurrent = [];
				}
				j = notConcurrent.length;
				while (j--) {
					if (eventsOverlap(conncurrentE, notConcurrent[j])) {
						adjacentConcurrent.push(notConcurrent.splice(j, 1)[0]);
					}
				}
			});
			concurrent = concurrent.concat(adjacentConcurrent);
		}

		//return the nodes sorted
		return concurrent.sort(sortByEarliestEvent);
	}

	/**
	 * Returns whether a given CalendarEvent 'e' is renderable
	 * Intended to be used with `filter` on an array of events.
	 *
	 * @param CalendarEvent e
	 */
	function removeBadData(e) {
		e.duration = Math.max(0, e.duration);

		//only show events that occur during the calendar hours
		return e.starts_at + e.duration > 0 && e.starts_at <= (HOURS_PER_DAY * 60);
	}

	/**
	 * Convenience method that returns 'AM' or 'PM' depending on the 'hour' passed in
	 *
	 * @param Integer hour
	 */
	function getAMPM(hour) {
		return hour >= 12 ? 'PM' : 'AM';
	}

	/**
	 * Returns a string in the form of "3:25 PM" or "3 PM" or "11:08 AM"
	 * 'time' is the number of minutes from the START_OF_DAY
	 *
	 * @param Integer time
	 */
	function getTimeStr(time) {
		var d = new Date(START_OF_DAY + (time * 1000 * 60)),
			hours = d.getHours(),
			mins = d.getMinutes(),
			amPM = getAMPM(hours);

		hours = hours > 12 ? hours - 12 : hours || 12;
		mins = mins ? ':' + (mins < 10 ? '0' + mins : mins) : '';

		return hours + mins + ' ' + amPM;
	}

	// TODO: Implement renderEvents
	window.renderEvents = function (events) {
		alert('TODO not yet complete');
	};
}());
