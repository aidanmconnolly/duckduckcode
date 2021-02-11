const username = document.querySelector('#username');
const password = document.querySelector('#password');
const signInButton = document.querySelector('#signIn');
const accountText = document.querySelector('#accountText');

signInButton.addEventListener('click', signIn);

function signIn() {
    accountText.textContent = "Hello " + username.value + ", your password is " + password.value;
}
