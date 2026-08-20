import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req,res)=>{

    const {email,password}=req.body;

    const [rows]=await db.query(
        "SELECT * FROM users WHERE email=?",
        [email]
    );

    if(rows.length===0){
        return res.status(401).json({
            message:"Email tidak ditemukan"
        });
    }

    const user=rows[0];

    const match=await bcrypt.compare(password,user.password);

    if(!match){
        return res.status(401).json({
            message:"Password salah"
        });
    }

    const token=jwt.sign(
        {
            id:user.id,
            email:user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
    );

    res.json({
        message:"Login berhasil",
        token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email
        }
    });

}