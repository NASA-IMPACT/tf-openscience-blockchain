'use strict';
var log4js = require('log4js');
var util = require('util');
var hfc = require('fabric-client');
hfc.addConfigFile('config.json');

async function getClientForOrg (userorg, username) {
    let config = './connection_profile/connection-profile.yaml';
    let orgLower = userorg.toLowerCase();
    let clientConfig = './connection_profile/' + orgLower + '/client-' + orgLower + '.yaml';

    // Load the connection profiles. First load the network settings, then load the client specific settings
    let client = hfc.loadFromConfig(config);
    client.loadFromConfig(clientConfig);

	// Create the state store and the crypto store 
	await client.initCredentialStores();

	// Try and obtain the user from persistence if the user has previously been 
	// registered and enrolled
	if(username) {
		let user = await client.getUserContext(username, true);
		if(!user) {
			throw new Error(util.format('##### getClient - User was not found :', username));
		} else {
		}
	}

	return client;
}

var getRegisteredUser = async function(username, userorg, isJson) {
	try {
		var client = await getClientForOrg(userorg);
		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
		} else {
			// user was not enrolled, so we will need an admin user object to register
			var admins = hfc.getConfigSetting('admins');
			let adminUserObj = await client.setUserContext({username: admins[0].username, password: admins[0].secret});
			let caClient = client.getCertificateAuthority();
			let secret = await caClient.register({
				enrollmentID: username
			}, adminUserObj);
			user = await client.setUserContext({username:username, password:secret});
		}
		if(user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + ' enrolled Successfully',
				};
				return response;
			}
		} 
		else {
			throw new Error('##### getRegisteredUser - User was not enrolled ');
		}
	} 
	catch(error) {
		return 'failed '+error.toString();
	}
};

exports.getClientForOrg = getClientForOrg;
exports.getRegisteredUser = getRegisteredUser;
