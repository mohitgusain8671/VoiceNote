import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 5,
        maxLength: 255,
        match: [/\S+@\S+\.\S+/,'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true,'Password is Required'], 
        minLength: 6,
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

const User = mongoose.model('User', userSchema);

export default User;