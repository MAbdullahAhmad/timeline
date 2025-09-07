import Welcome from "@/pages/Welcome/Welcome";
import App from "@/pages/App/App";

const guest_routes = {
  "/": Welcome,
  "/app": App,
  "/app/:item_id": App,
};

export default guest_routes;
