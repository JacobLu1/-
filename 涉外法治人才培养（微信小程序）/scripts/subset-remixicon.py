# -*- coding: utf-8 -*-
"""
子集化 RemixIcon 字体并内联为 base64 到 remixicon.css

背景：微信小程序 wxss 的 @font-face 不支持本地文件路径
（错误：do-not-use-local-path），uni.loadFontFace 也不支持本地路径。
正确做法：将字体子集化后以 base64 data URI 内联到 wxss。

用法：python scripts/subset-remixicon.py
依赖：fonttools（pip install fonttools）
"""
import base64
import re
from pathlib import Path

from fontTools.subset import Subsetter, Options
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC_TTF = ROOT / 'static' / 'remixicon.ttf'
CSS_PATH = ROOT / 'static' / 'remixicon.css'
SUBSET_TTF = ROOT / 'static' / 'remixicon.subset.ttf'


def extract_codepoints(css_text):
    """从 css 中提取所有 content: "\\XXXX" 的码点（16 进制）"""
    cps = set()
    for m in re.finditer(r'content:\s*"\\([0-9A-Fa-f]+)"', css_text):
        cps.add(int(m.group(1), 16))
    # 必含空格，避免渲染层告警
    cps.add(0x20)
    return sorted(cps)


def subset_font(codepoints):
    """用 fontTools API 生成子集 ttf"""
    print('Subsetting font...')
    font = TTFont(SRC_TTF)

    # 校验源字体是否包含所需码点，避免缺失导致子集化失败
    cmap = font.getBestCmap()
    missing = [cp for cp in codepoints if cp not in cmap]
    if missing:
        print(f'Warning: {len(missing)} codepoints not in source font: '
              f'{[hex(cp) for cp in missing[:10]]}{"..." if len(missing) > 10 else ""}')
        codepoints = [cp for cp in codepoints if cp in cmap]

    options = Options()
    options.hinting = False
    options.desubroutinize = True
    options.layout_features = ['*']
    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=codepoints)
    subsetter.subset(font)
    font.save(str(SUBSET_TTF))
    return SUBSET_TTF


def build_css(css_text, b64):
    """替换 @font-face 的 src 为 base64 data URI"""
    data_uri = f'url(data:font/truetype;base64,{b64}) format("truetype")'
    new_face = (
        '@font-face {\n'
        '  font-family: \'remixicon\';\n'
        f'  src: {data_uri};\n'
        '  font-display: swap;\n'
        '}'
    )
    # 替换原 @font-face 块（从 @font-face 到第一个 } 结束）
    css_text = re.sub(
        r'@font-face\s*\{[^}]*\}',
        new_face,
        css_text,
        count=1,
    )
    return css_text


def main():
    css_text = CSS_PATH.read_text(encoding='utf-8')
    cps = extract_codepoints(css_text)
    print(f'Extracted {len(cps)} codepoints')

    subset_font(cps)
    src_size = SRC_TTF.stat().st_size
    sub_size = SUBSET_TTF.stat().st_size
    print(f'Source ttf: {src_size} bytes')
    print(f'Subset ttf: {sub_size} bytes ({sub_size * 100 / src_size:.1f}%)')

    b64 = base64.b64encode(SUBSET_TTF.read_bytes()).decode('ascii')
    print(f'Base64 length: {len(b64)} chars')

    new_css = build_css(css_text, b64)
    CSS_PATH.write_text(new_css, encoding='utf-8')
    print(f'Updated {CSS_PATH}')

    # 清理临时子集文件
    SUBSET_TTF.unlink()
    print('Done.')


if __name__ == '__main__':
    main()
