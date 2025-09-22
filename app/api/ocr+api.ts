import { TextractClient, AnalyzeDocumentCommand, FeatureType } from "@aws-sdk/client-textract";

export async function POST(request: Request) {
    const { uri } = await request.json(); //in mobile it is save locally, via uri, so convert to base64 first.
    
    // Use fetch to read the file as blob, then convert to base64
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Convert blob to base64
    const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.readAsDataURL(blob);
    });
    
    console.log("Base64 data prepared: " + base64);

    const textractClient = new TextractClient({
        region: 'us-east-2', // Textract is definitely available in us-east-1
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    console.log("texractClient SETTED UP");
    try {
        // Use the base64 data we read from the file
        const imageBytes = Buffer.from(base64, 'base64');

        console.log("analyze data");
        const command = new AnalyzeDocumentCommand({
            Document: {
                Bytes: imageBytes,
            },
            FeatureTypes: [FeatureType.TABLES, FeatureType.FORMS],
        });
        console.log("process done analyuzing, send command");
        const response = await textractClient.send(command);

        console.log("got data from aws textract");
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
        console.log("GET DATA the text = " + extractedText);

        //process to db
        const responseDb = await fetch(`https://glasc-api.netlify.app/api/productSim?text=${extractedText}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await responseDb.json();
        console.log(data);
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