import { userRoutes } from "./user/routes.js"
import { taskRoutes } from "./task/routes.js"

function compileRoutes(...routes) {
    const allRoutes = routes.flat()
    return allRoutes
}

const routesCompiler = compileRoutes(userRoutes, taskRoutes)
console.log(routesCompiler)
export const routes = routesCompiler
