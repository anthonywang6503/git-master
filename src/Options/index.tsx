import React from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/antd.css';

import Options from './Options';

const root = document.getElementById('options-root');

if (!root) {
  throw new Error('Missing options-root element');
}

createRoot(root).render(<Options />);
