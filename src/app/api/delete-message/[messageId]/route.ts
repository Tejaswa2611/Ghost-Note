import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import connectDB from '@/lib/connectDB'
import UserModel from '@/models/User'

export async function DELETE(
    request: NextRequest,
    { params }: { params: { messageId: string } }
) {
    const messageId = params.messageId
    console.log(`🗑️ Delete message API called for messageId: ${messageId}`)
    await connectDB()

    try {
        // Get the user session
        const session = await getServerSession(authOptions)
        console.log(`🔐 Session check - User: ${session?.user?.username || session?.user?.email || 'Not found'}`)
        
        if (!session || !session.user) {
            console.log("❌ User not authenticated")
            return NextResponse.json(
                { success: false, message: 'Not authenticated' },
                { status: 401 }
            )
        }

        // Find the user
        const user = await UserModel.findOne({
            $or: [
                { username: session.user.username },
                { email: session.user.email }
            ]
        })

        console.log(`👤 User found: ${user ? 'Yes' : 'No'}, Messages count: ${user?.messages?.length || 0}`)

        if (!user) {
            console.log("❌ User not found in database")
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            )
        }

        // Find and remove the message
        const messageIndex = user.messages.findIndex(
            (message: any) => message._id.toString() === messageId
        )

        console.log(`🔍 Message search - Index: ${messageIndex}, Looking for: ${messageId}`)

        if (messageIndex === -1) {
            console.log("❌ Message not found in user's messages")
            return NextResponse.json(
                { success: false, message: 'Message not found' },
                { status: 404 }
            )
        }

        // Remove the message from the array
        user.messages.splice(messageIndex, 1)
        await user.save()
        
        console.log(`✅ Message deleted successfully. Remaining messages: ${user.messages.length}`)

        return NextResponse.json(
            { 
                success: true, 
                message: 'Message deleted successfully' 
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error deleting message:', error)
        return NextResponse.json(
            { 
                success: false, 
                message: 'Internal server error' 
            },
            { status: 500 }
        )
    }
}
