export async function POST(request: Request) {
    try {
        const body = await request.json(); 
        const response = await fetch('https://glasc-api.netlify.app/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const response = await fetch('https://glasc-api.netlify.app/api/users', {
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
  
  