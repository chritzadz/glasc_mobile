import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Animated, Button, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Scan, Search, Users } from 'lucide-react-native';
import SearchScreen from './search.index';
import { router } from 'expo-router';


export default function App() {
	const [facing, setFacing] = useState<CameraType>('back');
	const screenHeight = Dimensions.get('window').height;
	const [permission, requestPermission] = useCameraPermissions();
	const [selectedOption, setSelectedOption] = useState("scan");
	const slideAnim = useRef(new Animated.Value(-screenHeight)).current;

	const showSearch = () => {
		Animated.timing(slideAnim, {
		toValue: 0,
		duration: 600,
		useNativeDriver: true,
		}).start(() => {});
	};

	const hideSearch = () => {
		Animated.timing(slideAnim, {
		toValue: -screenHeight,
		duration: 600,
		useNativeDriver: true,
		}).start();
	};

	const handlePress = () => {
		if (selectedOption === "scan") {
			setSelectedOption("search");
			showSearch();
		} else {
			setSelectedOption("scan");
		}
	}

	const handleSettingPress = () => {
		router.push('/settings');
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

	return (
		<View className="bg-[#F7F4EA] w-full justify-center flex-1 relative">
			<Animated.View
				className="w-full pb-20"
				style={{
					position: 'absolute',
					height: screenHeight,
					top: 0,
					left: 0,
					right: 0,
					backgroundColor: '#F7F4EA',
					transform: [{ translateY: slideAnim }],
					zIndex: 10,
				}}
			>
				<SearchScreen onClose={() => { setSelectedOption('scan'); hideSearch(); }} />
			</Animated.View>
			<View className="bg-[#F7F4EA] w-full justify-center p-5 flex-1 relative">
				<View className="rounded-3xl overflow-hidden flex-1 border-[#B87C4C] border-4">
					<CameraView style={styles.flex} facing={facing} />
				</View>
				<TouchableOpacity onPress={handleSettingPress} className="absolute bg-[#F7F4EA] rounded-full p-2 self-center top-14 border-2 border-[#B87C4C]">
					<Users size={32} color="#B87C4C"></Users>
				</TouchableOpacity>
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
