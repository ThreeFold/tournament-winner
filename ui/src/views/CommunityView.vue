<script setup lang="ts">
import { CommunityService } from '@/services/CommunityService';

const service = new CommunityService();
const communities = await service.getCommunities();
</script>

<template>
  <main>
      <div v-for="community in communities" :key="community.id">
          <tt>{{JSON.stringify(community)}}</tt>
      </div>
  </main>
</template>
