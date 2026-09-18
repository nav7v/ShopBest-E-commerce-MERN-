import User from "../models/userSchema.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";



//todos:
//1. Register user
//1.1 encrypt password using bcryptjs
//1.2 save user to database
//1.3 authenticate user using jsonwebtoken
//1.4 OTP sending for verification
//1.5 welcome email sending to user after registration





//1.3 authenticate user using jwt token secret key

const genrateToken = (id) => { 
    return jsonwebtoken.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }


        //1.1 encrypt password using bcryptjs
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        if (user) {

            //1.4 OTP sending for verification
            const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
            // Here you can send the OTP to the user's email using a mail service
            // For example, using nodemailer or any other email service provider

            const message = `
            Welcome to ShopBest,${name}! Your registration was successful.
            Your OTP for registration is: ${otp}`;

            // 1.5 welcome email sending to user after registration 
            await sendEmail(email, "Welcome to ShopBest-Your OTP for registration", message);
            // Implement the sendEmail function to send the email in utils folder
            //the sendMail function has 3 parameters: to, subject, text

            const normalizedUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType || "user",
                role: user.userType || "user",
                token: genrateToken(user._id),
            };

            res.status(201).json(normalizedUser);

        } else { 
            res.status(400).json({ message: "User registration failed" });
        }
    }    
    catch (error) {
        res.status(500).json({ message: "Server error" });
        console.log(error);
    }
 };


//2. Login user
 
const loginUser = async (req, res) => { 

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const normalizedUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType || "user",
                role: user.userType || "user",
                token: genrateToken(user._id),
            };

            res.status(200).json(normalizedUser);
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) { 
        res.status(500).json({ message: "Server error" });
    }

};




//3.Get users

const getUser = async (req, res) => {
    try { 
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { registerUser, loginUser, getUser };