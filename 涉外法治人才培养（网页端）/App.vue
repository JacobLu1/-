<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 公共CSS */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	page {
		background-color: #F7F8FA;
		font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
		font-size: 14px;
		color: #1A1A2E;
	}

	/* 主题色变量 */
	:root {
		--primary-color: #0A1F44;
		--primary-light: #1B3A6B;
		--accent-color: #2563EB;
		--accent-light: #3B82F6;
		--bg-color: #F7F8FA;
		--card-bg: #FFFFFF;
		--text-primary: #1A1A2E;
		--text-secondary: #6B7280;
		--text-light: #9CA3AF;
		--border-color: #E5E7EB;
		--success-color: #10B981;
		--warning-color: #F59E0B;
		--danger-color: #EF4444;
		--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
		--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
		--shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
		--radius-sm: 8px;
		--radius-md: 12px;
		--radius-lg: 16px;
	}

	/* 通用容器 */
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 24px;
	}

	/* 通用按钮样式 */
	.btn-primary {
		background: var(--primary-color);
		color: #FFFFFF;
		border: none;
		border-radius: var(--radius-sm);
		padding: 12px 24px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary:active {
		background: var(--primary-light);
	}

	.btn-outline {
		background: transparent;
		color: var(--primary-color);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-sm);
		padding: 12px 24px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	/* 卡片通用样式 */
	.card {
		background: var(--card-bg);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		border: 1px solid var(--border-color);
	}

	/* 标签通用样式 */
	.tag {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 12px;
		font-weight: 500;
	}

	.tag-success {
		background: rgba(16, 185, 129, 0.1);
		color: var(--success-color);
	}

	.tag-warning {
		background: rgba(245, 158, 11, 0.1);
		color: var(--warning-color);
	}

	.tag-danger {
		background: rgba(239, 68, 68, 0.1);
		color: var(--danger-color);
	}

	.tag-primary {
		background: rgba(37, 99, 235, 0.1);
		color: var(--accent-color);
	}
</style>
