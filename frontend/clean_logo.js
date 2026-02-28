import Jimp from 'jimp';

async function main() {
    const img = await Jimp.read('logo.png');
    const w = img.bitmap.width;
    const h = img.bitmap.height;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = (w * y + x) << 2;
            const r = img.bitmap.data[idx];
            const g = img.bitmap.data[idx + 1];
            const b = img.bitmap.data[idx + 2];

            // Remove light pixels (checkerboard/white bg)
            if (r > 200 && g > 200 && b > 200) {
                img.bitmap.data[idx + 3] = 0;
            }
        }
    }

    await img.writeAsync('logo_clean.png');
    console.log("Done");
}

main();
