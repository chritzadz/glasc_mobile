import { Text, View, Button } from 'react-native'

const Home = () => {
    const testAPI = async () => {
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
    };

    return (
        <View className='flex-1 justify-center items-center'>
            <Text className='text-red-500'>Home</Text>
            <Button title="Test API" onPress={testAPI} />
        </View>
    )
}

export default Home;