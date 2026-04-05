import { userService } from '@/src/services/user.service';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const currentUserName = userService.getCurrentUserName();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoading(true);
            await userService.logout();
          } catch (error) {
            console.error('Error signing out:', error);
            Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-12">
      <View className="items-center rounded-2xl bg-white p-6 shadow-sm">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <FontAwesome name="user" size={34} color="#2563eb" />
        </View>

        <Text className="text-2xl font-bold text-gray-800">{currentUserName}</Text>
        <Text className="mt-1 text-gray-500">Khu vực quản trị sản phẩm</Text>

        <TouchableOpacity
          className={`mt-6 w-full rounded-xl py-3 ${loading ? 'bg-gray-400' : 'bg-red-500'}`}
          onPress={handleLogout}
          disabled={loading}
        >
          <Text className="text-center font-semibold text-white">
            {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
