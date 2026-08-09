<script>
	export default {
		globalData: {
			userInfo: null,
			loginMethod: '',
			wechatUserInfo: null
		},
		onLaunch: function() {
			const user = uni.getStorageSync('userInfo')
			if (user) {
				this.globalData.userInfo = user
				this.globalData.loginMethod = uni.getStorageSync('loginMethod') || ''
			} else {
				// 未登录，跳转到登录页
				uni.reLaunch({ url: '/pages/login/login' })
			}
			// RemixIcon 字体已通过 static/remixicon.css 中 @font-face 的 base64 data URI 内联加载
			// （小程序 wxss 不支持本地路径，uni.loadFontFace 也不支持本地路径）
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			setLogin(user, method) {
				this.globalData.userInfo = user
				this.globalData.loginMethod = method
				uni.setStorageSync('userInfo', user)
				uni.setStorageSync('loginMethod', method)
			},
			setWechatUserInfo(info) {
				this.globalData.wechatUserInfo = info
				uni.setStorageSync('wechatUserInfo', info)
			},
			logout() {
				this.globalData.userInfo = null
				this.globalData.loginMethod = ''
				this.globalData.wechatUserInfo = null
				uni.removeStorageSync('userInfo')
				uni.removeStorageSync('loginMethod')
				uni.removeStorageSync('wechatUserInfo')
				uni.removeStorageSync('wechatOpenId')
				uni.removeStorageSync('wechatCode')
				uni.removeStorageSync('token')
			}
		}
	}
</script>

<style lang="scss">
	@import './uni.scss';
	@import './static/remixicon.css';

	/* 全局页面居中 - 响应式设计
	   原则：page-wrap 铺满全宽（width:100%），配合内部左右对称 padding 实现
	   移动端左右留白均衡；在宽屏（H5）下以 750px 上限水平居中。
	   注意：max-width 用 px 而非 rpx——小程序中 750rpx 恒等于屏宽会导致限制失效 */
	page {
		background-color: $background;
		font-family: $body-font;
		color: $on-surface;
		min-height: 100vh;
		width: 100%;
		overflow-x: hidden;
	}

	/* ============ 全站通用居中容器 ============ */
	.page-wrap {
		width: 100%;
		max-width: 640px;
		margin: 0 auto;
		position: relative;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	/* 统一 box-sizing：防止 scroll-view / view 在 content-box 下
	   因 width:100% + padding 导致实际宽度超出屏幕，右侧内容被裁切（整体偏右） */
	view,
	scroll-view,
	text,
	textarea,
	input,
	button,
	image {
		box-sizing: border-box;
	}

	.section-label-chip {
		display: inline-block;
		padding: 8rpx 20rpx;
		background: rgba(0, 61, 166, 0.1);
		border-radius: 20rpx;
		font-size: 20rpx;
		font-weight: 600;
		color: $primary-color;
		letter-spacing: 2rpx;
		text-transform: uppercase;
	}

	.btn-primary {
		background: linear-gradient(135deg, $primary-color 0%, $primary-container 100%);
		color: $on-primary;
		border: none;
		border-radius: 20rpx;
		font-weight: 600;
		padding: 28rpx 48rpx;
		box-shadow: 0 8rpx 24rpx rgba(0, 61, 166, 0.3);
	}

	.btn-primary:active {
		transform: scale(0.98);
	}

	.glass-header {
		background: rgba(255, 255, 255, 0.85);
		backdrop-filter: blur(20px);
		position: sticky;
		top: 0;
		z-index: 50;
	}

	.editorial-shadow {
		box-shadow: 0 16rpx 64rpx -12rpx rgba(25, 27, 35, 0.06);
	}

	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(30rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.slide-up {
		animation: slide-up 0.4s ease-out;
	}
</style>