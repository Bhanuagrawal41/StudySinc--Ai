// import { createBrowserRouter } from "react-router";
// import { Layout } from "./components/Layout";
// import { Home } from "./pages/Home";
// import { CreatePlan } from "./pages/CreatePlan";
// import { PlanView } from "./pages/PlanView";
// import { Plans } from "./pages/Plans";
// import { Settings } from "./pages/Settings";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     Component: Layout,
//     children: [
//       { index: true, Component: Home },
//       { path: "create", Component: CreatePlan },
//       { path: "plan/:id", Component: PlanView },
//       { path: "plans", Component: Plans },
//       { path: "settings", Component: Settings },
//     ],
//   },
// ]);


import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { CreatePlan } from "./pages/CreatePlan";
import { PlanView } from "./pages/PlanView";
// import { DayView } from "./pages/dayview";
import { DayView } from "./pages/DayView"; 
import { Plans } from "./pages/Plans";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "create", Component: CreatePlan },
      { path: "plan/:id", Component: PlanView },
      { path: "plan/:id/day/:dayNumber", Component: DayView },
      { path: "plans", Component: Plans },
      { path: "settings", Component: Settings },
    ],
  },
]);
