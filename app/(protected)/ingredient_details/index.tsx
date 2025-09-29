import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronDown, ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";

import IngredientItem from "../../../components/SingleIngredientBox";

export default function IngredientsDetails() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { productName, ingredients } = params;

    const [ingredientList, setIngredientList] = useState<string[]>([]);

    useEffect(() => {
        if (typeof ingredients === "string") {
            setIngredientList(JSON.parse(ingredients));
        } else if (Array.isArray(ingredients)) {
            setIngredientList(ingredients);
        }
        console.log(ingredientList);
    }, [ingredients]);

    const handleBack = () => {
        router.back();
    };

    return (
        <View className="flex-1 bg-[#B87C4C] shadow-md">
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.headerContainer}>
                        <View className="bg-[#FFFFFF] rounded-full p-2">
                            <TouchableOpacity onPress={handleBack}>
                                <ArrowLeft color="#B87C4C" />
                            </TouchableOpacity>
                        </View>
                        <View className="w-64">
                            <Text
                                className="font-semibold text-white text-base ml-4 overflow-hidden"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {productName || "Loading..."}
                            </Text>
                        </View>
                    </View>
                    <View className="bg-[#F7F4EA] rounded-[16px] items-center">
                        <View>
                            <TouchableOpacity
                                onPress={handleBack}
                                className="my-4"
                            >
                                <ChevronDown color="#B87C4C" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row flex-wrap justify-center">
                            {ingredientList.map((item, index) => (
                                <IngredientItem key={index} name={item} />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 8,
        backgroundColor: "#996032",
        borderRadius: 999,
        height: 48,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        paddingRight: 60,
        justifyContent: "space-between",
    },
    ingredientItem: {},
});
