import express from "express";
const app = express();
import cors from "cors";
const PORT = process.env.PORT || 5000;

import dataroutes from "./routes/dataroutes.js"

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.use('/data',dataroutes)


app.listen(PORT,()=>{
    console.log(`My server is running on PORT${PORT}`)
})

