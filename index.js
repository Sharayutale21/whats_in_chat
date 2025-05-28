const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');	
const Chat = require('./models/chat.js');
const methodOverride = require('method-override'); //ye method override karega put aur delete request ko

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true})); //ye data ko parse karega jo form se aa raha hai(create route me use hoga)
app.use(methodOverride('_method')); //ye method override karega put aur delete request ko


main()
.then(()=>
	console.log("connection successful")
)
.catch(err => 
	console.log(err)
);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

//let chat1 = new Chat({
//	from : "John",
//	to : "Doe",
//	msg : "Hello, how are you?",
//	created_at : new Date()	
//})
//chat1.save()
//.then((res)=>{
//	console.log(res)
//})

app.get("/",(req,res)=>{
	res.send("root is working")
})

//index route
app.get("/chats",async (req,res)=>{ //kyuki  ye data ko db se laega to ye await karega , ye await krega  toh async use karna padega  
	let chats = await Chat.find();
	res.render("index.ejs",{chats})
})

//new route
app.get("/chats/new",(req,res)=>{
	res.render("new.ejs")
})

//create route
app.post("/chats",(req,res)=>{
	let {from , to , msg} =req.body; //ye data directly nhi aata ise parse karna padta hai
	let newChat = new Chat({
		from : from,
		to : to,
		msg : msg,
		created_at : new Date()
	})
	
	newChat.save().then(res=>{ //this is aloso an async function but as here we are not using await so we can use .then() and .catch() to handle the promise
		console.log("chat was saved")
	}).catch(err=>{
		console.log(err);
	})
	res.redirect("/chats") //ye redirect karega index route pe jo ki chats ko show karega
})

//edit route
app.get("/chats/:id/edit",async (req,res)=>{
	let {id} = req.params; //ye id ko params se lega jo ki url me hoga
	let chat = await Chat.findById(id); //ye chat ko db se lega id ke through
	console.log(chat);
	res.render("edit.ejs",{chat}) //ye chat ko render karega edit.ejs me
})

//update route
app.put("/chats/:id",async (req,res)=>{
	let {id}= req.params;
	let { msg : newMsg} =req.body; //ye data directly nhi aata ise parse karna padta hai
	let updatedMsg = await Chat.findByIdAndUpdate(id , {msg : newMsg} , {new : true} , {runValidators:true}) //ye chat ko db se lega id ke through aur msg ko update karega
	console.log(updatedMsg);
	res.redirect("/chats") //ye redirect karega index route pe jo ki chats ko show karega
})


//destroy route
app.delete("/chats/:id",async (req,res)=>{
	let {id} = req.params; //ye id ko params se lega jo ki url me hoga
	let deletedChat = await Chat.findByIdAndDelete(id); //ye chat ko db se delete karega id ke through
	console.log(deletedChat); //ye deleted chat ko console karega
	res.redirect("/chats") //ye redirect karega index route pe jo ki chats ko show karega
})


app.listen(8080 , ()=>{
	console.log('Server is running on port 8080');
})