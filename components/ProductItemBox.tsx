import { View, Text, Image, TouchableOpacity } from 'react-native';

interface ProductItemBoxProps {
    imageUrl: string;
    name: string;
    description: string;
    onPress: () => void; // Add onPress prop
}

const ProductItemBox = ({ imageUrl, name, description, onPress }: ProductItemBoxProps) => (
    <TouchableOpacity onPress={onPress} className="w-full h-[220px] flex-col items-center justify-center rounded-2xl bg-[#B87C4C]">
        <Image
            source={{ uri: imageUrl }}
            className="w-full h-40 rounded-xl"
            resizeMode="cover"
        />
        <View className="flex-1 w-full flex justify-center items-center p-2 bg-[#B87C4C] rounded-2xl">
            <Text className="font-bold text-md mb-1 flex text-center justify-center items-center text-[#F7F4EA]" numberOfLines={3} ellipsizeMode="tail">
                {name}
            </Text>
        </View>
    </TouchableOpacity>
);

export default ProductItemBox;