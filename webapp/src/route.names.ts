export const RouteNames = {
  AppHome: "",
  CreatePayment: "create",
};

export const AbsoluteRoutes = {
  App: "/",
  CreatePayment: (id: string) => `/${RouteNames.CreatePayment}/${id}`,
};
