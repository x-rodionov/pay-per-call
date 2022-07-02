import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../../../utils/env';

// Create a single supabase client for interacting with the database
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
