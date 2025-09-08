import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';
import ProductItemBox from '../../components/ProductItemBox';

const SearchScreen = ({ onClose }: { onClose?: () => void }) => {
    const mockProducts = [
        {
            imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80',
            name: 'Hydrating Serum',
            description: 'Deeply hydrates and plumps your skin for a radiant glow.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
            name: 'Gentle Cleanser',
            description: 'Removes impurities without stripping natural oils.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
            name: 'SPF Moisturizer',
            description: 'Protects against UV rays while keeping skin soft.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80',
            name: 'Hydrating Serum',
            description: 'Deeply hydrates and plumps your skin for a radiant glow.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
            name: 'Gentle Cleanser',
            description: 'Removes impurities without stripping natural oils.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
            name: 'SPF Moisturizer',
            description: 'Protects against UV rays while keeping skin soft.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80',
            name: 'Hydrating Serum',
            description: 'Deeply hydrates and plumps your skin for a radiant glow.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
            name: 'Gentle Cleanser',
            description: 'Removes impurities without stripping natural oils.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
            name: 'SPF Moisturizer',
            description: 'Protects against UV rays while keeping skin soft.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80',
            name: 'Hydrating Serum',
            description: 'Deeply hydrates and plumps your skin for a radiant glow.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
            name: 'Gentle Cleanser',
            description: 'Removes impurities without stripping natural oils.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
            name: 'SPF Moisturizer',
            description: 'Protects against UV rays while keeping skin soft.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80',
            name: 'Hydrating Serum',
            description: 'Deeply hydrates and plumps your skin for a radiant glow.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
            name: 'Gentle Cleanser',
            description: 'Removes impurities without stripping natural oils.',
        },
        {
            imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
            name: 'SPF Moisturizer',
            description: 'Protects against UV rays while keeping skin soft.',
        },
    ];

    return (
        <View className="flex flex-col gap-5 w-full items-center bg-[#F7F4EA] pd-10 px-5 pt-14">
            <View className="w-full flex flex-row gap-2"> {/* Search bar */}
                <View className="items-center w-[20px] p-2 flex justify-center">
                    <ChevronLeft color="#B87C4C" onPress={onClose}></ChevronLeft>
                </View>
                <View className="rounded-2xl border-2 items-center border-[#B87C4C] flex-1 px-2 flex flex-row gap-2">
                    <SearchIcon color="#B87C4C" />
                    <TextInput
                        placeholder="Search your products here..."
                        value={""}
                        onChangeText={() => {}}
                        className="text-[#b69982] w-full text-lg border-0"
                        />
                </View>
            </View>
            <ScrollView className="flex flex-col gap-2 w-full">
                {
                    mockProducts.map((product, index) => (
                        <ProductItemBox
                            key={index}
                            imageUrl={product.imageUrl}
                            name={product.name}
                            description={product.description}
                        />
                    ))
                }
            </ScrollView>
        </View>
    );
};

export default SearchScreen;
