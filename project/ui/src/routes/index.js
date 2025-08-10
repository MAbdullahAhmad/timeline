import guest_routes from "@/routes/guest";

const routes = [
  {
    prefix: "/",
    routes: guest_routes,
  },
];

export default routes;
