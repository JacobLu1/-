// 生成 TabBar PNG 图标（基于 RemixIcon SVG）
// 用法：node scripts/gen-tab-icons.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICONS = [
  { name: 'learn', svg: 'node_modules/remixicon/icons/Document/file-list-3-line.svg', svgFill: 'node_modules/remixicon/icons/Document/file-list-3-fill.svg' },
  { name: 'data', svg: 'node_modules/remixicon/icons/Business/bar-chart-2-line.svg', svgFill: 'node_modules/remixicon/icons/Business/bar-chart-2-fill.svg' },
  { name: 'profile', svg: 'node_modules/remixicon/icons/User & Faces/user-3-line.svg', svgFill: 'node_modules/remixicon/icons/User & Faces/user-3-fill.svg' },
];

const SIZE = 81; // 微信小程序 tabBar 推荐 81x81 px（@3x）
const OUT_DIR = 'static/tab';
const COLOR_NORMAL = '#7A92B0';
const COLOR_ACTIVE = '#2E7BE0';

async function generate() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const icon of ICONS) {
    // 普通态：线性图标，灰色
    const svgNormal = fs.readFileSync(icon.svg, 'utf-8')
      .replace(/currentColor/g, COLOR_NORMAL);
    await sharp(Buffer.from(svgNormal))
      .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(OUT_DIR, `${icon.name}.png`));
    console.log(`✓ ${icon.name}.png`);

    // 选中态：填充图标，主题色
    const svgActive = fs.readFileSync(icon.svgFill, 'utf-8')
      .replace(/currentColor/g, COLOR_ACTIVE);
    await sharp(Buffer.from(svgActive))
      .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(OUT_DIR, `${icon.name}-active.png`));
    console.log(`✓ ${icon.name}-active.png`);
  }
  console.log('Done!');
}

generate().catch(e => { console.error(e); process.exit(1); });
