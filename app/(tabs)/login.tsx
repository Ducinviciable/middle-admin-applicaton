import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    console.log('Login:', { email, password });
  };

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="px-8 pb-8 pt-[63px]">
        <Text className="mb-10 text-[50px] font-bold leading-[58px] text-black">
          Welcome{'\n'}Back!
        </Text>

        <View className="gap-8">
          <View className="h-[55px] flex-row items-center rounded-[10px] border border-[#A8A8A9] bg-[#F3F3F3] px-3">
            <FontAwesome
              name="user"
              size={18}
              color="#676767"
              style={{ marginRight: 10, width: 20, textAlign: 'center' }}
            />
            <TextInput
              className="flex-1 text-xs font-medium text-[#676767]"
              placeholder="Username or Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#676767"
            />
          </View>

          <View>
            <View className="h-[55px] flex-row items-center rounded-[10px] border border-[#A8A8A9] bg-[#F3F3F3] px-3">
              <FontAwesome5
                name="lock"
                size={16}
                color="#676767"
                style={{ marginRight: 10, width: 20, textAlign: 'center' }}
              />
              <TextInput
                className="flex-1 text-xs font-medium text-[#676767]"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#676767"
              />
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#676767"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="mt-2 items-end">
              <Text className="text-xs text-[#F83758]">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          className="mt-9 h-[55px] items-center justify-center rounded bg-[#F83758]"
          onPress={handleLogin}>
          <Text className="text-[24px] font-semibold text-white">Login</Text>
        </TouchableOpacity>

        <View className="mt-[75px] items-center">
          <Text className="text-md mb-5 font-medium text-[#575757]">- OR Continue with -</Text>
          <View className="flex-row gap-[10px]">
            <TouchableOpacity className="h-[54px] w-[54px] items-center justify-center rounded-full border border-[#F83758] bg-[#FCF3F6]">
              <FontAwesome name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity className="h-[54px] w-[54px] items-center justify-center rounded-full border border-[#F83758] bg-[#FCF3F6]">
              <FontAwesome name="apple" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity className="h-[54px] w-[54px] items-center justify-center rounded-full border border-[#F83758] bg-[#FCF3F6]">
              <FontAwesome name="facebook" size={24} color="#3b5998" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-12 flex-row items-center justify-center">
          <Text className="text-[20px] text-[#575757]">Create An Account </Text>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text className="text-[21px] font-semibold text-[#F83758] underline">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
