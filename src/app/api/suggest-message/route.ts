import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
    try {
        const { username, category = 'performance' } = await request.json();
        
        console.log("🤖 Generating message suggestions for username:", username, "Category:", category);
        
        // Check if OpenAI API key is set
        if (!process.env.OPENAI_API_KEY) {
            console.error(" OPENAI_API_KEY not set in environment variables");
            
            // Return professional fallback feedback suggestions
            const fallbackSuggestions = [
                "Your attention to detail in recent projects has been impressive. How do you maintain such high standards?",
                "I've noticed your collaborative approach in team meetings. What strategies help you facilitate effective discussions?",
                "Your problem-solving skills during challenging situations stand out. What's your approach to tackling complex issues?",
                "The way you mentor junior team members is commendable. What advice would you give to others about knowledge sharing?",
                "Your ability to meet deadlines consistently is valuable to the team. How do you manage your time effectively?",
                "I appreciate how you communicate complex ideas clearly. What techniques help you explain technical concepts?",
                "Your positive attitude during stressful periods is motivating. How do you maintain resilience under pressure?",
                "The innovative solutions you propose often improve our processes. What inspires your creative thinking?"
            ];
            
            return Response.json({
                success: true,
                suggestions: fallbackSuggestions.slice(0, 6), // Return 6 suggestions
                source: "fallback"
            }, { status: 200 });
        }
        
        // Create dynamic prompts based on feedback category
        const prompts = {
            performance: `Generate 6 professional, constructive anonymous feedback suggestions for ${username} focusing on performance and productivity. 
            The feedback should be:
            - Constructive and actionable
            - Professional and respectful
            - Focused on specific behaviors or outcomes
            - Encouraging improvement and growth
            - Suitable for workplace environments
            
            Return only the feedback suggestions, one per line, without numbers or bullet points.`,
            
            leadership: `Generate 6 professional anonymous feedback suggestions for ${username} regarding leadership and management effectiveness. Focus on:
            - Leadership style and approach
            - Communication and decision-making
            - Team management and motivation
            - Vision and strategic thinking
            - Professional development opportunities
            
            Return only the feedback suggestions, one per line, without numbers or bullet points.`,
            
            collaboration: `Generate 6 constructive anonymous feedback suggestions for ${username} about teamwork and collaboration. Focus on:
            - Team dynamics and cooperation
            - Communication within teams
            - Conflict resolution and problem-solving
            - Knowledge sharing and mentoring
            - Cross-functional collaboration
            
            Return only the feedback suggestions, one per line, without numbers or bullet points.`,
            
            development: `Generate 6 professional anonymous feedback suggestions for ${username} focused on professional development and growth. Focus on:
            - Skill development opportunities
            - Career advancement suggestions
            - Learning and training recommendations
            - Professional strengths and areas for improvement
            - Goal setting and achievement
            
            Return only the feedback suggestions, one per line, without numbers or bullet points.`,
            
            culture: `Generate 6 thoughtful anonymous feedback suggestions for ${username} about organizational culture and workplace environment. Focus on:
            - Company culture and values alignment
            - Work environment and atmosphere
            - Inclusion and diversity perspectives
            - Process improvements and efficiency
            - Employee satisfaction and engagement
            
            Return only the feedback suggestions, one per line, without numbers or bullet points.`
        };
        
        const selectedPrompt = prompts[category as keyof typeof prompts] || prompts.performance;
        
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
        
        // If we don't have enough suggestions, add professional fallbacks
        if (suggestions.length < 4) {
            const fallbacks = [
                "Your expertise in [specific area] has been valuable to our team. What drives your passion for this field?",
                "I've noticed your ability to remain calm under pressure. What strategies help you manage stress effectively?",
                "Your contributions to recent projects have made a significant impact. What aspects of the work do you find most rewarding?",
                "The way you approach challenges with creativity is inspiring. What influences your innovative thinking?"
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
        
        // Return professional fallback feedback suggestions on error
        const fallbackSuggestions = [
            "Your collaborative approach in team projects has been effective. What strategies work best for you?",
            "I've observed your strong problem-solving abilities. How do you approach complex challenges?",
            "Your communication skills help clarify difficult concepts. What techniques do you find most effective?",
            "The way you handle deadlines and priorities is impressive. What's your time management approach?",
            "Your positive attitude contributes to team morale. How do you maintain motivation during busy periods?",
            "I appreciate your willingness to help colleagues. What motivates you to support team members?"
        ];
        
        return Response.json({
            success: true,
            suggestions: fallbackSuggestions,
            source: "fallback_error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 200 }); // Still return 200 to show fallback data
    }
}