import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View} from 'react-native';

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/signup');
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return <View />;
}
