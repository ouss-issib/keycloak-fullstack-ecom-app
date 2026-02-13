import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'ecom-realm',
        clientId: 'ecom-client-app'
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false  ,
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
      }
    });
}
