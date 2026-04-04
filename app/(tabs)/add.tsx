import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function AddProductScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6">
      <Text className="mb-3 text-2xl font-bold text-gray-800">Thêm sản phẩm</Text>
      <Text className="mb-8 text-center text-gray-500">
        Route /add đã tồn tại, nên Link href này sẽ không còn lỗi nữa.
      </Text>

      <Link href="/(tabs)" asChild>
        <TouchableOpacity className="rounded-xl bg-blue-600 px-6 py-3">
          <Text className="font-semibold text-white">Quay lại danh sách</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
