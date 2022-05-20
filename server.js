import express from 'express';
import session from 'express-session';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;
const saltRounds = 10;

app.set('views', './views');
app.set('view engine', 'ejs');


const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
const db = client.db('bank');
const accountsCollection = db.collection('accounts');

app.use(express.json());
app.use(express.static('public'))

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret',
  cookie: {
    maxAge: 60 * 60 * 1000 // 5 minutes
  }
}));


//pages

app.get('/', (req, res) =>{
	res.redirect('/pages/index.html')
})


//Get all accounts
app.get('/api/profile', async (req, res) => {
	let userSession = req.session.user;
	if(userSession === undefined){
	 res.status(401).json({ error: 'Unauthorized. Please register!' });
	}else{
	 const user = await accountsCollection.findOne({ _id: ObjectId(userSession._id) });
	 res.status(200).json(user);
	 console.log(user);
	 console.log(userSession)
	}

})

//Create a new account
app.post('/api/account', async (req, res) =>{
	let userSession = req.session.user;
	if(userSession === undefined){
	 res.status(401).json({ error: 'Unauthorized. Please register!' });
	}else{
		let result = await accountsCollection.updateOne({_id: ObjectId(userSession._id)}, {$push:{
			accounts: {	
					type:req.body.type,
					number: ObjectId().toString(),
					name: req.body.name,
					amount: req.body.amount
				}	
		}})
		console.log(result)
		res.status(200).send();
	}
});

//Delete an account
app.delete('/api/account/:number', async (req, res)=>{
	let userSession = req.session.user;
	if(userSession === undefined){
	 res.status(401).json({ error: 'Unauthorized. Please register!' });
	}else{
	let result = await accountsCollection.updateOne({_id:ObjectId(userSession._id)},{$pull:{accounts:{number:req.params.number}}});
	console.log(result);
	res.status(200).send();
	}
});
//edit money and remove money
app.post('/api/transaction', async(req, res)=>{
	let userSession = req.session.user;
	if(userSession === undefined){
	 res.status(401).json({ error: 'Unauthorized. Please register!' });
	}else{
	 const projection = {accounts: {$elemMatch: {number: req.body.number}}, _id: 0};
	 const result = await accountsCollection.findOne({_id:ObjectId(userSession._id)}, {projection: projection});
	 if(result===null){
	 res.status(404).json({ error: 'This user does not exist!' });
	 console.log('This user does not exist!');
	 return;
	 }

	 if(result.accounts === undefined || result.accounts.length === 0){
	 res.status(404).json({ error: 'This account does not exist for current user!' });
	 console.log('This account does not exist for current user!');
	 console.log(result.accounts.length)
	 return;
	 }


	let account = result.accounts[0];

	let reqAmount = +req.body.amount;
	let sum = +account.amount + reqAmount;
console.log(reqAmount)
console.log(account.amount)
console.log(sum)
	if(sum<0){
	 res.status(403).json({ error: 'Insufficient amount' });
	 return;
	}
	await accountsCollection.updateOne({_id:ObjectId(userSession._id), "accounts.number": account.number},{$set:{"accounts.$.amount": sum}});

	res.status(200).send();
	}

})


//Login
app.post('/api/login', async (req, res) => {
	console.log(req.body)
	const { password, login} = req.body;
	console.log(password, login);
    const user = await accountsCollection.findOne({ login: login });
	console.log(user)


	if(user!==null){
	const passMatches = await bcrypt.compare(password, user.password);
		if(!passMatches){
		res.status(401).json({error:'Please enter a valid password!'})
		console.log('Please enter a valid password!')
		}else{
			req.session.user = user;   
     		res.status(200).json({user: user});
			console.log('Welcome!')
		}
	}else{
		res.status(401).json({ error: 'There is no such user! Please register!' });
		console.log('There is no such user! Please register!')
	}
  });

//Loggedin
app.get('/api/loggedin', (req, res) => {
  if (req.session.user) {
    res.json({
      user: req.session.user
    });
  } else { 
    res.status(401).json({ error: 'Unauthorized' });
  }
});


  //Log out
	app.get('/api/logout', (req, res) => {
		req.session.destroy(() => {
			res.json({
			loggedin: false
			});
		});
});


//Registration
app.post('/api/register', async (req, res) => {
  const {login} = req.body; 
  console.log(req.body)
  const user = await accountsCollection.findOne({ login: login });
  console.log(user)

  if(user){
   res.status(401).json({error: "This user is already exists!"})
  }else{
   const hash = await bcrypt.hash(req.body.password, saltRounds);
	await accountsCollection.insertOne({
		    login: req.body.login,
			password: hash,
			accounts:[
				{	
					type:req.body.type,
					number: ObjectId().toString(),
					name: 'My account',
					amount: 0
				}			
			]
	});
	const user = await accountsCollection.findOne({ login: login });
	console.log(ObjectId().toString())
	req.session.user = user;  
	res.status(200).json({success: true, user: req.body.user});
  }
}
);



app.use((req, res) => {
res.status(404).render('404', {
title:'404'
})
})


app.listen(port, () => console.log(`Listening on port ${port}`));



