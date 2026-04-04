import type { Product } from '@/src/types/product';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const [products] = useState<Product[]>([]);

  return (
    <ScrollView className="mt-10 flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white p-4">
        <Text className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</Text>

        <Link href="/add" asChild>
          <TouchableOpacity className="rounded-xl bg-blue-600 px-5 py-2.5">
            <Text className="font-semibold text-white">+ Thêm mới</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.idsanpham}
        renderItem={({ item }) => (
          <View className="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold">{item.tensanpham}</Text>
            <Text className="text-gray-500">{item.loaisanpham}</Text>
            <Text className="mt-1 font-medium text-green-600">
              {item.gia.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View className="mt-20 flex-1 items-center justify-center">
            <Text className="text-lg text-gray-400">Chưa có sản phẩm nào</Text>
            
            <Link href="/add" asChild>
              <TouchableOpacity className="mt-6 rounded-xl bg-blue-600 px-8 py-3">
                <Text className="font-medium text-white">Thêm sản phẩm đầu tiên</Text>
              </TouchableOpacity>
            </Link>
          </View>
        }
      />
    </ScrollView>
  );
}