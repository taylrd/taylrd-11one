const content = {
	free    : {
		src          : '',
		alt          : 'Blue boy behind the Irvine office',
		credit       : 'Brad Taylor',
		creditLink   : '',
		message      :
			'<iframe src="https://player.vimeo.com/video/427173263" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>',
		allowedRoles : [ 'free' ]
	},
	pro     : {
		src          :
			'https://res.cloudinary.com/taylrd/image/upload/v1597607821/Flight-Status-Merle-Male-2-Color-Countrys-Aussies-13_u4netf.jpg?auto=format&fit=crop&w=600&h=600&q=80',
		alt          : 'Blue boy at 4 weeks at breeder',
		credit       : 'Colour Country Aussies',
		creditLink   : '',
		message      : 'This is protected content! It’s only available if you have a pro plan or higher.',
		allowedRoles : [ 'pro' ]
	},
	premium : {
		src          :
			'https://res.cloudinary.com/taylrd/image/upload/v1597607792/3M2A1701_zdkb5n.jpg?auto=format&fit=crop&w=600&h=600&q=80',
		alt          : 'Blue boy in the Irvine office during Nat shipout',
		credit       : 'Sarah Mattlage',
		creditLink   : '',
		message      : 'This is protected content! It’s only available if you have the premium plan.',
		allowedRoles : [ 'premium' ]
	}
};

exports.handler = async (event, context) => {
	const { type } = JSON.parse(event.body);
	const { user } = context.clientContext;
	const roles = user ? user.app_metadata.roles : false;
	const { allowedRoles } = content[type];

	if (!roles || !roles.some((role) => allowedRoles.includes(role))) {
		return {
			statusCode : 402,
			body       : JSON.stringify({
				src     : '/images/player.jpg',
				alt     : 'DanceMakers Digital "subscription required"',
				credit  : 'Zach Thompson',
				message : `This content requires a ${type} subscription`
			})
		};
	}

	return {
		statusCode : 200,
		body       : JSON.stringify(content[type])
	};
};
