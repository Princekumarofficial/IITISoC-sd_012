//index.js
import express from "express"; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import router from "./routes/routes";
import connectDB from "./db/db.js";
import router from "./routes/routes.js";
const app = express();

app.use(express.json()); 

app.use(cors({
  origin: true,
  credentials: true
}))
 
app.use(express.json());

app.use(cookieParser());


// app.use(bodyParser.json({extended : true}))

// app.use(bodyParser.urlencoded({extended : true}))

app.use('/api' , router)


const PORT =  8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
connectDB();

