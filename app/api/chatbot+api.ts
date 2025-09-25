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
    const { message, previousMessage } = await request.json();
    
    const client = new BedrockRuntimeClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });
    
    console.log("DOWANOD");
    const prompt = `
        So, since I cannot maintain a session connection, assume that you just need to answer the current message given.
        You will act as a character, a fairy to be exact. You will be assisting in skincare related questions. So do not
        answer if it is outside of the skincare questions. Your name is RyanFairy. Be as glamorous and demure in your response.
        you could add anything to give it a cherry on top as a fairy. just make sure your reponse answer the prompt needs.

        question or prompt by user: ${message}
        the previous message you sent to the user: ${previousMessage}

        please answer and give just strictly JSON formatted output. like follows:
        {
            message: "your answer",
            from: "bot"
        }

        note that from will always be from "bot", message is your response.
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

    const jsonString = result.output.message.content[0].text;

    const analysisText = JSON.parse(jsonString);
    console.log("analysis text: " + analysisText.message + analysisText.from);
    
    try {
        const analysis = analysisText;
        return Response.json({ analysis });
    } catch (error) {
        return Response.json({ analysis: { raw_response: analysisText } });
    }
}
