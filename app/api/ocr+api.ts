import { TextractClient, AnalyzeDocumentCommand, FeatureType } from "@aws-sdk/client-textract";

export async function POST(request: Request) {
    const { uri } = await request.json();
    
    const textractClient = new TextractClient({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    try {
        const base64Data = uri.split(',')[1];
        const imageBytes = Buffer.from(base64Data, 'base64');

        const command = new AnalyzeDocumentCommand({
            Document: {
                Bytes: imageBytes,
            },
            FeatureTypes: [FeatureType.TABLES, FeatureType.FORMS],
        });

        const response = await textractClient.send(command);
        
        const textLines: string[] = [];
        
        if (response.Blocks) {
            response.Blocks.forEach(block => {
                if (block.BlockType === 'LINE' && block.Text) {
                    textLines.push(block.Text);
                }
            });
        }

        // Join all lines into a single string
        const extractedText = textLines.join('\n');

        //process to db
        const responseDb = await fetch(`https://glasc-api.netlify.app/api/skincare/productSim?text=${extractedText}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await responseDb.json();
        return Response.json(data);

    } catch (error) {
        console.error('OCR extraction error:', error);
        return Response.json({ 
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            extractedText: ''
        });
    }
}