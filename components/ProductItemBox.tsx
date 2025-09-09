import { View, Text, Image } from 'react-native';

interface ProductItemBoxProps {
    imageUrl: string;
    name: string;
    description: string;
    }

const ProductItemBox = ({ imageUrl, name, description }: ProductItemBoxProps) => (
    <View className="w-full flex-col items-center rounded-2xl bg-white border-2 border-[#B87C4C]">
        <Image
        source={{ uri: imageUrl }}
        className="w-full h-40 rounded-t-xl"
        resizeMode="cover"
        />
        <View className="flex-1 w-full flex justify-center items-center p-2">
            <Text className="font-bold text-lg mb-1 flex justify-center items-center text-[#B87C4C]">{name}</Text>
        </View>
    </View>
);

export default ProductItemBox;