import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const userService = {
	async login(email: string, password: string): Promise<void> {
		await signInWithEmailAndPassword(auth, email.trim(), password);
	},

	async register(email: string, password: string): Promise<void> {
		await createUserWithEmailAndPassword(auth, email.trim(), password);
	},

	async logout(): Promise<void> {
		await signOut(auth);
	},

	getCurrentUser() {
		return auth.currentUser;
	},

	getCurrentUserName(): string {
		const user = auth.currentUser;
		if (!user) {
			return 'Unknown';
		}

		if (user.displayName && user.displayName.trim()) {
			return user.displayName;
		}

		if (user.email) {
			return user.email;
		}

		return user.uid;
	},

	getLoginErrorMessage(errorCode?: string): string {
		switch (errorCode) {
			case 'auth/invalid-email':
				return 'Email không hợp lệ.';
			case 'auth/user-disabled':
				return 'Tài khoản đã bị vô hiệu hóa.';
			case 'auth/user-not-found':
				return 'Tài khoản không tồn tại.';
			case 'auth/wrong-password':
			case 'auth/invalid-credential':
				return 'Email hoặc mật khẩu không đúng.';
			case 'auth/too-many-requests':
				return 'Bạn thử sai quá nhiều lần. Vui lòng thử lại sau.';
			default:
				return 'Đăng nhập thất bại. Vui lòng thử lại.';
		}
	},

	getRegisterErrorMessage(errorCode?: string): string {
		switch (errorCode) {
			case 'auth/invalid-email':
				return 'Email không hợp lệ.';
			case 'auth/email-already-in-use':
				return 'Email này đã được đăng ký.';
			case 'auth/weak-password':
				return 'Mật khẩu quá yếu. Vui lòng dùng ít nhất 6 ký tự.';
			case 'auth/too-many-requests':
				return 'Bạn thao tác quá nhiều lần. Vui lòng thử lại sau.';
			default:
				return 'Đăng ký thất bại. Vui lòng thử lại.';
		}
	},
};
