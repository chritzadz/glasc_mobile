export async function POST(request: Request) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            })
        });
        const data = await response.json();
        console.log(data);
        
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}