//account
let account_name = document.querySelector('.account_name');
let account_type = document.querySelector('.account_type');
let account_balance =  document.querySelector('.account_balance');
let deleteAccountBtn = document.getElementById('deleteAccountBtn');
let addMoney = document.getElementById('addMoney');
let withdrawMoney = document.getElementById('withdrawMoney');
 let errorTransaction = document.querySelector('.error-transaction');
//get account
let getProfile = async() => {
	let response = await fetch('/api/profile');
	let profile = await response.json();
	console.log('profilewwww')
	console.log(profile)
		if(response.status === 200){
		const urlParams = new URLSearchParams(location.search);
    	const number = urlParams.get('account');
		return profile.accounts.find(account => account.number === number)
	}else{
		window.location.href = "/pages/login.html";
	}

}

async function data(){
profile = await getProfile();
account_name.innerHTML = profile.name;
account_type.innerHTML = profile.type;
account_balance.innerHTML = profile.amount;


deleteAccountBtn.addEventListener('click', async () =>{
removeAccount(profile.number);
window.location.href = "/pages/user.html";
})
}
data()


//delete account
async function removeAccount(number){
await fetch(`/api/account/${number}`, {
    method: 'DELETE'
  });
}


//add money
let addMoneyForm =  document.getElementById('addMoneyForm');
addMoneyForm.addEventListener('submit', async (e) => {
e.preventDefault();
let updatedBalance = parseInt(addMoney.value);
console.log('updatedBalance')
console.log(updatedBalance)
let response = await fetch('/api/transaction', {
	method: 'POST',
	headers: {
        'Content-Type': 'application/json'
    },
	body: JSON.stringify({
		number: profile.number,
		amount: updatedBalance
	})
});
location.reload();
console.log(response)
})

//withdraw money
let withdrawMoneyForm =  document.getElementById('withdrawMoneyForm');
withdrawMoneyForm.addEventListener('submit', async (e) => {
e.preventDefault();
let updatedBalance = -parseInt(withdrawMoney.value);
console.log('withdraw');
console.log(updatedBalance)
if(profile.amount<=0){
 console.log(profile.amount)
 errorTransaction.innerHTML = 'You do not have enough money!';
 return;
}
if(profile.amount < parseInt(withdrawMoney.value)){
 errorTransaction.innerHTML = 'You do not have enough money!';
 return;
}
console.log('updatedBalance')
console.log(updatedBalance)
let response = await fetch('/api/transaction', {
	method: 'POST',
	headers: {
        'Content-Type': 'application/json'
    },
	body: JSON.stringify({
		number: profile.number,
		amount: updatedBalance
	})
});
location.reload();
console.log(response)
})


