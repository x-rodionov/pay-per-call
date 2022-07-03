/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  // interface Stuff {}
}

interface ImportMetaEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_KEY: string;
  VITE_TON_TESTNET_API_KEY: string;
  VITE_TON_MAINNET_API_KEY: string;
  VITE_FAST_MNEMONICS: string;
}
