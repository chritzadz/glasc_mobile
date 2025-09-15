import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { Scan, Search, Users, Camera } from 'lucide-react-native';
import SearchScreen from './search.index';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Settings from '../settings';
import ProcessPhoto from '../process_photo';
import { SafeAreaView } from 'react-native-safe-area-context';

import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
} from 'react-native-reanimated';


export default function App() {
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const [selectedOption, setSelectedOption] = useState("scan");
	const screenHeight = Dimensions.get('window').height - 50;
	const slideAnim = useSharedValue(-screenHeight);
	const [showCamera, setShowCamera] = useState(true);
	const cameraRef = useRef<CameraView>(null);
	const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
	const [settingOpen, setSettingOpen] = useState(false);

	const slideStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: withTiming(slideAnim.value, { duration: 600 }) }],
	}));

	useFocusEffect(
		useCallback(() => {
			setShowCamera(true);

			return () => {
				setShowCamera(false);
			};
		}, [])
	);

	const showSettings = () => {
		setSettingOpen(true);
		slideAnim.value = 0;
	};

	const hideSettings = () => {
		setSettingOpen(false);
		slideAnim.value = -screenHeight;
	};

	const handlePress = () => {
		if (selectedOption === "scan") {
			setSelectedOption("search");
		} else {
			setSelectedOption("scan");
		}
	}

	const handleTakePhoto = async () => {
		if (cameraRef.current) {
			try {
				const photo = await cameraRef.current.takePictureAsync({
					quality: 0.8,
					base64: true,
				});
				
				await AsyncStorage.setItem('skinPhoto', photo.uri);
				setCapturedPhoto(photo.uri);
			} catch (error) {
				Alert.alert('Error', 'Failed to capture photo');
			}
		}
	};

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
		<>
			{
				(capturedPhoto) ? (
					<ProcessPhoto uri={capturedPhoto} onBack={() => setCapturedPhoto(null)} />
				) : (selectedOption === "scan") ? (
					<SafeAreaView className="bg-[#F7F4EA] w-full justify-center flex-1 relative">
						<Animated.View
							className="w-full"
							style={[{
								position: 'absolute',
								height: screenHeight,
								top: 0,
								left: 0,
								right: 0,
								backgroundColor: '#F7F4EA',
								transform: [{ translateY: slideAnim }],
								zIndex: 10,
								overflow: 'hidden'
							},
							slideStyle
						]}
						>
							<View className="mb-2 z-[0] w-full absolute h-full pb-2">
								<Settings onClose={() => { hideSettings(); }} />
							</View>
							<View className="bg-[#B87C4C] flex-1 w-full absolute h-full rounded-2xl z-[-20]"></View>
						</Animated.View>
						<View className="bg-[#F7F4EA] w-full justify-center px-5 flex-1 relative">
							<View className="rounded-3xl overflow-hidden flex-1 border-[#B87C4C] border-4">
								{
									showCamera && <CameraView ref={cameraRef} style={styles.cameraStyle} facing={facing} />
								}
							</View>
							<TouchableOpacity onPress={showSettings} className="absolute bg-[#F7F4EA] rounded-full p-2 self-center top-8 border-2 border-[#B87C4C]">
								<Users size={32} color="#B87C4C"></Users>
							</TouchableOpacity>
						</View>
					</SafeAreaView>
				) : (
					<SearchScreen onClose={() => {}}></SearchScreen>
				)
			}
			{ selectedOption === "scan" && !capturedPhoto && !settingOpen &&
				<>
					<TouchableOpacity onPress={handleTakePhoto} className="absolute z-[0] self-center bottom-44 bg-[#B87C4C] rounded-full p-4 border-4 border-[#F7F4EA]">
						<Camera size={32} color="#F7F4EA" />
					</TouchableOpacity>
					<View className="absolute self-center bottom-24 flex flex-row rounded-full bg-[#B87C4C] justify-center items-center p-2">
					<View className="bg-[#F7F4EA] rounded-full px-4 py-2">
						<View className="flex flex-row items-center justify-center gap-2">
							<Scan className='text-[#B87C4C]' size={24} color="#B87C4C"/>
							<Text className='font-bold text-2xl m-0 text-[#B87C4C]'>Scan</Text>
						</View>
					</View>
					<TouchableOpacity onPress={handlePress}>
						<View className="bg-transparent z-[0] rounded-full px-4 py-2">
							<View className="flex flex-row items-center justify-center gap-2">
								<Search className='text-[#F7F4EA]' size={24} color="#F7F4EA"/>
								<Text className='font-bold text-2xl m-0 text-[#F7F4EA]'>Search</Text>
							</View>
						</View>
					</TouchableOpacity>
					</View>
				</>
			}
			{ selectedOption === "search" && !capturedPhoto && !settingOpen &&
				<View className="z-[0] absolute self-center bottom-24 flex flex-row rounded-full bg-[#B87C4C] justify-center items-center p-2">
					<TouchableOpacity onPress={handlePress}>
						<View className="bg-transparent rounded-full px-4 py-2">
							<View className="flex flex-row items-center justify-center gap-2">
								<Scan className='text-[#F7F4EA]' size={24} color="#F7F4EA"/>
								<Text className='font-bold text-2xl m-0 text-[#F7F4EA]'>Scan</Text>
							</View>
						</View>
					</TouchableOpacity>
					<View className="z-[0] bg-[#F7F4EA] rounded-full px-4 py-2">
						<View className="flex flex-row items-center justify-center gap-2">
							<Search className='text-[#B87C4C]' size={24} color="#B87C4C"/>
							<Text className='font-bold text-2xl m-0 text-[#B87C4C]'>Search</Text>
						</View>
					</View>
				</View>
			}
		</>
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
	cameraStyle:{
		flex: 1,
		zIndex: 5
	},
});
