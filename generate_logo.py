#!/usr/bin/env python3
"""
AppliTrack Logo Generator
Creates modern, professional logos for the job tracker extension
"""

from PIL import Image, ImageDraw, ImageFont
import os
from pathlib import Path

# Create assets directory
assets_dir = Path("assets")
assets_dir.mkdir(exist_ok=True)

# Color scheme - Vibrant & Professional with Gradients
PRIMARY = (99, 102, 241)      # Indigo
ACCENT = (139, 92, 246)        # Purple
SECONDARY = (6, 182, 212)      # Cyan
SUCCESS = (34, 197, 94)        # Green
TEXT = (30, 41, 59)            # Slate
WHITE = (255, 255, 255)

def create_logo_with_briefcase():
    """Create main logo with briefcase and upward arrow icon"""
    # Create image with gradient background
    size = 512
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw gradient background (indigo to purple)
    for y in range(size):
        r = int(PRIMARY[0] + (ACCENT[0] - PRIMARY[0]) * y / size)
        g = int(PRIMARY[1] + (ACCENT[1] - PRIMARY[1]) * y / size)
        b = int(PRIMARY[2] + (ACCENT[2] - PRIMARY[2]) * y / size)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # Draw briefcase icon (simplified)
    briefcase_color = WHITE
    
    # Briefcase body
    x1, y1 = 140, 160
    x2, y2 = 372, 300
    
    # Draw briefcase outline
    draw.rectangle([x1, y1, x2, y2], outline=briefcase_color, width=8)
    
    # Briefcase handle
    handle_top = 120
    draw.arc([(x1 + 50, handle_top), (x2 - 50, y1)], 0, 180, fill=briefcase_color, width=8)
    
    # Briefcase latch
    draw.rectangle([256-15, y1-15, 256+15, y1+5], fill=briefcase_color)
    
    # Draw upward arrow inside/next to briefcase (growth indicator)
    arrow_x = 450
    arrow_y = 250
    arrow_size = 40
    
    # Arrow shaft
    draw.rectangle([arrow_x-8, arrow_y-arrow_size, arrow_x+8, arrow_y+arrow_size], fill=SUCCESS)
    
    # Arrow head
    points = [
        (arrow_x-20, arrow_y-arrow_size+30),
        (arrow_x, arrow_y-arrow_size-10),
        (arrow_x+20, arrow_y-arrow_size+30)
    ]
    draw.polygon(points, fill=SUCCESS)
    
    # Add small dots for data points
    for i in range(3):
        x = 180 + i * 60
        y = 230 + (i % 2) * 20
        draw.ellipse([x-8, y-8, x+8, y+8], fill=SECONDARY)
    
    img.save(assets_dir / "logo.png")
    print("✓ Logo (512x512) created: assets/logo.png")
    
    # Create favicon (128x128)
    favicon = img.resize((128, 128), Image.Resampling.LANCZOS)
    favicon.save(assets_dir / "favicon.png")
    print("✓ Favicon (128x128) created: assets/favicon.png")
    
    # Create small icon (64x64)
    small_icon = img.resize((64, 64), Image.Resampling.LANCZOS)
    small_icon.save(assets_dir / "icon-64.png")
    print("✓ Small icon (64x64) created: assets/icon-64.png")

def create_text_logo():
    """Create text-based logo with AppliTrack name"""
    size = 800
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Simple sans-serif text rendering
    text = "AppliTrack"
    
    # Try to use system fonts
    try:
        font = ImageFont.truetype("arial.ttf", 120)
        small_font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
        small_font = font
    
    # Draw main text
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (size - text_width) // 2
    y = 150
    
    draw.text((x, y), text, fill=PRIMARY, font=font)
    
    # Draw credit text
    credit = "A extension by Vedanshu Pandey"
    credit_bbox = draw.textbbox((0, 0), credit, font=small_font)
    credit_width = credit_bbox[2] - credit_bbox[0]
    credit_x = (size - credit_width) // 2
    credit_y = y + 150
    
    draw.text((credit_x, credit_y), credit, fill=(100, 100, 100), font=small_font)
    
    img.save(assets_dir / "applitrack-text.png")
    print("✓ Text logo created: assets/applitrack-text.png")
    
    # Create smaller version for sidebar
    small = img.resize((400, 200), Image.Resampling.LANCZOS)
    small.save(assets_dir / "applitrack-text-small.png")
    print("✓ Small text logo created: assets/applitrack-text-small.png")

def create_gradient_backgrounds():
    """Create gradient background presets"""
    # Hero gradient
    size = 1920
    hero = Image.new('RGB', (size, 512))
    draw = ImageDraw.Draw(hero)
    
    # Indigo to Purple gradient
    for x in range(size):
        r = int(PRIMARY[0] + (ACCENT[0] - PRIMARY[0]) * x / size)
        g = int(PRIMARY[1] + (ACCENT[1] - PRIMARY[1]) * x / size)
        b = int(PRIMARY[2] + (ACCENT[2] - PRIMARY[2]) * x / size)
        draw.line([(x, 0), (x, 512)], fill=(r, g, b))
    
    hero.save(assets_dir / "hero-gradient.png")
    print("✓ Hero gradient created: assets/hero-gradient.png")

def create_color_palette_reference():
    """Create a visual reference of the color palette"""
    colors = {
        "Primary": PRIMARY,
        "Accent": ACCENT,
        "Secondary": SECONDARY,
        "Success": SUCCESS,
        "Text": TEXT,
        "White": WHITE
    }
    
    size = 600
    img = Image.new('RGB', (size, 300), WHITE)
    draw = ImageDraw.Draw(img)
    
    col_width = size // len(colors)
    
    for idx, (name, color) in enumerate(colors.items()):
        x1 = idx * col_width
        x2 = x1 + col_width
        
        # Draw color block
        draw.rectangle([x1, 0, x2, 200], fill=color)
        
        # Draw text label
        try:
            font = ImageFont.truetype("arial.ttf", 16)
        except:
            font = ImageFont.load_default()
        
        text_color = WHITE if sum(color) < 384 else TEXT
        draw.text((x1 + 10, 210), name, fill=text_color, font=font)
        draw.text((x1 + 10, 240), f"RGB{color}", fill=TEXT, font=font)
    
    img.save(assets_dir / "color-palette.png")
    print("✓ Color palette reference created: assets/color-palette.png")

if __name__ == "__main__":
    print("🎨 Generating AppliTrack Logo Assets...\n")
    
    create_logo_with_briefcase()
    create_text_logo()
    create_gradient_backgrounds()
    create_color_palette_reference()
    
    print("\n✨ All assets generated successfully!")
    print(f"📁 Assets saved in: {assets_dir.absolute()}")
    
    # Print color scheme info
    print("\n🎨 Color Scheme:")
    print(f"  Primary (Indigo):    RGB{PRIMARY}")
    print(f"  Accent (Purple):     RGB{ACCENT}")
    print(f"  Secondary (Cyan):    RGB{SECONDARY}")
    print(f"  Success (Green):     RGB{SUCCESS}")
    print(f"  Text (Slate):        RGB{TEXT}")
