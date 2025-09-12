export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const product_name = url.searchParams.get('product_name');
            
        console.log(`https://glasc-api.netlify.app/api/skincare/ingredient?product_name=${product_name}`);

        const response = await fetch(`https://glasc-api.netlify.app/api/skincare/ingredient?product_name=${product_name}`, {
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