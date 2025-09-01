export async function GET() {
    return Response.json({ message: 'API working' });
}

export async function POST(request: Request) {
    const body = await request.json();
    return Response.json({ message: 'POST received', data: body });
}