const fs = require('fs');

const path = 'app/components/Navbar.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/import \{ Link \} from 'react-router-dom';/, "import Link from 'next/link';\nimport { useUIStore, useAuthStore } from '../lib/store';");
content = content.replace(/import \{ useAppDispatch, useAppSelector \} from '..\/hooks\/redux';/, '');
content = content.replace(/import \{ toggleDarkMode, setLanguage \} from '..\/redux\/slices\/uiSlice';/, '');
content = content.replace(/import \{ logout \} from '..\/redux\/slices\/authSlice';/, '');
content = content.replace(/const dispatch = useAppDispatch\(\);/, '');
content = content.replace(/const \{ user, token \} = useAppSelector\(state => state\.auth\);/, 'const { user, token, logout } = useAuthStore();');
content = content.replace(/const \{ darkMode, language \} = useAppSelector\(state => state\.ui\);/, 'const { darkMode, language, toggleDarkMode, setLanguage } = useUIStore();');
content = content.replace(/to="/g, 'href="');
content = content.replace(/dispatch\(setLanguage\((.*?)\)\)/g, 'setLanguage($1)');
content = content.replace(/dispatch\(toggleDarkMode\(\)\)/g, 'toggleDarkMode()');
content = content.replace(/dispatch\(logout\(\)\)/g, 'logout()');
content = `"use client";\n` + content;

fs.writeFileSync(path, content);
