import exe from "./dbConn.js";
import express from 'express';
import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';

const app = express();
const KEY = "failed in life";
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.get("/register", (req, res)=>{
    res.render("register");
})

const verifyToken = async (req, res, next) => {
    let token = req.cookies.token;
    if (!token) return res.redirect("/login");
    try {
      const result = await exe(`SELECT 1 FROM block_tokens WHERE block_token = ?`,[token]);
    if(result.length > 0) return res.redirect("/login")

        let decoded = jwt.verify(token, KEY);
        req.user = decoded;
        
        next();
    } catch {
        console.log("Token verification failed:", err);
        return res.redirect("/login");
    }
};

app.post("/do_register",async (req, res)=>{
    const d = req.body
    try{
        let result =await exe(`SELECT * FROM user WHERE user_email = '${d.user_email}' OR user_mobile = '${d.user_mobile}'`);
        if(result.length === 0){
            await exe(`INSERT INTO user VALUES (${null}, '${d.user_email}', '${d.user_mobile}', '${d.user_pass}')`)
            res.redirect("login");
        }else{
            res.send("user With This Email Or Phone Already Exist");
        }
    }catch(err){
        console.log('Failed to Register',err)
    }
})

app.get("/login", (req, res)=>{
    res.render("login");
})

app.post("/do_login", async (req, res)=>{
    console.log(req.body);
    try{
        let checkUser = await exe(`SELECT * FROM user WHERE user_email = ? AND user_pass = ?`,[req.body.user_email, req.body.user_pass]);
        if(checkUser.length === 1){
            let token = jwt.sign({"user_email": req.body.user_email}, KEY);

            res.cookie("token", token);
            res.redirect("/")
        }else{
            res.redirect('login');
        }
    }catch(err){
        console.log("Failed To Login", err);
    }
})

app.get("/",verifyToken, (req, res)=>{
    res.render("home", {user: req.user.user_email});
})

app.get("/logout",(req, res)=>{
    res.clearCookie("token");
    console.log("token: ", req.cookies.token);

    exe(`INSERT INTO block_tokens(block_token) VALUES(?)`,[req.cookies.token]);
    res.redirect("/")
})

app.listen(1200);