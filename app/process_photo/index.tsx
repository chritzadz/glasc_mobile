
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect } from 'react';

interface ProcessPhotoProps {
	uri: string | null;
	onBack: () => void;
}

export default function ProcessPhoto({ uri, onBack }: ProcessPhotoProps) {

	//process data using the api idk.
	useEffect(() => {

	})

	return (
		<View className="bg-[#F7F4EA] w-full justify-center flex-1 relative">
			<View className="bg-[#F7F4EA] w-full justify-center p-5 flex-1 relative">
				<View className="rounded-3xl overflow-hidden flex-1 border-[#B87C4C] border-4">
					{uri ? (
						<Image source={{ uri }} style={styles.flex} />
					) : (
						<View className="flex-1 justify-center items-center">
							<Text className="text-[#B87C4C] text-lg">No photo provided</Text>
						</View>
					)}
				</View>
			</View>
			
			<TouchableOpacity onPress={onBack} className="absolute self-center bottom-24 bg-[#B87C4C] rounded-full px-6 py-3 border-4 border-[#F7F4EA]">
				<View className="flex flex-row items-center gap-2">
					<ArrowLeft size={24} color="#F7F4EA" />
					<Text className="text-[#F7F4EA] font-bold text-lg">Back</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
});