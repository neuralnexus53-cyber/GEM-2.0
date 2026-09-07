import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brainDir = 'C:\\Users\\Sonu PC\\.gemini\\antigravity-ide\\brain\\aa5e7137-ff2c-4c73-870d-efda0a641044';
const imagesDir = path.resolve(__dirname, '../public/images');
const operationalDir = path.join(imagesDir, 'operational');

if (!fs.existsSync(operationalDir)) {
  fs.mkdirSync(operationalDir, { recursive: true });
}

if (fs.existsSync(brainDir)) {
  const files = fs.readdirSync(brainDir);
  
  // Operational step photos
  const opMappings = {
    'op_step1': path.join(operationalDir, 'step1.jpg'),
    'op_step2': path.join(operationalDir, 'step2.jpg'),
    'op_step3': path.join(operationalDir, 'step3.jpg'),
    'op_step4': path.join(operationalDir, 'step4.jpg'),
    'op_step5': path.join(operationalDir, 'step5.jpg'),
    'op_step6': path.join(operationalDir, 'step6.jpg'),
  };

  for (const [prefix, destPath] of Object.entries(opMappings)) {
    const match = files.find(f => f.startsWith(prefix) && f.endsWith('.jpg'));
    if (match) {
      fs.copyFileSync(path.join(brainDir, match), destPath);
      console.log(`Synced operational: ${match} -> ${path.basename(destPath)}`);
    }
  }

  // Hero carousel banners customized for GeM 2.0 Project
  const bannerMappings = {
    'gem_hero_procurement': path.join(imagesDir, 'banner1.jpg'),
    'gem_hero_cryptovault': path.join(imagesDir, 'banner2.jpg'),
    'gem_hero_makeinindia': path.join(imagesDir, 'banner3.jpg'),
  };

  for (const [prefix, destPath] of Object.entries(bannerMappings)) {
    const match = files.find(f => f.startsWith(prefix) && f.endsWith('.jpg'));
    if (match) {
      fs.copyFileSync(path.join(brainDir, match), destPath);
      console.log(`Synced hero banner: ${match} -> ${path.basename(destPath)}`);
    }
  }

  console.log('All project assets synchronized successfully!');
} else {
  console.log('Brain directory not found on local path.');
}
