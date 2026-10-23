import express from 'express';
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors());

// Authenticated route

app.post("/auth/sign-up", async(req, res)=>{
    try {
        const {username, email, password} = await req.body;

        
        

    } catch (error) {
        
    }
    

})





app.listen(3000);
