import { Text, View } from 'react-native';

const SearchScreen = ({ onClose }: { onClose?: () => void }) => {
    return (
        <View className="flex-1 items-center justify-center bg-[#F7F4EA]">
            <Text className="text-2xl font-bold text-[#B87C4C]">Search screen</Text>
            {onClose && (
                <Text className="mt-8 text-[#B87C4C] underline" onPress={onClose}>
                    Close
                </Text>
            )}
        </View>
    );
};

export default SearchScreen;
