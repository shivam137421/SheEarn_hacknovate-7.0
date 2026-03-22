/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rose:    { 50:'#fff1f2',100:'#ffe4e6',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#be123c' },
        violet:  { 50:'#f5f3ff',100:'#ede9fe',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9' },
        amber:   { 50:'#fffbeb',100:'#fef3c7',400:'#fbbf24',500:'#f59e0b',600:'#d97706' },
        emerald: { 50:'#ecfdf5',100:'#d1fae5',400:'#34d399',500:'#10b981',600:'#059669' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': {opacity:'0'}, '100%': {opacity:'1'} },
        slideUp: { '0%': {transform:'translateY(20px)',opacity:'0'}, '100%': {transform:'translateY(0)',opacity:'1'} },
      },
    },
  },
  plugins: [],
};
