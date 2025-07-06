// take user from session(get Server session) and obtain its id from new mongoose.Types.ObjectId(user._id)
// aggregation pipeline- get user from id, unwind messages, sort messages by createdAt, group messages by id


import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await connectDB();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "User not authenticated"
        }, { status: 401 })
    }
    
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const userWithMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            { $sort: { "messages.createdOn": -1 } },
            { $group: { 
                _id: "$_id", 
                messages: { $push: "$messages" },
                username: { $first: "$username" },
                email: { $first: "$email" },
                isAcceptingMessages: { $first: "$isAcceptingMessages" }
            }},
        ]);

        if (!userWithMessages || userWithMessages.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        // Filter out null messages (from preserveNullAndEmptyArrays)
        const messages = userWithMessages[0].messages.filter((msg: any) => msg !== null);

        return Response.json({
            success: true,
            messages: messages
        }, { status: 200 })
    } catch (error) {
        console.error("Error fetching messages", error);
        return Response.json({
            success: false,
            message: "Error fetching messages"
        }, { status: 500 })
    }
}