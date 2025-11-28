import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './App';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react'; // Import this
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppWrapper />
    <Analytics />
    <SpeedInsights /> {/* Add this line */}
  </React.StrictMode>
);
