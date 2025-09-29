export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('product_id');

        let apiUrl = 'https://glasc-api.netlify.app/api/skincare';
        
        if (productId) {
            apiUrl += `?product_id=${productId}`;
        }

        console.log(`Fetching from: ${apiUrl}`);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log(`Response status: ${response.status}`);
        console.log(`Response ok: ${response.ok}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API returned error: ${response.status} - ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data received from API:", data);
        
        return Response.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return Response.json({
            error: (error as Error).message
        }, { status: 500 });
    }
}