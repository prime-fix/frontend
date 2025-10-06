export const environment = {
  production: true,
  usePathParams: true,
  // Provider API configuration
  primeFixProviderApiBaseUrl: "https://klrtzcjehbkfckohrvvu.supabase.co/rest/v1",

  // Endpoints Paths
  primeFixProviderAutoRepairsEndpointPath: "/auto_repairs",
  primeFixProviderLocationsEndpointPath: "/locations",
  primeFixProviderMembershipsEndpointPath: "/memberships",
  primeFixProviderPaymentsEndpointPath: "/payments",
  primeFixProviderRegisteredVehiclesEndpointPath: "/registered_vehicles",
  primeFixProviderRolesEndpointPath: "/roles",
  primeFixProviderServicesEndpointPath: "/services",
  primeFixProviderUserAccountsEndpointPath: "/user_accounts",
  primeFixProviderUsersEndpointPath: "/users",
  primeFixVisitsEndpointPath: "/visits",

  // API Key
  primeFixProviderApiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscnR6Y2plaGJrZmNrb2hydnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMDc4NjQsImV4cCI6MjA3NDY4Mzg2NH0.abo91QGTMisENqS_a-8QWV0WP3VZSkkOkRUitRv8iBw",

  // Query Param Keys
  autoRepairIdQueryParamKey: "id_auto_repair",
  locationIdQueryParamKey: "id_location",
  membershipIdQueryParamKey: "id_membership",
  paymentIdQueryParamKey: "id_payment",
  registeredVehicleIdQueryParamKey: "id_vehicle",
  roleIdQueryParamKey: "id_role",
  serviceIdQueryParamKey: "id_service",
  userAccountIdQueryParamKey: "id_user_account",
  userIdQueryParamKey: "id_user",
  visitIdQueryParamKey: "id_visit",
};
