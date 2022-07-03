<script lang="ts">
	import { Header } from '$lib/widgets/header';
	import { ClassRequests } from '$lib/widgets/class-requests';
	import { ChargedRateForm, ExpertiseForm, GoOnline } from '$lib/features/teacher-forms';
  import { user } from '$lib/entities/user';
  import { H1 } from '$lib/shared/ui';
</script>

<Header />
<main class="px-12 lg:px-40 pb-6">

	<section class="pt-12">
		<H1>Tutor profile</H1>

		<div class="flex justify-between items-start space-x-8">
			<ExpertiseForm />
			<ChargedRateForm />
		</div>


		<div class="mt-8">
			<GoOnline />
		</div>

		{#if $user?.online}
			<div class="mt-16">
				<ClassRequests />
			</div>
		{/if}
	</section>
</main>
