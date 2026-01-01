import { Role } from "~/models/Role";

// export default defineNuxtRouteMiddleware(async (to, from) => {
//   const roleStore = useRolesStore();

//   if (!roleStore.detailUser) {
//     await roleStore.getDetailUser();
//   }

//   const user = roleStore.detailUser;
//   const role = user?.type as Role;

//   const roleRoutes: Record<Role, string[]> = {
//     [Role.Admin]: [
//       "/dashboard",
//       "/supports",
//       "/setting/admin",
//       "/management-master",
//       "/payment/list",
//     ],
//     [Role.Master]: [
//       "/dashboard",
//       "/profile/master",
//       "/setting/master",
//       "/supports",
//       "/management-student",
//       "/management-coach",
//       "/presence-absence",
//       "/management-financial",
//       "/membership/plans",
//       "/payment",
//     ],
//     [Role.Coach]: ["/profile/coach"],
//     [Role.Student]: ["/profile/student", "/management-financial/my-financial"],
//   };

//   const fallbackByRole: Record<Role, string> = {
//     [Role.Admin]: "/dashboard",
//     [Role.Master]: "/dashboard",
//     [Role.Coach]: "/profile/coach",
//     [Role.Student]: "/profile/student",
//   };

//   const allowedRoutes = roleRoutes[role] || [];

//   const isAllowed = allowedRoutes.some(
//     (route) => to.path === route || to.path.startsWith(route + "/")
//   );

//   if (isAllowed) return;

//   return navigateTo(fallbackByRole[role], { replace: true });
// });

export default defineNuxtRouteMiddleware(async (to, from) => {
  const roleStore = useRolesStore();

  if (!roleStore.detailUser) {
    try {
      await roleStore.getDetailUser();
    } catch (error: any) {
      console.log(error.message || error);
    }
  }

  const user = roleStore.detailUser;

  if (!user) {
    return navigateTo("/auth", { replace: true });
  }

  const role = user.type as Role;

  const roleRoutes: Record<Role, (string | RegExp)[]> = {
    [Role.Admin]: [
      "/dashboard",
      /^\/supports$/, // فقط صفحه اصلی ساپورت (دقیق)
      /^\/supports\/chat-.*$/, // تمام صفحات چت داینامیک
      "/setting/admin",
      "/management-master",
      "/payment/list",
    ],
    [Role.Master]: [
      "/dashboard",
      "/profile/master",
      "/setting/master",
      "/supports/ticket", // فقط صفحه تیکت
      /^\/supports\/chat-.*$/, // تمام صفحات چت داینامیک
      "/management-student",
      "/management-coach",
      "/presence-absence",
      "/management-financial",
      "/membership/plans",
      /^\/payment$/,
    ],
    [Role.Coach]: ["/profile/coach"],
    [Role.Student]: ["/profile/student", "/management-financial/my-financial"],
  };

  const fallbackByRole: Record<Role, string> = {
    [Role.Admin]: "/dashboard",
    [Role.Master]: "/dashboard",
    [Role.Coach]: "/profile/coach",
    [Role.Student]: "/profile/student",
  };

  const allowedRoutes = roleRoutes[role] || [];

  const isAllowed = allowedRoutes.some((route) => {
    if (route instanceof RegExp) {
      return route.test(to.path);
    }
    return to.path === route || to.path.startsWith(route + "/");
  });

  if (isAllowed) return;

  const fallback = fallbackByRole[role];

  if (fallback && to.path !== fallback) {
    return navigateTo(fallback, { replace: true });
  }
});
