export async function GET() {
    try {
        const response = await fetch('https://glasc-api.netlify.app/api/skincare', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        return Response.json(data);
        
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}

