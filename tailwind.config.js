/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Target tablets and computers only - no phone support
        sm: '768px', // iPad mini and up
        md: '1024px', // iPad Pro and up
        lg: '1280px', // Desktop
        xl: '1536px', // Large desktop
      },
    },
  },
};
