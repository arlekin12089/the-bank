

let addAccountForm =  document.getElementById('addAccountForm');
let accountUpdatedName = document.getElementById('accountUpdatedName');
let accountUpdatedType =  document.getElementById('accountUpdatedType');
let accountUpdatedAmount = document.getElementById('accountUpdatedAmount');

//create account
addAccountForm.addEventListener('submit', async (e) =>{
e.preventDefault();
let response = await fetch('/api/account', {
	method: 'POST',
	headers: {
      'Content-type': 'application/json'
    }, 
	body: JSON.stringify({
      type: accountUpdatedType.value,
      name: accountUpdatedName.value,
	  amount:accountUpdatedAmount.value
    })
})
console.log(response)
window.location.href = "/pages/user.html";
})