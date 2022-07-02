<script lang="ts">
  import {isTeaching} from './model';
</script>

<label>
  Is teaching
  <input type="checkbox" bind:checked={$isTeaching} />
</label>
