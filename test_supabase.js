import { createClient } from '@supabase/supabase-js';

// Using the CORRECT credentials fetched from MCP
const SUPABASE_URL = 'https://lqcurkgjwetppcgktynb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY3Vya2dqd2V0cHBjZ2t0eW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MDgzMTQsImV4cCI6MjA4NDk4NDMxNH0.PATf5sjxerDOc_frljfO1dJYgVBQjYRk-6d3eZyIJsk';

console.log('--- TESTING SUPABASE CONNECTION ---');
console.log(`URL: ${SUPABASE_URL}`);
console.log(`Key: ${SUPABASE_KEY.substring(0, 10)}...`);

try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Client initialized. Attempting to query "access_keys"...');

    const { data, error } = await supabase.from('access_keys').select('*').limit(1);

    if (error) {
        console.error('❌ QUERY FAILED:', error.message);
        if (error.code) console.error('Error Code:', error.code);
    } else {
        console.log('✅ CONNECTION SUCCESSFUL!');
        console.log('Data received:', data);
    }
} catch (err) {
    console.error('❌ CRITICAL ERROR:', err.message);
}
