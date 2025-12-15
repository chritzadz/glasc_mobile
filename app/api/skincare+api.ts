export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('product_id');

        let apiUrl = 'https://glasc-api.netlify.app/api/skincare';
        
        if (productId) {
            apiUrl += `?product_id=${productId}`;
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API returned error: ${response.status} - ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        return Response.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return Response.json({
            error: (error as Error).message
        }, { status: 500 });
    }
}