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
    if (!session || !user || user.length === 0) {
        return Response.json({
            success: false,
            message: "User not found"
        }, { status: 401 })
    }
    const userId = mongoose.Types.ObjectId.createFromHexString(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: 'id', messages: { $push: '$messages' } } },
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })

        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })
    } catch (error) {
        console.error("Error fetching messages", error);
        return Response.json({
            success: false,
            message: "Error fetching messages"
        }, { status: 500 })
    }
}