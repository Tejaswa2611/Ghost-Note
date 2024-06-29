// validate username using usernameValidation schema made in schema using zod(mqke usernamequeryschema)
// make a get get function to chek if username is unique
// extract username from params. parse it to usernameQuerySchema and stroe it in result
// extract errors from result and if there are errors return 400 status code with errors
// if there are no errors then extract username from result and check if it is unique
// if it is unique then return 200 status code with isUnique: true

import { z } from 'zod';
import { userNameValidation } from '@/schemas/signUpSchema'
import connectDB from '@/lib/connectDB';
import UserModel from '@/models/User';

const usernameQuerySchema = z.object({
    username: userNameValidation,
})

export async function GET(request: Request) {
    await connectDB();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username'),
        }
        const result = usernameQuerySchema.safeParse(queryParam);
        console.log("result from unique username check->", result);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(',') : "Invalid query parameters",
            }, { status: 400 }
            )
        }
        // const {username} = result.data;
        const username = result.data.username;
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        })
        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "Username available"
        }, { status: 200 })

    } catch (error) {
        console.log("Error in check username unique route", error);
        return Response.json({
            success: false,
            message: "Error in checking unique username"
        }, { status: 500 })
    }
}

