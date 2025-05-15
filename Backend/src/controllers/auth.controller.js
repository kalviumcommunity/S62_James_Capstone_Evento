const User = require('../models/user.model')
const jwt = require('jsonwebtoken');


const signUp = async (req, res) => {
    const { username, password, name, email } = req.body;

    if (!username || !password || !name || !email)
        return res.status(400).json({ message: 'All fields are required' });

    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, password, name, email });
        await newUser.save();

        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


const login = async (req,res) =>{
    const {username, password} = req.body;

    try{
        const user = await User.findOne({username});
        if(!user || user.password !== password)
            return res.status(401).json({message: ' Invalid Credentials'})

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'})
        res.status(200).json({token, user:{id:user._id, username: user.username}})
    }catch (error){
        res.status(500).json({error:'Login failed'})
    }
}

module.exports = {signUp, login};