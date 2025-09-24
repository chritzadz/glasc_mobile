import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";

import validation from "../../util/validation";
import { User } from "../../model/User";
import CurrentUser from "../../model/CurrentUser";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userExist = (users: User[]): User | null => {
    const found = users.find(
      (user: User) => user.email === email && user.password === password
    );
    return found ? found : null;
  };

  const handleLogInButton = async () => {
    if (!areFieldsFilled()) return;
    if (!isEmailValid()) return;

    setIsSubmitting(true);

    try {
      const currUser = await getUser();
      if (currUser) {
        await login(currUser);

        CurrentUser.getInstance().setId(currUser.id);

        Alert.alert("Success", "User successfully logged in");
        router.push("/scan");
      } else {
        setIsSubmitting(false);
        Alert.alert(
          "Error",
          "User not found. Please check your email and try again."
        );
      }
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert("Error", "Failed to log in. Please try again.");
      console.error("Login error:", error);
    }
  };

  const getUser = async (): Promise<User | null> => {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const users: User[] = data;

      return userExist(users); // Return the current user or null
    } catch (error) {
      Alert.alert("Error", "Failed to fetch users. Please try again later.");
      return null; // Return null in case of an error
    }
  };

  const areFieldsFilled = (): boolean => {
    if (!email || !password) {
      Alert.alert("Empty Field", "All field must be filled");
      return false;
    }
    return true;
  };

  const isEmailValid = (): boolean => {
    if (!validation.validateEmail(email)) {
      Alert.alert("Invalid Email", "Email format is invalid");
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView className="bg-[#B87C4C] flex-1 items-center">
      <Text className="px-7 mt-16 text-4xl text-center font-bold text-white">
        Log In
      </Text>
      <Text className="px-7 mt-2 text-2xl text-center text-white">
        Hello, welcome back!
      </Text>

      <View className="w-full items-center px-7 mt-10">
        <Text className="self-start text-white font-bold mb-2">
          Email Address
        </Text>
        <TextInput
          className="w-full h-12 px-3 my-1 text-lg border border-white rounded-lg mb-5 bg-white"
          placeholder="Enter Email"
          placeholderTextColor={"#6A7E97"}
          value={email}
          onChangeText={setEmail}
        />
        <Text className="self-start text-white font-bold mb-2">Password</Text>
        <TextInput
          className="w-full h-12 px-3 my-1 text-lg border border-white rounded-lg mb-5 bg-white"
          placeholder="Enter Password"
          placeholderTextColor={"#6A7E97"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <View className="w-full">
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fffff" />
          ) : (
            <Pressable
              onPress={handleLogInButton}
              className="mt-10 py-3 px-5 rounded-lg items-center bg-white"
            >
              <Text className="font-bold text-lg text-[#bf7641]">Log In</Text>
            </Pressable>
          )}
        </View>
        <Text className="mt-10 text-white text-center">
          Do not have an account?{" "}
          <Text
            onPress={() => router.push("/signup")}
            className="text-white underline font-bold"
          >
            Sign Up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;
