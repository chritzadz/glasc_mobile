import { View, Text, Image } from "react-native";

interface ProductItemBoxProps {
    imageUrl: string;
    name: string;
    description: string;
}

export const ProductItemBox = ({
    imageUrl,
    name,
    description,
}: ProductItemBoxProps) => (
    <View
        style={{ boxShadow: "inset 0px 0px 10px 0px rgba(0, 0, 0, 0.3)" }}
        className="flex-1 shadow w-full h-[220px] flex-col items-center justify-center rounded-2xl bg-[#B87C4C]"
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
    </View>
);
