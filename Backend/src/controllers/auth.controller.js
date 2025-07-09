const User = require('../models/user.model')
const jwt = require('jsonwebtoken');


const signUp = async (req, res) => {
    const { fullName,email,university, password } = req.body;

    if (!fullName || !password || !university || !email)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        const existing = await User.findOne({ fullName });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ fullName, email, university, password });
        await newUser.save();

        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const signIn = async (req,res) =>{
    const {fullName, password} = req.body;

    try{
        const user = await User.findOne({fullName});
        if(!user || user.password !== password)
            return res.status(401).json({message: ' Invalid Credentials'})

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'})
        res.status(200).json({token, user:{id:user._id, fullName: user.fullName}})
    }catch (error){
        res.status(500).json({error:'Login failed'})
    }
}

module.exports = {signUp, signIn};