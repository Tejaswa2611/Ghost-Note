import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
    try {
        const { username, category = 'general' } = await request.json();
        
        console.log("🤖 Generating message suggestions for username:", username, "Category:", category);
        
        // Check if OpenAI API key is set
        if (!process.env.OPENAI_API_KEY) {
            console.error(" OPENAI_API_KEY not set in environment variables");
            
            // Return fallback suggestions
            const fallbackSuggestions = [
                "What's something that made you smile today?",
                "If you could travel anywhere right now, where would you go?",
                "What's a hobby you've recently started or want to try?",
                "What's the best advice you've ever received?",
                "If you could have dinner with any historical figure, who would it be?",
                "What's a song that always puts you in a good mood?",
                "What's something you're proud of accomplishing recently?",
                "If you could learn any skill instantly, what would it be?"
            ];
            
            return Response.json({
                success: true,
                suggestions: fallbackSuggestions.slice(0, 6), // Return 6 suggestions
                source: "fallback"
            }, { status: 200 });
        }
        
        // Create dynamic prompts based on category
        const prompts = {
            general: `Generate 6 friendly, engaging, and thought-provoking anonymous message suggestions that someone could send to ${username}. 
            The messages should be:
            - Positive and uplifting
            - Safe for work and appropriate
            - Conversation starters
            - Personal but not intrusive
            - Encouraging self-reflection or sharing experiences
            
            Return only the message suggestions, one per line, without numbers or bullet points.`,
            
            creative: `Generate 6 creative and artistic anonymous message suggestions for ${username}. Focus on:
            - Creative projects and inspiration
            - Art, music, writing, or other creative pursuits
            - Imagination and innovation
            - Creative challenges or prompts
            
            Return only the message suggestions, one per line, without numbers or bullet points.`,
            
            motivational: `Generate 6 motivational and inspiring anonymous message suggestions for ${username}. Focus on:
            - Personal growth and development
            - Overcoming challenges
            - Achieving goals and dreams
            - Building confidence and self-belief
            
            Return only the message suggestions, one per line, without numbers or bullet points.`,
            
            friendly: `Generate 6 casual and friendly anonymous message suggestions for ${username}. Focus on:
            - Everyday life and experiences
            - Hobbies and interests
            - Fun and lighthearted topics
            - Building connections and friendships
            
            Return only the message suggestions, one per line, without numbers or bullet points.`,
            
            thoughtful: `Generate 6 deep and thoughtful anonymous message suggestions for ${username}. Focus on:
            - Philosophy and life perspectives
            - Personal values and beliefs
            - Meaningful experiences and memories
            - Self-reflection and introspection
            
            Return only the message suggestions, one per line, without numbers or bullet points.`
        };
        
        const selectedPrompt = prompts[category as keyof typeof prompts] || prompts.general;
        
        console.log("🎯 Using prompt category:", category);
        
        // Generate suggestions using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates appropriate, friendly, and engaging anonymous message suggestions. Always maintain a positive and respectful tone."
                },
                {
                    role: "user",
                    content: selectedPrompt
                }
            ],
            max_tokens: 400,
            temperature: 0.8, // Higher creativity
            n: 1
        });
        
        const response = completion.choices[0]?.message?.content || '';
        
        // Parse the response into individual suggestions
        const suggestions = response
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.trim().replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, ''))
            .filter(suggestion => suggestion.length > 10) // Filter out very short responses
            .slice(0, 6); // Ensure we only return 6 suggestions
        
        console.log("✅ Generated", suggestions.length, "suggestions via OpenAI");
        
        // If we don't have enough suggestions, add fallbacks
        if (suggestions.length < 4) {
            const fallbacks = [
                "What's something you're grateful for today?",
                "Share a random fact about yourself that would surprise people!",
                "What's your favorite way to unwind after a long day?",
                "If you could give your past self one piece of advice, what would it be?"
            ];
            
            suggestions.push(...fallbacks.slice(0, 6 - suggestions.length));
        }
        
        return Response.json({
            success: true,
            suggestions: suggestions,
            source: "openai",
            category: category
        }, { status: 200 });
        
    } catch (error) {
        console.error("❌ Error generating message suggestions:", error);
        
        // Return fallback suggestions on error
        const fallbackSuggestions = [
            "What's something that made you smile today?",
            "If you could travel anywhere right now, where would you go?",
            "What's a hobby you've recently started or want to try?",
            "What's the best advice you've ever received?",
            "If you could learn any skill instantly, what would it be?",
            "What's something you're proud of accomplishing recently?"
        ];
        
        return Response.json({
            success: true,
            suggestions: fallbackSuggestions,
            source: "fallback_error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 200 }); // Still return 200 to show fallback data
    }
}