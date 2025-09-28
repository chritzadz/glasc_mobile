import { View, Text } from 'react-native';

interface SingleIngredientBox {
    name: string;
}

const IngredientItem = ({ name }: SingleIngredientBox) => (
    <View className="bg-[#996032] rounded-full px-4 py-2 m-1">
        <Text className="text-white font-semibold">{name}</Text>
    </View>
);

export default IngredientItem;