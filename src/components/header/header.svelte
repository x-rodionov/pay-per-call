<script lang="ts">
  import Branding from './branding.svelte';
  import { Auth } from '../auth';
  import {TeachSelector} from '../teach-selector';
</script>

<header class="flex justify-between items-center px-12 lg:px-40 py-12">
  <Branding />
  <TeachSelector />
  <Auth />
</header>
