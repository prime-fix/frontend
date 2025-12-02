export const environment = {
  production: true,
  usePathParams: true, // AWS uses path params
  // Provider API configuration - AWS is primary, Supabase is fallback
  primeFixProviderApiBaseUrl: "https://cadw4v2ry8.us-east-2.awsapprunner.com/api/v1", // AWS Primary
  primeFixProviderApiBaseUrlAWS: "https://cadw4v2ry8.us-east-2.awsapprunner.com/api/v1", // AWS (explicit)
  primeFixProviderApiBaseUrlSupabase: "https://klrtzcjehbkfckohrvvu.supabase.co/rest/v1", // Supabase Fallback

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
  primeFixProviderApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscnR6Y2plaGJrZmNrb2hydnZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMDc4NjQsImV4cCI6MjA3NDY4Mzg2NH0.abo91QGTMisENqS_a-8QWV0WP3VZSkkOkRUitRv8iBw',

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
