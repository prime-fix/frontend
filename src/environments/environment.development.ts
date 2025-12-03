export const environment = {
  production: false,
  usePathParams: true,
  // Provider API configuration - Supabase (json-server) for testing
  primeFixProviderApiBaseUrl: "http://localhost:3000/api/v1", // Supabase (json-server) Primary
  primeFixProviderApiBaseUrlAWS: "http://localhost:8092/api/v1", // AWS
  primeFixProviderApiBaseUrlSupabase: "http://localhost:3000/api/v1", // Supabase

  // API Strategy: 'supabase-only' means use json-server directly (no AWS)
  apiStrategy: 'supabase-only' as const,

  // Endpoints Paths
  primeFixProviderSignUpVehicleOwnerEndpointPath: "/authentication/sign-up/vehicle-owner",
  primeFixProviderSignUpAutoRepairEndpointPath: "/authentication/sign-up/auto-repair",
  primeFixProviderSignInEndpointPath: "/authentication/sign-in",
  primeFixProviderAutoRepairsEndpointPath: "/auto_repairs",
  primeFixProviderTechniciansEndpointPath: "/technicians",
  primeFixProviderTechnicianSchedulesEndpointPath: "/technician_schedules",
  primeFixProviderLocationsEndpointPath: "/locations",
  primeFixProviderMembershipsEndpointPath: "/memberships",
  primeFixProviderNotificationsEndpointPath: "/notifications",
  primeFixProviderPaymentsEndpointPath: "/payments",
  primeFixProviderVehiclesEndpointPath: "/vehicles",
  primeFixProviderRolesEndpointPath: "/roles",
  primeFixProviderServicesEndpointPath: "/services",
  primeFixProviderUserAccountsEndpointPath: "/user_accounts",
  primeFixProviderUsersEndpointPath: "/users",
  primeFixVisitsEndpointPath: "/visits",
  primeFixExpectedVisitsEndpointPath: "/expected_visits",
  primeFixDiagnosticsEndpointPath: "/diagnostics",
  primeFixProviderRatingsEndpointPath: "/ratings",

  // API Key
  primeFixProviderApiKey: 'API_KEY',
};
