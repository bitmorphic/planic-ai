const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src/app/(dashboard)',
  'src/components/app',
  'src/components/shared'
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // If the file imports from @/lib/data, we need to refactor it
      if (content.includes("from '@/lib/data'") || content.includes('from "@/lib/data"')) {
        console.log(`Processing: ${fullPath}`);
        
        // 1. Add import for useData
        if (!content.includes('useData')) {
          content = "import { useData } from '@/contexts/data-context';\n" + content;
        }

        // 2. Remove the import from @/lib/data (except for types if any, but they are from types.ts usually)
        content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@\/lib\/data['"];?/g, (match, imports) => {
          // If there are specific exports like totalBillAmount, we should keep them if they are functions, but wait!
          // totalBillAmount relies on BILLS inside data.ts. It's actually better to compute it locally or keep it if it's pure.
          // Wait, totalBillAmount() in data.ts just sums BILLS directly. It won't work for live data.
          // We need to re-implement totalBillAmount where it's used using the context bills!
          return '';
        });

        // 3. Inject `const data = useData();` at the top of the component
        // This is tricky via regex, so we'll do it manually for the files that need it, or we can just run this script 
        // to do the bulk of the work, but wait! The script might be too complex.
      }
    }
  }
}

// Just output the files that need manual attention to save time
function findFiles(dir) {
  const files = fs.readdirSync(dir);
  let found = [];
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      found = found.concat(findFiles(fullPath));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("@/lib/data")) {
        found.push(fullPath);
      }
    }
  }
  return found;
}

console.log(findFiles('src').join('\n'));
