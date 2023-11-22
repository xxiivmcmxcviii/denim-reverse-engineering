/**
 * @name javascript-api-score
 * @description Returns the API-related code locations
 * @kind problem
 * @problem.severity recommendation
 * @id javascript/api-score
 */

import utils

from CallExpr expr, int i
where i = computeApiScore(expr, 0, 0) and i >= 3
select expr, expr + " / API Score:" + i