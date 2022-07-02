<script lang="ts">
  import RequestCard from "./request-card.svelte";

  const requests = [
    {
      name: 'Splendid Banana',
    }
  ];
</script>

<div>
  {#each requests as request}
    <RequestCard name={request.name} />
  {:else}
    <div>No requests yet</div>
  {/each}
</div>
