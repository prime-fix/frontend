export const environment = {
  production: false,
  usePathParams: false,
  // Provider API configuration
  primeFixProviderApiBaseUrl: "http://localhost:3000/api/v1",

  // Endpoints Paths
  primeFixProviderAutoRepairsEndpointPath: "/auto_repairs",
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

  // API Key
  primeFixProviderApiKey: 'API_KEY',

  // Query Param Keys
  autoRepairIdQueryParamKey: "id_auto_repair",
  locationIdQueryParamKey: "id_location",
  membershipIdQueryParamKey: "id_membership",
  notificationIdQueryParamKey: "id_notification",
  paymentIdQueryParamKey: "id_payment",
  vehicleIdQueryParamKey: "id_vehicle",
  roleIdQueryParamKey: "id_role",
  serviceIdQueryParamKey: "id_service",
  userAccountIdQueryParamKey: "id_user_account",
  userIdQueryParamKey: "id_user",
  visitIdQueryParamKey: "id_visit",
};
