// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(feathers.socketio(socket));
// Use localStorage to store our login token
client.configure(feathers.authentication({
  storage: window.localStorage
}));

// Login screen
const loginHTML = `<main class="login container">
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet text-center heading">
      <h1 class="font-100">Log in or signup</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
      <form class="form">
        <fieldset>
          <input class="block" type="email" name="email" placeholder="email">
        </fieldset>

        <fieldset>
          <input class="block" type="password" name="password" placeholder="password">
        </fieldset>

        <button type="button" id="login" class="button button-primary block signup">
          Log in
        </button>

        <button type="button" id="signup" class="button button-primary block signup">
          Sign up and log in
        </button>
      </form>
    </div>
  </div>
</main>`;

// Show the login page
const showLogin = (error = {}) => {
  if(document.querySelectorAll('.login').length) {
    document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p>There was an error: ${error.message}</p>`);
  } else {
    document.getElementById('app').innerHTML = loginHTML;
  }
};

// Retrieve email/password object from the login/signup page
const getCredentials = () => {
  const user = {
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  };

  return user;
};

// Log in either using the given email/password or the token from storage
const login = async credentials => {
  try {
    if(!credentials) {
      // Try to authenticate using the JWT from localStorage
      await client.authenticate();
    } else {
      // If we get login information, add the strategy we want to use for login
      const payload = Object.assign({ strategy: 'local' }, credentials);

      await client.authenticate(payload);
    }

    // If successful, show the dashboard
    console.log('show Dashboard');
    document.getElementById('app').innerHTML = '<button type="button" id="logout" class="button button-primary block signup">Logout</button>';

  } catch(error) {
    // If we got an error, show the login page
    showLogin(error);
  }
};

document.addEventListener('click', async ev => {
  switch(ev.target.id) {
  case 'signup': {
    // For signup, create a new user and then log them in
    const credentials = getCredentials();

    // First create the user
    await client.service('people').create(credentials);
    // If successful log them in
    await login(credentials);

    break;
  }
  case 'login': {
    const user = getCredentials();

    await login(user);

    break;
  }
  case 'logout': {
    await client.logout();

    document.getElementById('app').innerHTML = loginHTML;

    break;
  }
  }
});

// We will also see when new users get created in real-time
client.service('users').on('created', console.log('new registration'));

login();