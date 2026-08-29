const fs = require('fs');
const path = require('path');

const transformContent = (content) => {
  content = content.replace(/import \{ Link(.*?) \} from 'react-router-dom';/g, "import Link from 'next/link';");
  content = content.replace(/import \{ useNavigate(.*?) \} from 'react-router-dom';/g, "import { useRouter } from 'next/navigation';");
  content = content.replace(/const navigate = useNavigate\(\);/g, 'const router = useRouter();');
  content = content.replace(/navigate\(/g, 'router.push(');
  content = content.replace(/to="/g, 'href="');
  content = `"use client";\n` + content;
  return content;
};

const map = {
  'ContactPage.tsx': 'app/(app)/contact/page.tsx',
  'BlogPage.tsx': 'app/(app)/blog/page.tsx',
  'LawyerDetailPage.tsx': 'app/(app)/lawyers/[id]/page.tsx'
};

for (const [src, dest] of Object.entries(map)) {
  const fullSrc = path.join('_archive/frontend/src/pages', src);
  if (fs.existsSync(fullSrc)) {
    const original = fs.readFileSync(fullSrc, 'utf8');
    const transformed = transformContent(original);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, transformed);
  } else {
    console.log(`Missing ${fullSrc}`);
  }
}
