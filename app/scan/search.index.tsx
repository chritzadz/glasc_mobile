import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { TextInput } from 'react-native';

const SearchScreen = ({ onClose }: { onClose?: () => void }) => {
    return (
        <View className="flex-1 items-center justify-center bg-[#F7F4EA] pd-10 px-5">
            <View className="w-full flex flex-row gap-2">
                <View className="items-center w-[20px] p-2 flex justify-center">
                    <ChevronLeft color="#B87C4C"></ChevronLeft>
                </View>
                <View className="rounded-2xl border-2 items-center border-[#B87C4C] flex-1 p-2 flex flex-row gap-2">
                    <SearchIcon color="#B87C4C" />
                    <TextInput
                        placeholder="Search your products here..."
                        value={""}
                        onChangeText={() => {}}
                        className="text-[#b69982] w-full text-lg"
                        />
                </View>
            </View>
            
            {onClose && (
                <Text className="mt-8 text-[#B87C4C] underline" onPress={onClose}>
                    Close
                </Text>
            )}
        </View>
    );
};

export default SearchScreen;
