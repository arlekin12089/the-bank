//login
let loginFormWrap =  document.getElementById('loginForm');
let login =  document.getElementById('login');
let password =  document.getElementById('password');
let loginBtn = document.getElementById("login_btn");
let errorMessageText = document.querySelector('.error-message');

//login
loginFormWrap.addEventListener('submit', (e) =>{
e.preventDefault();
})

let loginForm = async() =>{
	let response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login: login.value,
      password: password.value
    })
})
console.log(response);
if(response.status === 200){
	window.location.href = "/pages/user.html";
}else{
let errorMessage = (await response.json()).error;
errorMessageText.innerHTML =`<strong>${errorMessage}</strong>`;
}

}

loginBtn.addEventListener("click", async () => {
  await loginForm();
});