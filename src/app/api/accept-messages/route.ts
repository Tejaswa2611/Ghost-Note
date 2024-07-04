// POST funtion to toggle between isAcceptionMessages
// get session , then get user from session
// if not found session or user, then return false,not authenticated msg, status 401
// get acceptingMessages from request body
// find byIdandUpdate user with acceptingMessages,
// if not found updated user, return false with 401 else return true with 200

// GET function to get isAcceptingMessages status
// get user's id like previoius and in return give status of user's acceptingMessages



import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export async function POST(request: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    const { isAcceptingMessages } = await request.json();
    const userId = user._id;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: isAcceptingMessages },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found for updating isAccepingMessage status"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "User's accepting message status updated successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("Error in updating user's accepting message status", error)
        return Response.json({
            success: false,
            message: "Error in updating user's accepting message status"
        }, { status: 500 })

    }
}

export async function GET(request: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(
            userId,
        );
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 }
        )
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error in getting user's accepting message status"
        }, { status: 500 }
        )

    }
}