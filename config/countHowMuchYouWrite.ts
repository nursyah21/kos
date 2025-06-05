import * as fs from 'fs';
import * as path from 'path';

const EXTENSIONS = ['.ts', '.js', '.tsx'];

const stats = {
  files: 0,
  lines: 0,
  characters: 0,
};

const PRINT_EVERY = 10;
let fileCountSinceLastPrint = 0;

function printStats() {
  process.stdout.write(`Files: ${stats.files} | Lines: ${stats.lines} | Chars: ${stats.characters}\r`);
}

function walkDir(currentPath: string): void {
  const files = fs.readdirSync(currentPath);

  for (const file of files) {
    const fullPath = path.join(currentPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (EXTENSIONS.includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        stats.files++;
        stats.lines += content.split('\n').length;
        stats.characters += content.length;

        fileCountSinceLastPrint++;

        if (fileCountSinceLastPrint >= PRINT_EVERY) {
          printStats();
          fileCountSinceLastPrint = 0;
        }
      }
    }
  }
}

const startTime = performance.now();

walkDir(process.cwd());

const endTime = performance.now();
const durationMs = (endTime - startTime) / 1000;

// printStats();

console.log('\n\nPemrosesan selesai.');
console.log('Statistik Proyek:');
console.log(`Jumlah file: ${stats.files}`);
console.log(`Jumlah baris: ${stats.lines}`);
console.log(`Jumlah karakter: ${stats.characters}`);
console.log(`Durasi eksekusi: ${durationMs.toFixed(2)} s`);