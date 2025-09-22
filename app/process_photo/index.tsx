
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CurrentUser from '../../model/CurrentUser';
import DetailBox from '../../components/DetailBox';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';

interface ProcessPhotoProps {
	uri: string | null;
	onBack: () => void;
}

export interface OcrProduct {
	product_name: string;
	sim: number;
}

export default function ProcessPhoto({ uri, onBack }: ProcessPhotoProps) {
	const router = useRouter();
	const [analysis, setAnalysis] = useState(null);
	const [productName, setProductName] = useState("");

	//intermediate steps:
	//1. process data using the api idk.
	//2. find the object, highlight the object
	//3. and then get the product from the db
	//4. analyze the product's ingredients, match with (current routine, current skin_condition)
	//5. fetch to aws gpt
	//6. get answer

	{/*
		format:
	{
		type: "what kind of skincare is this",
		match_percentage: "match percentage",
		harmful_ingredients: "harmful ingredients"
	}
	*/}

	const processPhoto = async () => {
		const processImg2Text = async () => {
			console.log("uri: "+ uri);
			const base64Img = await FileSystem.readAsStringAsync(uri!, {
				encoding: FileSystem.EncodingType.Base64,
			});

			const response = await fetch(`/api/ocr`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					base64Img: base64Img,
				})
			});

			const data = await response.json();
			const temp: OcrProduct[] = data.simProducts;
			const detectedProductName = temp[0].product_name; // Get the actual value
			setProductName(detectedProductName); // Update state for UI
			return detectedProductName; // Return the value for immediate use
		}


		const fetchIngredients = async (productName: string) => {
			console.log("FETCH INGREDIENTS:\n");
			const response = await fetch(`/api/ingredient?product_name=${productName}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			
			const data = await response.json();

			const temp: string[] = data;
			console.log(temp);
			return temp;
		};

		const fetchPersonalDetails = async () => {
			console.log("FETCH PERSONAL DETAILS:\n");
			const userId = CurrentUser.getInstance().getId();
			const response = await fetch(`/api/personalDetails?user_id=${userId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			const data = await response.json();
			console.log(data.task.rows[0]);
			return data.task.rows[0];
		};

		const fetchAnalysis = async (ingredients: string[], personalDetails: any) => {
			console.log("FETCH ANALYSUIS:\n");
			const response = await fetch('/api/analyzeProduct', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					ingredients: ingredients,
					personalDetails: personalDetails
				})
			});

			const data = await response.json();

			console.log(data.analysis);
			setAnalysis(data.analysis);
		};

		//process image
		const detectedProductName = await processImg2Text();
		console.log("GET PRODUCT NAME: " + detectedProductName);

		//get the name of the product from the db (if not exist then idk...)

		//here assuming it always exist in the db
		//got the product name and ingredients
		try {
			const ingredients = await fetchIngredients(detectedProductName);
			const details = await fetchPersonalDetails();
			if (ingredients && details) {
				await fetchAnalysis(ingredients, details);
			} else {
				console.warn("Missing ingredients or personal details");
			}
		} catch (error) {
			console.error("Error in processPhoto:", error);
		}
	}

	useEffect(() => {
		processPhoto();
	}, []);

	return (
		<SafeAreaView className="bg-[#F7F4EA] w-full justify-center flex-1 relative">
			<View className="bg-[#F7F4EA] w-full justify-center px-5 flex-1 relative">
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

			{ analysis != null &&
			<TouchableOpacity className="absolute right-5 top-1/2 w-4/5" onPress={() => {router.push({
				pathname: '/product_analysis',
				params: {
					productName,
					analysis: JSON.stringify(analysis),
				},
				})}}>
				<View>
					<DetailBox
						productName={productName}
						analysis={analysis}
					/>
				</View>
			</TouchableOpacity>
			}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
});

