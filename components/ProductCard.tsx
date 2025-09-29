import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProductCardProps {
    productImage: string;
    productName: string;
    similarPercentage: string; 
    matchPercentage: string;   
    productType: string;       
}

const ProductCard: React.FC<ProductCardProps> = ({
    productImage,
    productName,
    similarPercentage,
    matchPercentage,
    productType,
}) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: productImage }} style={styles.image} />
            <View style={styles.descriptionContainer}>
                {/* <Text style={styles.productName}>{productName}</Text> */}
                <Text 
                    style={styles.productName} 
                    numberOfLines={1} 
                    ellipsizeMode="tail" // Use "tail" to truncate at the end
                >{productName}</Text>
                <Text style={styles.similarity}>
                        {similarPercentage}% similar
                </Text>
                <View style={styles.detail}>
                    <Text style={styles.match}>
                        {matchPercentage}% Match
                    </Text>
                    <Text style={styles.productType}>{productType}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#996032', // Card background color
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row', // Arrange items in a row
        alignItems: 'center', // Center items vertically
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.7,
        // shadowRadius: 4,
        // elevation: 5,
        // iOS shadow properties
        shadowColor: '#000000', // Black color for the shadow
        shadowOffset: {
            width: 0, // X offset
            height: 4, // Y offset
        },
        shadowOpacity: 0.4, // Shadow opacity
        shadowRadius: 4, // Shadow blur radius
        // Android elevation property
        elevation: 4, // Elevation for Android shadow

    },
    image: {
        width: 100,
        height: 100,
        marginRight: 16, // Space between image and text
        borderRadius: 16,
    },
    descriptionContainer: {
        flex: 1, // Take remaining space
    },
    detail: {
        flexDirection: 'row',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
        overflow: 'hidden',
    },
    similarity: {
        width: '100%',
        height: 42,
        backgroundColor: '#B76AB0',
        fontSize: 12,
        borderRadius: 999,
        paddingVertical: 5, // Add padding for better appearance
        textAlign: 'center', // Center the text
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        borderColor: '#B87C4C',
        borderWidth: 2,
        paddingTop: 10,
        marginBottom: 10,
    },
    match: {
        fontSize: 10,
        backgroundColor: '#6AB778',
        borderRadius: 999,
        paddingVertical: 5, 
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        borderColor: '#B87C4C',
        borderWidth: 2,
        width: '47%',
    },
    productType: {
        fontSize: 10,
        backgroundColor: '#6A7CB7', 
        borderRadius: 999,
        paddingVertical: 5, 
        textAlign: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        borderColor: '#B87C4C',
        borderWidth: 2,
        width: '47%',
        marginLeft: 10,
    },
    text: {
        color: 'white',
        fontWeight: 'semibold'
    }
});

export default ProductCard;