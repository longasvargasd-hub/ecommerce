import mongoose from "mongoose";
const url = "mongodb+srv://adsotarde:adso2025@ecommer.xrjl4ul.mongodb.net/tienda?retryWrites=true&w=majority";
mongoose.connect(url)
.then(()=> console.log("✅ conectado a la base de datos"))
.catch(err => console.log ("❌error al conectar la base de datos", err));