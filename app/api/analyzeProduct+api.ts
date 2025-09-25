import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

function cleanJsonResponse(text: string): string {
    // Remove common prefixes that AI models add
    text = text.replace(/^(Here's the analysis|Based on|To provide|The analysis shows?:?\s*)/i, '');
    
    // Remove markdown code blocks
    text = text.replace(/```json\s*/gi, '');
    text = text.replace(/```\s*/g, '');
    
    // Remove any text before the first {
    const firstBrace = text.indexOf('{');
    if (firstBrace !== -1) {
        text = text.substring(firstBrace);
    }
    
    // Remove any text after the last }
    const lastBrace = text.lastIndexOf('}');
    if (lastBrace !== -1) {
        text = text.substring(0, lastBrace + 1);
    }
    
    // Clean up common JSON issues
    text = text.replace(/'/g, '"'); // Replace single quotes with double quotes
    text = text.replace(/,\s*}/g, '}'); // Remove trailing commas before }
    text = text.replace(/,\s*]/g, ']'); // Remove trailing commas before ]
    
    return text.trim();
}

export async function POST(request: Request) {
    const { ingredients, personalDetails } = await request.json();
    
    const client = new BedrockRuntimeClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    const prompt = `
    Analyze this skincare product ingredients:
    ${ingredients}
    
    User has this skin concerns and condition:
    ${personalDetails}

    Return JSON format:
    {
		type: "what kind of skincare is this e.g. moistirizer, serum, etc..",
		match_percentage: "match percentage e.g. 98",
		harmful_ingredients: "harmful ingredients that is in the product ingredients GIVEN"
    }
    
    type: should just be the type one word ot two word
    match_percentage: a string
    harmful_ingredients: a list of object where the object contains properties, ingredient and why. so format should look like [{ingredient: "d", why: "c"}, {ingredient: "a", why: ""b}, ...]
    `;

    const payload = {
        messages: [{
            role: "user",
            content: [{ text: prompt }]
        }],
        inferenceConfig: {
            max_new_tokens: 500,
            temperature: 0.7
        }
    };

    const command = new InvokeModelCommand({
        modelId: "amazon.nova-pro-v1:0",
        body: JSON.stringify(payload),
    });

    const response = await client.send(command);
    const raw = new TextDecoder().decode(response.body);
    const result = JSON.parse(raw);

    // Extract the model's JSON string
    const jsonString = result.output.message.content[0].text;

    const cleanedJson = cleanJsonResponse(jsonString);

    const analysisText = JSON.parse(cleanedJson);
    console.log("analysis text: " + analysisText);
    
    try {
        const analysis = analysisText;
        return Response.json({ analysis });
    } catch (error) {
        return Response.json({ analysis: { raw_response: analysisText } });
    }
}
