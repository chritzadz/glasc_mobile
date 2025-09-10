export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await fetch('https://glasc-api.netlify.app/api/personalDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(data);
        
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const response = await fetch('https://glasc-api.netlify.app/api/personalDetails', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(data);
        
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('user_id');
            
        console.log(`https://glasc-api.netlify.app/api/personalDetails?user_id=${userId}`);

        const response = await fetch(`https://glasc-api.netlify.app/api/personalDetails?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        console.log(data);
        
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}