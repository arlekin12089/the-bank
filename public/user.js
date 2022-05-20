let accountsInfo =  document.getElementById('accountsInfo');

//get user
let getUser = async() => {
	let response = await fetch('/api/profile');
	let user = await response.json();
	console.log(user);
	if(response.status === 200){
//show name accounts
	 showAccounts(user)
	}else{
		window.location.href = "/pages/login.html";
	}
}


//show user

function showAccounts(user){
	let {login, _id, accounts} = user;
	const accountsTemplate = (accounts) => accounts.map(account=>{
	
		let accountElement = document.createElement('div');
		accountElement.innerHTML = `
		<a href="/pages/account.html?account=${account.number}" class="wrapp-account">
			<ul class="account-info">
				<li><span>Account name:</span> ${account.name}</li>
				<li><span>Account number:</span> ${account.number}</li>
				<li><span>Type of account:</span> ${account.type}</li>
				<li><span>Balance:</span> ${account.amount}</li>
			</ul>
		</a>
		`;
	return accountElement;
	})


	let userBlock = document.createElement('aside');
	userBlock.innerHTML = `
		<ul>
			<li> <span>My login:</span> ${login}</li>
			<li> <span>My ID:</span> ${_id}</li>
			<li class="accounts-elements"> <span>All accounts:</span> </li>
		</ul>
	`;
	//userBlock.getElementsByClassName( "accounts-elements" )[0].appendChild(accountsTemplate(accounts));
	let accountsDiv = userBlock.getElementsByClassName( "accounts-elements" )[0];
	let accountsListDiv = accountsTemplate(accounts);
	if(accounts.length!==0){
		accountsListDiv.forEach( accountDiv =>{
	accountsDiv.appendChild(accountDiv);
	})
	}else{
		let errorMessageAccount =  document.createElement('p');
		errorMessageAccount.className = 'error-accounts';
		errorMessageAccount.innerHTML = "There are no accounts!";
		accountsDiv.appendChild(errorMessageAccount)
	}

	//accountsDiv.appendChild(accountsTemplate(accounts))
	accountsInfo.appendChild(userBlock);
}






getUser();