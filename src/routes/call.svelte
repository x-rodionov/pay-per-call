<script lang="ts">
  import {onMount} from 'svelte';
  import { type User, fetchUsers } from '../utils/users';
  import {UserList} from '../components/user-list';

  let users: User[] = [];
  
  onMount(async () => {
    users = await fetchUsers();
  });
  
  const joinSession = async () => {
    console.log('session');
  };
</script>

<section>
  <h2>User list</h2>
  
  <UserList />
</section>
