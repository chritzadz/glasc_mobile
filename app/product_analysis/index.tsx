import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, Lightbulb } from 'lucide-react-native';

interface HarmfulIngredient {
    ingredient: string;
    why: string;
}

interface Analysis {
    type: string;
    match_percentage: string;
    harmful_ingredients: HarmfulIngredient[];
}

export default function ProductAnalysisPage() {
    const params = useLocalSearchParams();
    const productName = Array.isArray(params.productName) ? params.productName[0] : params.productName;
    const analysisStr = Array.isArray(params.analysis) ? params.analysis[0] : params.analysis;
    const analysis: Analysis = JSON.parse(analysisStr);

    return (
        <SafeAreaView className="flex-1 bg-[#F7F4EA] px-5">
            <ScrollView className="flex-1">
                <View className="flex-col flex gap-4">
                    <View>
                        <Text className="font-bold text-2xl flex w-full justify-center items-center">
                            {productName}
                        </Text>
                    </View>
                    
                    <View className="flex-row flex-wrap flex items-center mb-2 gap-2">
                        <View className="flex-row items-center bg-[#5078a7] border-[#B87C4C] border-2 px-2 py-1 rounded-full gap-1">
                            <Lightbulb size={14} color={"white"}/>
                            <Text className="text-white font-bold text-sm ">{analysis.type}</Text>
                        </View>
                        
                        <View className="flex-row items-center bg-green-600 border-[#B87C4C] border-2 px-2 py-1 rounded-full gap-1">
                            <Text className="text-white font-bold text-sm">{analysis.match_percentage}%</Text>
                            <Text className="text-white text-sm font-bold">Match</Text>
                        </View>
                    </View>

                    {analysis.harmful_ingredients && analysis.harmful_ingredients.length > 0 ? (
                        analysis.harmful_ingredients.map((item, idx) => (
                        <View key={idx} style={{ marginBottom: 8, padding: 8, backgroundColor: '#ffe5e5', borderRadius: 8 }}>
                            <Text style={{ fontWeight: 'bold' }}>{item.ingredient}</Text>
                            <Text>{item.why}</Text>
                        </View>
                        ))
                    ) : (
                        <Text style={{ marginTop: 8 }}>None detected.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
        
    );
}