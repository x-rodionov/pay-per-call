<script lang="ts">
  import { H1 } from '$lib/shared/ui';
	import { Header } from '$lib/widgets/header';
	import { ClassRequests } from '$lib/widgets/class-requests';
	import { ChargedRateForm } from '$lib/features/charged-rate-form';
	import { ExpertiseForm } from '$lib/features/expertise-form';
</script>

<Header />

<section class="pt-12 px-12 lg:px-40">
  <H1>Teacher profile</H1>
  
  <div class="flex justify-between">
    <ExpertiseForm />
    <ChargedRateForm />
  </div>
  
  <div class="mt-16">
    <ClassRequests />
  </div>
</section>
