import { userService } from '@/src/services/user.service';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin đăng ký.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setLoading(true);
      await userService.register(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      const message = userService.getRegisterErrorMessage((error as { code?: string })?.code);
      Alert.alert('Đăng ký thất bại', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="px-8 pb-8 pt-[63px]">
        <Text className="mb-10 text-[50px] font-bold leading-[58px] text-black">
          Create{'\n'}Account
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
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#676767"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#676767"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className={`mt-9 h-[55px] items-center justify-center rounded ${loading ? 'bg-[#f26f86]' : 'bg-[#F83758]'}`}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-[24px] font-semibold text-white">{loading ? 'Đang đăng ký...' : 'Register'}</Text>
        </TouchableOpacity>

        <View className="mt-10 flex-row items-center justify-center">
          <Text className="text-base text-[#575757]">Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-base font-semibold text-[#F83758] underline">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
