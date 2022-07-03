<script lang="ts">
	import { H1 } from '$lib/shared/ui';

	import { ClassRequests } from '$lib/widgets/class-requests';
  import { ExpertiseForm } from '$lib/features/expertise-form';
  import { ChargedRateForm } from '../../../features/teacher-forms';
</script>

<main class="px-12 lg:px-40 pb-6">
	<H1>Tutor profile</H1>
	<div class="flex justify-between">
		<ExpertiseForm />
		<ChargedRateForm />
	</div>

	<H1>Requests for classes</H1>
	<ClassRequests />
</main>
