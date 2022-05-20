//register
let registerForm = document.getElementById('registerForm');
let reglogin =  document.getElementById('reglogin');
let regpassword =  document.getElementById('regpassword');
let regtype =  document.getElementById('regtype');
let errorMessageText = document.querySelector('.error-message');


//registration
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if(reglogin.value==="" || regpassword.value ===""){
   errorMessageText.innerHTML =`<strong>Please fill all the fields!</strong>`;
   return;
  }

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login: reglogin.value,
      password: regpassword.value,
	  type:regtype.value
    })
  });
  console.log(response.body.type);
  if(response.status===200){
    window.location.href = "/pages/user.html";
  }else{
  	let errorMessage = (await response.json()).error;
	errorMessageText.innerHTML =`<strong>${errorMessage}</strong>`;
  }
});