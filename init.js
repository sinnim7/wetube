// init.js에는 app.js에서 import한 application을 둠.\
import dotenv from "dotenv";
import "./db";
import app from "./app";
import "./models/Video";
import "./models/Board";
import "./models/Comment";
import "./models/User";

dotenv.config();

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
