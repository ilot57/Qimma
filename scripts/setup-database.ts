import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up Qimma AI database schema...');

  try {
    // Test connection
    console.log('📡 Testing Supabase connection...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('❌ Connection failed:', tablesError.message);
      return;
    }

    console.log(
      `✅ Connected to Supabase! Found ${tables?.length || 0} existing tables.`
    );

    // Read and execute schema
    console.log('📝 Reading schema file...');
    const schemaPath = join(process.cwd(), 'scripts', 'supabase-schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('⚡ Applying database schema...');

    // Split schema into individual statements and execute them
    const statements = schema
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️ Statement warning: ${error.message}`);
        }
      }
    }

    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    const { data: newTables, error: verifyError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', [
        'users',
        'exams',
        'student_submissions',
        'credit_transactions',
      ]);

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
      return;
    }

    console.log('✅ Database setup complete!');
    console.log(`📊 Created/verified ${newTables?.length || 0} core tables:`);
    newTables?.forEach((table) => console.log(`   - ${table.table_name}`));
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Run the setup
setupDatabase();
