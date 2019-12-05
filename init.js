// init.js에는 app.js에서 import한 application을 둠.
import app from "./app";

const PORT = 4000;

const handleListening = () =>
  console.log(`✅Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
