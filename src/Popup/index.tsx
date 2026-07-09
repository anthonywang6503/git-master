import React from 'react';
import { createRoot } from 'react-dom/client';

import Popup from './Popup';
import './index.less';

const root = document.getElementById('popup-root');

if (!root) {
  throw new Error('Missing popup-root element');
}

createRoot(root).render(<Popup />);
