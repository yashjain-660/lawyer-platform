const fs = require('fs');
const path = require('path');

const transformContent = (content) => {
  content = content.replace(/import \{ Link(.*?) \} from 'react-router-dom';/g, "import Link from 'next/link';");
  content = content.replace(/import \{ useNavigate(.*?) \} from 'react-router-dom';/g, "import { useRouter } from 'next/navigation';");
  content = content.replace(/const navigate = useNavigate\(\);/g, 'const router = useRouter();');
  content = content.replace(/navigate\(/g, 'router.push(');
  
  content = content.replace(/import \{ useAppDispatch, useAppSelector \} from '(\.\.\/)*hooks\/redux';/g, "import { useAuthStore, useUIStore, useLawyersStore, useConsultationStore } from '@/app/lib/store';");
  content = content.replace(/import \{ .*? \} from '(\.\.\/)*redux\/slices\/.*?';/g, "");
  
  content = content.replace(/const dispatch = useAppDispatch\(\);/g, '');
  content = content.replace(/const \{ user, token.*? \} = useAppSelector\(state => state\.auth\);/g, 'const { user, token, login, logout } = useAuthStore();');
  content = content.replace(/const \{ lawyers.*? \} = useAppSelector\(state => state\.lawyers\);/g, 'const { lawyers, setLawyers } = useLawyersStore();');
  content = content.replace(/to="/g, 'href="');
  
  content = `"use client";\n` + content;
  return content;
};

const map = {
  'HomePage.tsx': 'app/page.tsx',
  'LoginPage.tsx': 'app/(auth)/login/page.tsx',
  'RegisterPage.tsx': 'app/(auth)/register/page.tsx',
  'ClientPortal.tsx': 'app/(app)/dashboard/page.tsx',
  'LawyersPage.tsx': 'app/(app)/lawyers/page.tsx',
  'ConsultationPage.tsx': 'app/(app)/consultation/page.tsx',
};

for (const [src, dest] of Object.entries(map)) {
  const fullSrc = path.join('_archive/frontend/src/pages', src);
  if (fs.existsSync(fullSrc)) {
    const original = fs.readFileSync(fullSrc, 'utf8');
    const transformed = transformContent(original);
    fs.writeFileSync(dest, transformed);
  } else {
    console.log(`Missing ${fullSrc}`);
  }
}
