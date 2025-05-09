const User = require('../models/User');

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "EMAIL ALREADY IN USE" });
        }

        const newUser = new User({ name, email: email.toLowerCase(), password });
        await newUser.save();
        res.status(201).json({ message: "USER REGISTERED SUCCESSFULLY" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (!userExists) {
            return res.status(400).json({ message: "THE USER DOES NOT EXIST" });
        }

        const isMatch = await userExists.matchPassword(password);
        if (isMatch) {
            return res.status(201).json({ message: "PASSWORD MATCHES! USER LOGGED IN SUCCESSFULLY" });
        }

        res.status(400).json({ message: "PASSWORD DOES NOT MATCH" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
