import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import ProductItemBox from '../../components/ProductItemBox';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Product {
    product_name: string;
    product_url: string;
}

const SearchScreen = ({ onClose }: { onClose?: () => void }) => {
    const [skincareProduct, setSkincareProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchSkincareProducts = async () => {
            try {
                const response = await fetch('/api/skincare');
                const data = await response.json();
                setSkincareProducts(data);
            } catch (error) {
                console.error('Error fetching skincare products:', error);
            }
        };

        fetchSkincareProducts();
    }, []);

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
                            className="text-[#b69982] w-full text-lg border-0"
                            />
                    </View>
                </View>
                <ScrollView className="flex flex-col gap-2 w-full">
                    {Array.from({ length: Math.ceil(skincareProduct.length / 2) }).map((_, rowIdx) => (
                        <View key={rowIdx} className="flex flex-row gap-2 mb-2">
                        <View className="flex-1 shadow">
                            <ProductItemBox
                                imageUrl={'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80'}
                                name={skincareProduct[rowIdx * 2]?.product_name}
                                description={"test"}
                            />
                        </View>
                        {skincareProduct[rowIdx * 2 + 1] && (
                            <View className="flex-1 shadow">
                            <ProductItemBox
                                imageUrl={'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80'}
                                name={skincareProduct[rowIdx * 2 + 1]?.product_name}
                                description={"test"}
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
