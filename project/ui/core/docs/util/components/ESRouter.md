# ESRouter Documentation

## Import

```js
import ESRouter from '@/core/util/components/ESRouter';
```

## Usage Examples

### Simple Todo App Example

```jsx
import TodoList from "../pages/TodoList";
import TodoDetail from "../pages/TodoDetail";

const todoRoutes = [
  {'/': TodoList},
  {'/todo/:id': TodoDetail},
];

<ESRouter routes={todoRoutes} />
```

### E-commerce App Example

```jsx
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";

const ecommerceRoutes = [
  {'/': Home},
  {'/product/:id': ProductDetail},
  {'/cart': Cart},
];

<ESRouter routes={ecommerceRoutes} />
```

### Admin Dashboard Example

```jsx
import DashboardHome from "../pages/DashboardHome";
import ManageUsers from "../pages/ManageUsers";
import ManageOrders from "../pages/ManageOrders";

const adminRoutes = [
  {'admin/': {
    _: DashboardHome,
    'users/': ManageUsers,
    'orders/': ManageOrders,
  }},
];

<ESRouter routes={adminRoutes} />
```

### Nested Routing Example

```jsx
import ServicesHome from "../pages/ServicesHome";
import AIService from "../pages/AIService";
import WebService from "../pages/WebService";

const servicesRoutes = [
  {'services/': {
    _: ServicesHome,
    'ai/': AIService,
    'web/': WebService,
  }},
];

<ESRouter routes={servicesRoutes} />
```

### Complex Mixed Routing Example

```jsx
import Home from "../pages/Home";
import About from "../pages/About";
import BlogList from "../pages/BlogList";
import BlogPost from "../pages/BlogPost";

const complexRoutes = [
  {'/': Home},
  {'/about': About},
  {'blog/': [
    {method: "GET", path: '/', component: BlogList},
    {method: "GET", path: ':slug', component: BlogPost},
  ]},
];

<ESRouter routes={complexRoutes} />
```

## Behavior

- **Flexible routing**: supports simple, nested, and method-based routes.
- **Wildcard route** (`*`) renders a built-in `NotFound` component.
- Wraps the application in a `SnackbarProvider` for notification handling.

---

Write your own `ESRouter` component logic to handle the routing based on the above structures.

