<script lang="ts">
	import { H1 } from '$lib/shared/ui';

	import { ClassRequests } from '$lib/widgets/class-requests';
  import { ExpertiseForm } from '$lib/features/expertise-form';
  import { ChargedRateForm } from '$lib/features/charged-rate-form';
	// import { Header } from '$lib/widgets/header';
</script>

<!-- <Header /> -->
<main class="px-12 lg:px-40">
	<H1>Tutor profile</H1>
	<div class="flex justify-between">
		<ExpertiseForm />
		<ChargedRateForm />
	</div>

	<H1>Requests for classes</H1>
	<ClassRequests />
</main>
