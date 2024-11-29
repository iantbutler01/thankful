/// <reference types="@sveltejs/kit" />
import type { Database } from './types/supabase';

declare global {
	namespace App {
		interface Supabase {
			Database: Database;
			SchemaName: 'public';
		}

		interface PageData {
			session: import('@supabase/supabase-js').Session | null;
		}

		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient<Database>;
			getSession(): Promise<import('@supabase/supabase-js').Session | null>;
		}

		interface Error {
			message: string;
			status?: number;
		}
	}
}

export {};
