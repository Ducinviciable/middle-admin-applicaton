import { userService } from '@/src/services/user.service';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      await userService.login(email, password);
      router.replace('/(tabs)');
      console.log('User logged in successfully');
    } catch (error) {
      const message = userService.getLoginErrorMessage((error as { code?: string })?.code);
      Alert.alert('Đăng nhập thất bại', message);
    } finally {
      setLoading(false);
    }
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
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
          </View>
        </View>

        <TouchableOpacity
          className={`mt-9 h-[55px] items-center justify-center rounded ${loading ? 'bg-[#f26f86]' : 'bg-[#F83758]'}`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-[24px] font-semibold text-white">{loading ? 'Đang đăng nhập...' : 'Login'}</Text>
        </TouchableOpacity>

        <View className="mt-10 flex-row items-center justify-center">
          <Text className="text-base text-[#575757]">Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/resgister')}>
            <Text className="text-base font-semibold text-[#F83758] underline">Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
