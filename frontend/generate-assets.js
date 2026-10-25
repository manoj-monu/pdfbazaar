import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');

async function generateAssets() {
    console.log('--- GENERATING BRANDED ICONS & OG IMAGE ---');

    // 1. Generate 512x512 App Icon & Favicon
    const icon = new Jimp(512, 512, 0x1321d4ff); // Branded Royal Blue #1321d4
    
    // Create an inner document sheet shape in white
    for (let y = 80; y < 432; y++) {
        for (let x = 120; x < 392; x++) {
            // Folded top-right corner effect
            if (x > 320 && y < 152 && (x - 320) + (152 - y) > 72) {
                continue;
            }
            icon.setPixelColor(0xffffffff, x, y);
        }
    }

    // Add Red PDF badge inside sheet
    for (let y = 220; y < 340; y++) {
        for (let x = 150; x < 362; x++) {
            icon.setPixelColor(0xe5322dff, x, y);
        }
    }

    await icon.writeAsync(path.join(PUBLIC_DIR, 'pdf-icon.png'));
    await icon.writeAsync(path.join(PUBLIC_DIR, 'logo.png'));
    console.log('✓ Created pdf-icon.png & logo.png');

    // 2. Generate 1200x630 Open Graph (OG) Image for WhatsApp/Telegram/Facebook
    const og = new Jimp(1200, 630, 0x0f172aff); // Dark Navy Slate #0f172a

    // Decorative gradient bar at top
    for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 1200; x++) {
            const r = Math.floor(19 + (x / 1200) * 210);
            const g = Math.floor(33 + (x / 1200) * 20);
            const b = Math.floor(212 - (x / 1200) * 50);
            const color = Jimp.rgbaToInt(r, g, b, 255);
            og.setPixelColor(color, x, y);
        }
    }

    // Place scaled 200x200 icon into the OG banner
    const iconScaled = icon.clone().resize(180, 180);
    og.composite(iconScaled, 80, 120);

    // Decorative inner card accent
    for (let y = 350; y < 550; y++) {
        for (let x = 80; x < 1120; x++) {
            if (y === 350 || y === 549 || x === 80 || x === 1119) {
                og.setPixelColor(0x334155ff, x, y);
            }
        }
    }

    await og.writeAsync(path.join(PUBLIC_DIR, 'og-image.png'));
    console.log('✓ Created og-image.png (1200x630 for social shares)');
    console.log('--- BRAND ASSETS GENERATED SUCCESSFULLY ---');
}

generateAssets().catch(err => console.error(err));
