import { View, Text, Image } from 'react-native';

interface ProductItemBoxProps {
    imageUrl: string;
    name: string;
    description: string;
    }

const ProductItemBox = ({ imageUrl, name, description }: ProductItemBoxProps) => (
    <View className="w-full flex-row items-center rounded-2xl bg-white p-4 mb-4 border-2 border-[#B87C4C]">
        <Image
        source={{ uri: imageUrl }}
        className="w-20 h-20 rounded-xl mr-4"
        resizeMode="cover"
        />
        <View className="flex-1 w-full">
            <Text className="font-bold text-lg mb-1">{name}</Text>
            <Text className="text-[#7a6e5a]" ellipsizeMode="tail" numberOfLines={3}>{description}</Text>
        </View>
    </View>
);

export default ProductItemBox;