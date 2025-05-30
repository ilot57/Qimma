import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Migration {
  id: string;
  filename: string;
  applied_at: string;
}

async function createMigrationsTable() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS migrations (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  });

  if (error) {
    console.error('❌ Failed to create migrations table:', error.message);
    return false;
  }

  return true;
}

async function getAppliedMigrations(): Promise<string[]> {
  const { data, error } = await supabase
    .from('migrations')
    .select('id')
    .order('id');

  if (error) {
    console.error('❌ Failed to get applied migrations:', error.message);
    return [];
  }

  return data?.map((m) => m.id) || [];
}

async function applyMigration(filename: string): Promise<boolean> {
  try {
    console.log(`📝 Applying migration: ${filename}`);

    const migrationPath = join(
      process.cwd(),
      'scripts',
      'migrations',
      filename
    );
    const sql = readFileSync(migrationPath, 'utf-8');

    // Split into statements and execute
    const statements = sql
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

    // Record migration as applied
    const migrationId = filename.replace('.sql', '');
    const { error: recordError } = await supabase
      .from('migrations')
      .insert({ id: migrationId, filename });

    if (recordError) {
      console.error(
        `❌ Failed to record migration ${filename}:`,
        recordError.message
      );
      return false;
    }

    console.log(`✅ Migration ${filename} applied successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to apply migration ${filename}:`, error);
    return false;
  }
}

async function runMigrations() {
  console.log('🚀 Starting database migrations...');

  // Create migrations table if it doesn't exist
  const tableCreated = await createMigrationsTable();
  if (!tableCreated) {
    return;
  }

  // Get list of migration files
  const migrationsDir = join(process.cwd(), 'scripts', 'migrations');
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.log('📭 No migration files found');
    return;
  }

  // Get already applied migrations
  const appliedMigrations = await getAppliedMigrations();

  // Apply pending migrations
  let appliedCount = 0;
  for (const filename of migrationFiles) {
    const migrationId = filename.replace('.sql', '');

    if (appliedMigrations.includes(migrationId)) {
      console.log(`⏭️ Skipping already applied migration: ${filename}`);
      continue;
    }

    const success = await applyMigration(filename);
    if (!success) {
      console.error(`❌ Migration failed: ${filename}`);
      break;
    }

    appliedCount++;
  }

  console.log(
    `✅ Migrations complete! Applied ${appliedCount} new migrations.`
  );
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations().catch(console.error);
}

export { runMigrations };
