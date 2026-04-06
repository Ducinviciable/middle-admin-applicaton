# Middle Admin Application

Ứng dụng quản trị sản phẩm xây dựng bằng Expo Router + React Native + Firebase.

Mục tiêu chính:

- Quản lý sản phẩm theo thời gian thực.
- Quản lý danh mục ngay trong luồng tạo/sửa sản phẩm.
- Xử lý xác thực admin bằng email/password.
- Upload ảnh sản phẩm lên Firebase Storage.

## 1. Tổng quan chức năng

### 1.1 Xác thực

- Đăng ký tài khoản với email/password.
- Đăng nhập.
- Đăng xuất.
- Route guard ở root layout:
	- Chưa đăng nhập chỉ được vào màn hình auth.
	- Đã đăng nhập sẽ được chuyển thẳng vào khu vực tabs.

### 1.2 Quản lý sản phẩm

- Xem danh sách sản phẩm realtime.
- Tìm kiếm theo tên sản phẩm hoặc loại sản phẩm.
- Thêm sản phẩm mới.
- Sửa sản phẩm hiện có (tên, loại, giá, ảnh).
- Xóa sản phẩm với hộp thoại xác nhận.

### 1.3 Quản lý danh mục

- Lấy danh mục realtime từ Firestore.
- Chọn danh mục trong modal dạng bottom-sheet.
- Tạo danh mục mới ngay khi thêm/sửa sản phẩm.
- Chống trùng danh mục không phân biệt chữ hoa/thường.

### 1.4 Quản lý ảnh

- Chọn ảnh từ thư viện thiết bị.
- Upload ảnh lên Firebase Storage.
- Nhận download URL để lưu vào Firestore.

## 2. Công nghệ và thư viện

- Expo SDK 54
- React Native 0.81
- React 19
- Expo Router 6 (file-based routing)
- Firebase 12
	- Authentication
	- Firestore
	- Storage
- NativeWind + Tailwind CSS
- TypeScript

## 3. Kiến trúc ứng dụng

Ứng dụng tổ chức theo hướng tách lớp rõ ràng:

- UI Layer: màn hình và component ở app/, src/components/
- State/Subscription Layer: hooks ở src/hooks/
- Data Access Layer: service thao tác Firebase ở src/services/
- Platform Layer: firebase init ở src/lib/firebase.ts
- Type Layer: model/type ở src/types/

Luồng tổng quát:

1. Screen gọi hook hoặc service.
2. Service truy cập Firebase.
3. Hook lắng nghe realtime bằng onSnapshot.
4. Firestore thay đổi -> hook cập nhật state -> UI tự render lại.

## 4. Cấu trúc thư mục chi tiết

```text
app/
	_layout.tsx
	login.tsx
	resgister.tsx
	(tabs)/
		_layout.tsx
		index.tsx
		add.tsx
		profile.tsx

src/
	components/
		ProductForm.tsx
		CategorySelectionModal.tsx
		AddCategoryModal.tsx
		...
	hooks/
		useProduct.ts
		useCategory.ts
		...
	services/
		user.service.ts
		product.service.ts
		category.service.ts
		upload.service.ts
	lib/
		firebase.ts
	types/
		product.ts
```

Giải thích nhanh:

