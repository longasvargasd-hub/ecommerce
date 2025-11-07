import mongoose from "mongoose";
const userShema =new mongoose.Schema({
    nombre:{type:String,required:true},
    apellido:{type:String,required:true},
    telefono:{type:Number,required:true,minlength:12},
    correo:{type:String,required:true},
    password:{type:String,required:true,minlength:10}
});
// forzamos para que me guarde la informacion en la coleccion de usuario //
const user=mongoose.model("user",userShema,"user");
export default user;