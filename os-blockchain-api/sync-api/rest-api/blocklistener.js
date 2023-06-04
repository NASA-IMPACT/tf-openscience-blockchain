
// Starts a Fabric event hub listener to listen for new blocks
// Starts a websocket server to push notifications when new blocks arrive

'use strict';

var { get_channel } = require("./utils");

var startBlockListener = async function(channelName, username, orgName, websocketServer) {
	try {
		// first setup the client for this org
		var channel = await get_channel(channelName, username, orgName)

		// Register a block listener. 
		//
		// This will return a list of channel event hubs when using a connection profile, 
		// based on the current organization defined in the currently active client section 
		// of the connection profile. Peers defined in the organization that have the eventSource 
		// set to true will be added to the list.
		let eventHubs = channel.getChannelEventHubsForOrg();

		eventHubs.forEach((eh) => {
			eh.registerBlockEvent((block) => {
				var blockMsg = {
					blockNumber: block.header.number,
					txCount: block.data.data.length,
					txInBlock: []
				}
				let txCount = 0;
				block.data.data.forEach((tx) => {
					blockMsg['txInBlock'][txCount] = tx.payload.header.channel_header.tx_id;
					txCount++;
				})
				// Broadcast the new block to all websocket listeners
				websocketServer.broadcast = async function broadcast(msg) {
					websocketServer.clients.forEach(function each(client) {
						if (client.readyState === 1) {
							client.send(JSON.stringify(msg));
					  	}
					});
				};
				websocketServer.broadcast(blockMsg);
			}, (error)=> {
			});
			eh.connect(true);
		})

	} catch (error) {
		let error_message = error.toString();
	}
}

exports.startBlockListener = startBlockListener;
