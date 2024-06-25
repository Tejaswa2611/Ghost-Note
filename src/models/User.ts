//user schema 
// email id, password, name,createdOn,isAcceptingMessages,message
import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdOn: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true,
    }
});
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean;
    createdOn: Date;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    verifyCode: {
        type: String,
        required: [true, "Verification code is required."]
    },
    verifyCodeExpires: {
        type: Date,
        required: [true, "Verification code expiration date is required."]
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema));
 // In next Js, it can run multiple times on API calls or page refresh so we need to check if the model is already created or not.

export default UserModel;