let loginLink =  document.querySelector('.loginLink');
let logoutLink =  document.querySelector('.logoutLink');
let registerLink = document.querySelector('.registerLink');
let userLink = document.querySelector('.userLink');



//get user
let header = async() => {
	let response = await fetch('/api/loggedin');
	let user = await response.json();
	console.log(user);
	if(response.status === 200){
		loginLink.style.display = 'none';
		registerLink.style.display = 'none';
		logoutLink.style.display = 'block';
		userLink.style.display ='block';
	}else{
		loginLink.style.display = 'block';
		registerLink.style.display = 'block';
		logoutLink.style.display = 'none';
		userLink.style.display ='none';
	}
}

header();



//log out
logoutLink.addEventListener('click', async ()=>{
	const response = await fetch('/api/logout', {
		method: 'GET'
	})
	window.location.href = "/";
})
