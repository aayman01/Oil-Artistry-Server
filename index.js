const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middle milware
app.use(cors());
app.use(express.json());


app.get('/',(req, res) => {
    res.send("OilArtistry server is running...");
})


app.listen(port,()=>{
    console.log(`My server is running on ${port}`)
})