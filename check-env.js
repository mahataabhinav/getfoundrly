import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

console.log(`VITE_SUPABASE_URL: ${url ? url : 'MISSING'}`);
console.log(`VITE_SUPABASE_ANON_KEY: ${key ? key.substring(0, 5) + '...' : 'MISSING'}`);