- app/_layout.tsx: root navigator + auth guard.
- app/login.tsx: đăng nhập.
- app/resgister.tsx: đăng ký (đang dùng route với tên file resgister).
- app/(tabs)/index.tsx: danh sách, tìm kiếm, sửa, xóa sản phẩm.
- app/(tabs)/add.tsx: thêm sản phẩm mới.
- app/(tabs)/profile.tsx: thông tin user + đăng xuất.
- src/services/*: gom toàn bộ thao tác Firebase để UI không gọi SDK trực tiếp.
- src/hooks/*: dữ liệu realtime và refresh logic dùng lại giữa các màn.

## 5. Điều hướng và phân quyền

### 5.1 Root Stack

Khai báo 3 nhóm route chính:

- login
- resgister
- (tabs)

### 5.2 Logic guard

Trong app/_layout.tsx:

- Dùng onAuthStateChanged(auth, cb) để theo dõi session.
- Chờ authChecked trước khi render stack.
- Kiểm tra segment hiện tại:
	- Nếu chưa đăng nhập và không ở login/resgister -> router.replace('/login').
	- Nếu đã đăng nhập nhưng đang ở login/resgister -> router.replace('/(tabs)').

### 5.3 Bottom Tabs

3 tab chính:

- Home (index)
- Add (add)
- Profile (profile)

## 6. Luồng nghiệp vụ chi tiết

### 6.1 Đăng ký

1. User nhập email/password/confirm password.
2. Validate client:
	 - Không để trống.
	 - Password tối thiểu 6 ký tự.
	 - Password và confirm phải khớp.
3. Gọi userService.register().
4. Thành công: chuyển vào /(tabs).
5. Thất bại: map mã lỗi Firebase sang thông báo tiếng Việt.

### 6.2 Đăng nhập

1. User nhập email/password.
2. Validate không rỗng.
3. Gọi userService.login().
4. Thành công: chuyển vào /(tabs).
5. Thất bại: hiển thị lỗi thân thiện bằng getLoginErrorMessage().

### 6.3 Hiển thị danh sách sản phẩm

1. index.tsx gọi useProduct().
2. useProduct subscribe onSnapshot(collection('products')).
3. Mỗi lần snapshot mới:
	 - map doc -> Product
	 - setProducts()
4. UI render danh sách dạng 2 cột.

### 6.4 Tìm kiếm sản phẩm

1. Người dùng nhập từ khóa vào TextInput.
2. useMemo filter theo:
	 - tensanpham
	 - loaisanpham
3. So khớp không phân biệt hoa thường.

### 6.5 Thêm sản phẩm

1. Điền tên, loại, giá ở màn Add.
2. Chọn loại từ modal hoặc tạo loại mới.
3. Chọn ảnh từ thư viện (tùy chọn).
4. Validate:
	 - tên không rỗng
	 - loại không rỗng
	 - giá là số hợp lệ và >= 0
5. Nếu có ảnh:
	 - upload lên Storage
	 - lấy URL
6. Gọi productService.addProduct() lưu vào Firestore.
7. Quay lại màn trước sau khi thêm thành công.

### 6.6 Sửa sản phẩm

1. Bấm nút Sửa trong item.
2. Mở modal với dữ liệu cũ.
3. Có thể đổi danh mục và chọn ảnh mới.
4. Validate tương tự thêm sản phẩm.
5. Nếu có ảnh mới thì upload trước.
6. Gọi productService.updateProduct(id, payload).
7. Danh sách tự cập nhật nhờ onSnapshot.

### 6.7 Xóa sản phẩm

1. Bấm nút Xóa.
2. Alert xác nhận.
3. Gọi productService.deleteProduct(id).
4. Dữ liệu biến mất realtime trên UI.

### 6.8 Thêm danh mục mới

1. Trong modal chọn danh mục, bấm Thêm danh mục mới.
2. Nhập tên danh mục.
3. categoryService.addCategory() kiểm tra trùng trước khi add.
4. Thành công: tự điền danh mục vừa tạo vào form.

### 6.9 Đăng xuất

1. Tại Profile bấm Đăng xuất.
2. userService.logout().
3. Auth state về null.
4. Guard tự chuyển về /login.

## 7. Dữ liệu và schema

### 7.1 Product

```ts
export interface Product {
	idsanpham: string;
	tensanpham: string;
	loaisanpham: string;
	gia: number;
	hinhanh?: string;
}
```

### 7.2 Category

```ts
{
	name: string;
	createdAt: Date;
}
```

### 7.3 Collections đang dùng

- products
- categories

## 8. Service layer

### 8.1 user.service.ts

- login(email, password)
- register(email, password)
- logout()
- getCurrentUserName()
- getLoginErrorMessage(code)
- getRegisterErrorMessage(code)

### 8.2 product.service.ts

- getAllProducts()
- addProduct(product)
- updateProduct(id, product)
- deleteProduct(id)

### 8.3 category.service.ts

- getAllCategories()
- addCategory(name) với kiểm tra trùng.

### 8.4 upload.service.ts

- pickImage()
- uploadImageToFirebase(uri)

## 9. Realtime hooks

### 9.1 useProduct

- onSnapshot products
- đồng bộ loading state
- cleanup unsubscribe khi unmount

### 9.2 useCategory

- onSnapshot categories (orderBy name asc)
- có refreshCategories() để làm mới thủ công trước khi mở modal

## 10. Validation và xử lý lỗi

Đang được triển khai ở tầng UI + service:

- Bắt lỗi nhập thiếu trường bắt buộc.
- Bắt lỗi giá âm hoặc không phải số.
- Bắt lỗi xác thực Firebase và map thông báo dễ hiểu.
- Bắt lỗi upload ảnh.
- Bắt lỗi thêm trùng danh mục.

Các lỗi được phản hồi qua Alert để user nhận biết ngay.

## 11. Hướng dẫn cài đặt và chạy

### 11.1 Cài dependency

```bash
npm install
```

### 11.2 Chạy app

```bash
npm run start
```

Lệnh khác:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

## 12. Cấu hình Firebase

File cấu hình hiện tại: src/lib/firebase.ts.

Đã khởi tạo:

- getAuth
- getFirestore
- getStorage

Khuyến nghị khi đưa production:

- Đưa config sang biến môi trường theo từng môi trường dev/staging/prod.
- Viết Security Rules giới hạn read/write theo user role.
- Thêm monitoring lỗi và log tập trung.

