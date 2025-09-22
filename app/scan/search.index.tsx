import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';
import ProductItemBox from '../../components/ProductItemBox';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchScreen = ({ onClose }: { onClose?: () => void }) => {
    const getProduct
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
        <View className="px-5">
            <SafeAreaView className="flex flex-col gap-5 w-full items-center bg-[#F7F4EA] pd-10 px-5">
                <View className="w-full flex flex-row gap-2">
                    {/* <View className="items-center w-[20px] p-2 flex justify-center">
                        <ChevronLeft color="#B87C4C" onPress={onClose}></ChevronLeft>
                    </View> */}
                    <View className="rounded-2xl p-1 border-2 items-center border-[#B87C4C] flex-1 px-2 flex flex-row gap-2">
                        <SearchIcon color="#B87C4C" />
                        <TextInput
                            placeholder="Search your products here..."
                            value={""}
                            onChangeText={() => {}}
                            onSubmitEditing={handleSubmit}
                            className="text-[#b69982] w-full text-lg border-0"
                            />
                    </View>
                </View>
                <ScrollView className="flex flex-col gap-2 w-full">
                    {Array.from({ length: Math.ceil(mockProducts.length / 2) }).map((_, rowIdx) => (
                        <View key={rowIdx} className="flex flex-row gap-2 mb-2">
                        <View className="flex-1 shadow">
                            <ProductItemBox
                            imageUrl={mockProducts[rowIdx * 2]?.imageUrl}
                            name={mockProducts[rowIdx * 2]?.name}
                            description={mockProducts[rowIdx * 2]?.description}
                            />
                        </View>
                        {mockProducts[rowIdx * 2 + 1] && (
                            <View className="flex-1 shadow">
                            <ProductItemBox
                                imageUrl={mockProducts[rowIdx * 2 + 1]?.imageUrl}
                                name={mockProducts[rowIdx * 2 + 1]?.name}
                                description={mockProducts[rowIdx * 2 + 1]?.description}
                            />
                            </View>
                        )}
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
        
    );
};

export default SearchScreen;
