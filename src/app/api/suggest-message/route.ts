// TODO---


// import { openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//     try {
//         const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||' . These questions are for anonymous social message platform like qooh.me and should be suitable for a diverse audience. For example, your output should be structured like this: 'Whats hobby you have recently started? || If you could have dinner with any historical figure, who would it be?"
//         const result = await streamText({
//             model: openai('gpt-4-turbo'),
//             prompt,
//         });

//         return result.toAIStreamResponse();
//     } catch (error) {
//         console.error("Error generating message: ", error);
//         return Response.json({
//             success: false,
//             message: `Error generating message ${error}`
//         }, { status: 500 })
//     }
// }