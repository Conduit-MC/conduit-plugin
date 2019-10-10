/*
	The only thing this class does is create the `onEventName` plugin API
	To do this it takes advantage of the fact that we can check for class methods on classes which extend this base, in the base class
*/

class ConduitPlugin {
	constructor(server) {
		this.server = server; // Keep reference to the server instance

		// Listen for *any* event the server emits (this includes packets)
		this.server.onAny((eventName, ...values) => {
			const func = this[snake2Camel('on_' + eventName)]; // Grab reference to the handler method
			const beforeFunc = this[snake2Camel('on_before_' + eventName)]; // Grab reference to the before handler method
			const event = new Event(...values); // Create a new Event instance

			// Check if the before handler method exists and run it if so
			if (beforeFunc) {
				beforeFunc.call(this, event);
			}

			// Check if the handler method exists and that the Event has not been cancelled and run it if so
			if (func && !event.isCancelled()) {
				func.call(this, event);
			}
		});
	}
}

/*
	Hack to support any event type without writing out the structure of each event
	To do this it takes advantage of the fact that Node allows us to programatically create class methods
	on a per-instance basis without changing the base or other instances which extend the base
*/

class Event {
	constructor(sender, packet) {
		this._sender = sender; // Store the sending client
		this._packet = packet; // Store the original packet

		// Create new class methods to get the packet specific data
		if (this._packet && this._packet.packet_specific_data) {
			for (const key in this._packet.packet_specific_data) {
				this[snake2Camel('get_' + key)] = function() {
					return this._packet.packet_specific_data[key];
				};
			}
		}
	}

	// Change the events cancelled state
	setCancelled(bool) {
		this.getPacket() ? this._packet.cancelled = bool : null;
	}

	// Get the events cancelled state
	isCancelled() {
		return this.getPacket() ? this._packet.cancelled : null;
	}

	// Get the event sender
	getSender() {
		return this._sender;
	}

	// Get the original packet
	getPacket() {
		return this._packet;
	}
}

module.exports = ConduitPlugin;

// snake_case to camelCase
function snake2Camel(string) {
	return string.replace(/(_\w)/g, matches => matches[1].toUpperCase());
}