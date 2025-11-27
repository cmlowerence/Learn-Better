import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './App'; // Import the new wrapper
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(<AppWrapper />);
