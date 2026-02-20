import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- RUTA PRINCIPAL ---------- */
app.post("/api/chat", async (req,res)=>{
 try{
  const mensaje = req.body.mensaje;

  if(!mensaje){
   return res.status(400).json({
    ok:false,
    error:"Mensaje requerido"
   });
  }

  const respuesta = await fetch("https://api.openai.com/v1/chat/completions",{
   method:"POST",
   headers:{
    "Content-Type":"application/json",
    "Authorization":"Bearer "+process.env.OPENAI_KEY
   },
   body:JSON.stringify({
    model:"gpt-4.1-mini",
    messages:[
     {role:"system",content:"Eres un asistente experto en biología molecular."},
     {role:"user",content:mensaje}
    ]
   })
  });

  const data = await respuesta.json();

  res.json({
   ok:true,
   pregunta:mensaje,
   respuesta:data.choices[0].message.content
  });

 }catch(err){
  res.status(500).json({
   ok:false,
   error:"Error del servidor",
   detalle:err.message
  });
 }
});

/* ---------- STATUS ---------- */
app.get("/api/status",(req,res)=>{
 res.json({
  ok:true,
  servicio:"Chatbot API",
  estado:"activo"
 });
});

app.listen(process.env.PORT,()=>{
 console.log("Servidor activo en puerto "+process.env.PORT);
});