/**
 * @name javascript-redis-score
 * @description Returns the Redis-related code locations
 * @kind problem
 * @problem.severity recommendation
 * @id javascript/redis-score
 */

import utils

from CallExpr expr, int i
where i = computeRedisScore(expr, 0, 0) and i >= 3
select expr, expr + " / Redis Score:" + i