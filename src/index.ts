import app from "./app";
import connectToDatabase from "./database/connectionDatabase";
connectToDatabase().then(done =>  

app.listen(5555)