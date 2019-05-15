import { Client } from '@sentry/types/dist/client';

declare module "vue/types/vue" {
  interface Vue {
    $sentry: Client;
  }
}
