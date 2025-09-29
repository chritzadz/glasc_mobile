export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const product_id = url.searchParams.get('product_id');
            
        console.log(`https://glasc-api.netlify.app/api/skincare/ingredient?product_id=${product_id}`);

        const response = await fetch(`https://glasc-api.netlify.app/api/skincare/ingredient?product_id=${product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        console.log("api\n" + data);
        return Response.json(data);

    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}