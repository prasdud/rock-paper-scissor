const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Dummy route (just for placeholder)
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const userExists = await User.findOne( {email} );

        if (userExists) {
            return res.status(400).json({ message: "EMAIL ALREADY IN USE" });
        }
        
        // new user
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password  
        });

        // saves and hashes inside the model itself
        await newUser.save();

        // success
        res.status(201).json({message: "USER REGISTERED SUCCESSFULLY"});


    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }

});


router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const userExists = await User.findOne( {email} );

        if (!userExists) {
            return res.status(400).json({ message: "THE USER DOES NOT EXIST" });
        }


        const isMatch = await userExists.matchPassword(password);

        if (isMatch == true){
            return res.status(201).json({message: "PASSWORD MATCHES! USER LOGGED IN SUCCESSFULLY"});
        }

        return res.status(400).json({ message: "PASSWORD DOES NOT MATCH" });


    } catch (error) {
        res.status(500).json({message: "Server Error", error: error.message});
    }
    
});
module.exports = router;
