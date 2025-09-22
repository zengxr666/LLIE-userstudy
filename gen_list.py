import os
import json

# --- 配置 ---
# 选择一个基准文件夹来扫描图像文件。
# 我们假设所有其他方法文件夹 (b, c, d) 都有相同的图像文件。
BASE_IMAGE_FOLDER = 'imgs/A'

# 输出的清单文件名
OUTPUT_FILE = 'imagelist.json'

# 你想要包含的图片文件后缀名 (小写)
ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp']

# --- 脚本 ---
def create_image_list():
    """扫描文件夹，过滤图片，并生成JSON清单文件。"""
    try:
        # 获取文件夹下所有文件名
        all_files = os.listdir(BASE_IMAGE_FOLDER)
        
        # 过滤出我们想要的图片文件，并排除隐藏文件（如 .DS_Store）
        image_files = sorted([
            f for f in all_files 
            if not f.startswith('.') and os.path.splitext(f)[1].lower() in ALLOWED_EXTENSIONS
        ])
        
        # 将文件列表写入JSON文件
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(image_files, f, indent=2)
            
        print(f"成功! 找到了 {len(image_files)} 张图片。")
        print(f"清单文件 '{OUTPUT_FILE}' 已成功创建/更新。")

    except FileNotFoundError:
        print(f"错误: 文件夹 '{BASE_IMAGE_FOLDER}' 未找到。")
        print("请确保你的文件夹结构正确，并且已经运行在项目的根目录。")
    except Exception as e:
        print(f"发生了一个错误: {e}")

if __name__ == '__main__':
    create_image_list()