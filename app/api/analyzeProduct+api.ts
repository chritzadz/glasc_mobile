import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

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
    const jsonString = result.output.message.content[0].text
        .replace(/^```json\s*/i, '')
        .replace(/```$/i, '')
        .trim();

    const analysisText = JSON.parse(jsonString);
    console.log(analysisText);
    
    try {
        const analysis = analysisText;
        return Response.json({ analysis });
    } catch (error) {
        return Response.json({ analysis: { raw_response: analysisText } });
    }
}
