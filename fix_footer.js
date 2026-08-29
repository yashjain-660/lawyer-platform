const fs = require('fs');

const path = 'app/components/Footer.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/import \{ Link \} from 'react-router-dom';/, "import Link from 'next/link';");
content = content.replace(/to="/g, 'href="');

fs.writeFileSync(path, content);
