import { View, Text, Image, TouchableOpacity } from "react-native";

interface ProductItemBoxProps {
    imageUrl: string;
    name: string;
    description: string;
    onPress: () => void; // Add onPress prop
}

export const ProductItemBox = ({
    imageUrl,
    name,
    description,
    onPress,
}: ProductItemBoxProps) => (
    <TouchableOpacity
        onPress={onPress}
        style={{ boxShadow: "inset 0px 0px 10px 0px rgba(0, 0, 0, 0.3)" }}
        className="flex-1 shadow w-full h-[220px] flex-col items-center justify-center rounded-2xl bg-[#B87C4C]"
        activeOpacity={1}
    >
        <Image
            source={{ uri: imageUrl }}
            className="w-full h-40 rounded-xl shadow"
            resizeMode="cover"
        />
        <View className="flex-1 w-full flex justify-center items-center p-2 rounded-2xl">
            <Text
                className="font-bold text-md mb-1 flex text-center justify-center items-center text-[#F7F4EA]"
                numberOfLines={3}
                ellipsizeMode="tail"
            >
                {name}
            </Text>
        </View>
    </TouchableOpacity>
);
