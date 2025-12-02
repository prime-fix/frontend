export const environment = {
  production: false,
  usePathParams: true,
  // Provider API configuration - AWS is primary, Supabase is fallback
  primeFixProviderApiBaseUrl: "http://localhost:8092/api/v1", // AWS Primary
  primeFixProviderApiBaseUrlAWS: "http://localhost:8092/api/v1", // AWS (explicit)
  primeFixProviderApiBaseUrlSupabase: "http://localhost:3000/api/v1", // Supabase Fallback

  // API Strategy: 'aws-primary' means AWS first, fallback to Supabase if needed
  apiStrategy: 'aws-primary' as const,

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

  // Query Param Keys
  autoRepairIdQueryParamKey: "id_auto_repair",
  technicianIdQueryParamKey: "id_technician",
  technicianScheduleIdQueryParamKey: "id_schedule",
  locationIdQueryParamKey: "id_location",
  membershipIdQueryParamKey: "id_membership",
  notificationIdQueryParamKey: "id_notification",
  paymentIdQueryParamKey: "id_payment",
  registeredVehicleIdQueryParamKey: "id_vehicle",
  roleIdQueryParamKey: "id_role",
  serviceIdQueryParamKey: "id_service",
  userAccountIdQueryParamKey: "id_user_account",
  userIdQueryParamKey: "id_user",
  visitIdQueryParamKey: "id_visit",
  expectedVisitIdQueryParamKey: "id_expected",
  diagnosticIdQueryParamKey: "id_diagnostic",
  ratingIdQueryParamKey: "id_rating"
};
