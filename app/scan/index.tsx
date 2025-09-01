import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Scan, Search } from 'lucide-react-native';


export default function App() {
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const [selectedOption, setSelectedOption] = useState("search");

	const handlePress = () => {
		if (selectedOption === "scan") {
			setSelectedOption("search");
		} else {
			setSelectedOption("scan");
		}
	}

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		requestPermission();
		return (
			<View>
				<Text>Not Permitted</Text>
			</View>
		)
	}

	function toggleCameraFacing() {
		setFacing(current => (current === 'back' ? 'front' : 'back'));
	}

	return (
		<View className="bg-[#F7F4EA] justify-center p-5 flex-1 relative">
			<View className="rounded-3xl overflow-hidden flex-1 border-[#B87C4C] border-4">
				<CameraView style={styles.flex} facing={facing} />
			</View>
			{ selectedOption === "scan" &&
				<View className="absolute self-center bottom-24 flex flex-row rounded-full bg-[#B87C4C] justify-center items-center p-2">
					<View className="bg-[#F7F4EA] rounded-full px-4 py-2">
						<View className="flex flex-row items-center justify-center gap-2">
							<Scan className='text-[#B87C4C]' size={24} color="#B87C4C"/>
							<Text className='font-bold text-2xl m-0 text-[#B87C4C]'>Scan</Text>
						</View>
					</View>
					<TouchableOpacity onPress={handlePress}>
						<View className="bg-transparent rounded-full px-4 py-2">
							<View className="flex flex-row items-center justify-center gap-2">
								<Search className='text-[#F7F4EA]' size={24} color="#F7F4EA"/>
								<Text className='font-bold text-2xl m-0 text-[#F7F4EA]'>Search</Text>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			}
			{ selectedOption === "search" &&
				<View className="absolute self-center bottom-24 flex flex-row rounded-full bg-[#B87C4C] justify-center items-center p-2">
					<TouchableOpacity onPress={handlePress}>
						<View className="bg-transparent rounded-full px-4 py-2">
							<View className="flex flex-row items-center justify-center gap-2">
								<Scan className='text-[#F7F4EA]' size={24} color="#F7F4EA"/>
								<Text className='font-bold text-2xl m-0 text-[#F7F4EA]'>Scan</Text>
							</View>
						</View>
					</TouchableOpacity>
					<View className="bg-[#F7F4EA] rounded-full px-4 py-2">
						<View className="flex flex-row items-center justify-center gap-2">
							<Search className='text-[#B87C4C]' size={24} color="#B87C4C"/>
							<Text className='font-bold text-2xl m-0 text-[#B87C4C]'>Search</Text>
						</View>
					</View>
				</View>
			}
    	</View>
	);
}

const styles = StyleSheet.create({
	flex:{
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	message: {
		textAlign: 'center',
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 64,
		flexDirection: 'row',
		backgroundColor: 'transparent',
		width: '100%',
		paddingHorizontal: 64,
	},
	button: {
		flex: 1,
		alignItems: 'center',
	},
	text: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
	},
});
