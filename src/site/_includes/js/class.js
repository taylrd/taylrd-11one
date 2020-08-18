const button1 = document.getElementById('left');
const button2 = document.getElementById('right');

const login = () => netlifyIdentity.open('login');
const signup = () => netlifyIdentity.open('signup');

// by default, add login and signup functionality
button1.addEventListener('click', login);
button2.addEventListener('click', signup);

const updateUserInfo = (user) => {
	const container = document.querySelector('.user-info');

	//cloning the buttons removes existing event listeners
	const b1 = button1.cloneNode(true);
	const b2 = button2.cloneNode(true);

	//empty the user info div
	container.innerHTML = '';

	if (user) {
		b1.innerText = 'Log Out';
		b1.addEventListener('click', () => {
			netlifyIdentity.logout();
		});

		b2.innerText = 'Manage Subscription';
		b2.addEventListener('click', () => {
			//TODO handle subscription managment
		});
	} else {
		//if no one is logged in, show login/signup options
		b1.innerText = 'Log In';
		b1.addEventListener('click', login);

		b2.innerText = 'Sign Up';
		b2.addEventListener('click', signup);
	}

	//add the updated buttons back to the user info div
	container.appendChild(b1);
	container.appendChild(b2);
};

const loadSubscriptionContent = async (user) => {
	const token = user ? await netlifyIdentity.currentUser().jwt(true) : false;

	[ 'free', 'pro', 'premium' ].forEach((type) => {
		fetch('/.netlify/functions/get-protected-content', {
			method  : 'POST',
			headers : {
				Authorization : `Bearer ${token}`
			},
			body    : JSON.stringify({ type })
		})
			.then((res) => res.json())
			.then((data) => {
				const template = document.querySelector('#content');
				const container = document.querySelector(`.${type}`);

				//remove any existing content from the content containers
				const oldContent = container.querySelector('.content-display');
				if (oldContent) {
					container.removeChild(oldContent);
				}

				const content = template.content.cloneNode(true);

				const img = content.querySelector('img');
				img.src = data.src;
				img.alt = data.alt;

				const credit = content.querySelector('.credit');
				credit.href = data.creditlink;

				const caption = content.querySelector('figcaption');
				caption.innerHTML = data.message;
				caption.appendChild(credit);

				container.appendChild(content);
			});
	});
};

const handleUserStateChange = (user) => {
	updateUserInfo(user);
	loadSubscriptionContent(user);
};

netlifyIdentity.on('init', handleUserStateChange);
netlifyIdentity.on('login', handleUserStateChange);
netlifyIdentity.on('logout', handleUserStateChange);
