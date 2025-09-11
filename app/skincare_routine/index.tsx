import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { TextInput } from 'react-native';
import { ScrollView } from 'react-native';
import ProductItemBox from '../../components/ProductItemBox';

const SkincareRoutine = ({ onClose }: { onClose?: () => void }) => {
    
    return (
        <View className="flex flex-col gap-5 w-full items-center bg-[#F7F4EA] pd-10 px-5 pt-14">
            <Text className="text-4xl font-bold text-[#B87C4C]" >My Skincare Routine</Text>
            <View className="w-full flex flex-row gap-2">
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
            <Text className="text-4xl font-bold text-[#B87C4C]" >My Products:</Text>
            <ScrollView className="flex flex-col gap-2 w-full">
                
            </ScrollView>
        </View>
    );
};

export default SkincareRoutine;
