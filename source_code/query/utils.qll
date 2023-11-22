import javascript
import DataFlow

// ----------------------------------------------------------- EXPRESSION -----------------------------------------------------------

abstract class Expression extends Expr {
	abstract string toStringExpression();
}

class LiteralExpression extends Expression, Literal {

	override string toStringExpression() {
		result = "'"+this.getValue()+"'"
	}
}

class IdentifierExpression extends Expression, Identifier {

	override string toStringExpression() {
		result = this.getName()
	}
}

class PropertyExpression extends Expression, DotExpr {

	override string toStringExpression() {
		result = this.getBase() + "." + this.getPropertyName()
	}
}

class IndexExpression extends Expression, IndexExpr {

	override string toStringExpression() {
		result = this.getPropertyName() + "[" + this.getIndex() + "]"
	}
}

class ConcatenationExpression extends Expression, AddExpr {

	override string toStringExpression() {
		result = this.getLeftOperand().(Expression).toStringExpression() + " + " + this.getRightOperand().(Expression).toStringExpression()
	}
}

predicate isString(Expr expr){
	expr.getKind() = 4 // 4 = only string
}

predicate isFunction(Expr expr){
	expr.getKind() = 9 // 9 = only function
}

bindingset[stringToTest, stringToCompareWith]
predicate isLike(string stringToTest, string stringToCompareWith) {
	stringToTest.toLowerCase().matches("%"+stringToCompareWith.toLowerCase()+"%")
}

// ----------------------------------------------------------- IMPORT -----------------------------------------------------------

bindingset[importName]
predicate isImport(Expr expr, string importName) {
	exists(Import i | i = expr.(Import) and i.getImportedPath().getValue().toLowerCase().matches("%"+importName+"%"))
}

bindingset[importName]
predicate hasImport(Expr expr, string importName) {
	exists(Import i | i.getImportedPath().getValue().toLowerCase().matches("%"+importName+"%") and expr.getFile() = i.getFile())
}

bindingset[importName]
predicate isReceiverLinkedToImport(Expr receiver, string importName) {
	exists(VariableDeclarator vd | isImport(vd.getInit(), importName) and vd.getBindingPattern().getAVariable().getName() = receiver.(Expression).toStringExpression())
}

// ----------------------------------------------------------- API -----------------------------------------------------------

// Api call

class ApiCall extends CallExpr {

	ApiCall() {
        this.getCalleeName() in [
			"get",
			"post", 
			"put",
			"delete", 
			"all", 
			"param", 
			"render", 
			"route", 
			"use",
			"listen"
		]
    }
}

predicate isAstNodeLinkedToApiCallAstNode(AstNode node) {
	node instanceof ApiCall and isApiRoute(node.(ApiCall).getArgument(0)) // Base case
	or isAstNodeLinkedToApiCallAstNode(node.getParent()) // Recursive case
}

// Api assignation

class ApiAssignation extends Expr {

	ApiAssignation() {
		(this instanceof VariableDeclarator
			and this.(VariableDeclarator).getInit() instanceof CallExpr
			and this.(VariableDeclarator).getInit().(CallExpr).getCalleeName() = "express"
			and this.(VariableDeclarator).getInit().(CallExpr).getNumArgument() = 0) 
		or
		(this instanceof AssignExpr
			and this.(AssignExpr).getRhs().(CallExpr).getCalleeName() = "express"
			and this.(AssignExpr).getRhs().(CallExpr).getNumArgument() = 0)
    }

	string getLeft(){
		(this instanceof AssignExpr and result = this.(AssignExpr).getLhs().(Expression).toStringExpression()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getBindingPattern().getAVariable()+"")
	}

	string getRight(){
		(this instanceof AssignExpr and result = this.(AssignExpr).getRhs().(CallExpr).getCalleeName()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getInit()+"")
	}
}

predicate hasApiAssignation(Expr expr) {
	exists(ApiAssignation expressAssignation | expressAssignation.getFile() = expr.getFile())
}

predicate isReceiverLinkedToApiAssignation(Expr receiver) {
	exists(ApiAssignation expressAssignation | expressAssignation.getLeft() = receiver.(Expression).toStringExpression())
}

predicate isApiRoute(Expr expr){
	expr.(Expression).toStringExpression().substring(0, 2) = "'/"
}

// ----------------------------------------------------------- REDIS -----------------------------------------------------------

// Redis call

class RedisCall extends CallExpr {
	RedisCall() {
		this.getCalleeName() in [
			"get",
			"set",
			"del",
			"keys",
			"smembers",
			"srem",
			"scanStream",
			"scan",
			"mget",
			"rpush",
			"blpop",
			"lrem",
			"llen",
			"lrange",
			"multi", 
			"exists", 
			"setex", 
			"expire", 
			"flushdb", 
			"lset", 
			"hgetall", 
			"exec", 
			"subscribe", 
			"publish", 
			"sadd", 
			"pexpire", 
			"nodes",
			"hset",
			"setnx",
			"eval", 
			"mset", 
			"ltrim", 
			"zrange", 
			"zremrangebyrank", 
			"zcard", 
			"zadd", 
			"zrangebyscore",
			"strlen",
			"healthCheck"
		]
	}
}

// Redis assignation

class RedisAssignation extends Expr {

	RedisAssignation() {
		(this instanceof VariableDeclarator
			and this.(VariableDeclarator).getInit() instanceof CallExpr
			and this.(VariableDeclarator).getInit().(CallExpr).getCalleeName() = "createClient"
			and this.(VariableDeclarator).getInit().(CallExpr).getNumArgument() = 1) 
		or
		(this instanceof AssignExpr
			and this.(AssignExpr).getRhs().(CallExpr).getCalleeName() = "createClient"
			and this.(AssignExpr).getRhs().(CallExpr).getNumArgument() = 1)
    }

	string getLeft(){
		(this instanceof AssignExpr and result = this.(AssignExpr).getLhs().(Expression).toStringExpression()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getBindingPattern().getAVariable()+"")
	}

	string getRight(){
		(this instanceof AssignExpr and result = this.(AssignExpr).getRhs().(CallExpr).getCalleeName()+"")
		or
		(this instanceof VariableDeclarator and result = this.(VariableDeclarator).getInit()+"")
	}
}

predicate hasRedisClientAssignation(Expr expr) {
	exists(RedisAssignation redisAssignation | redisAssignation.getFile() = expr.getFile())
}

predicate isReceiverLinkedToRedisClientAssignation(Expr redisCallReceiver) {
	exists(RedisAssignation redisAssignation | redisCallReceiver.(Expression).toStringExpression() = redisAssignation.getLeft())
}

// ----------------------------------------------------------- SCORE : REDIS -----------------------------------------------------------

int computeRedisScore(CallExpr expr, int nbFilter, int score) {
	nbFilter in [0 .. 10] and score in [0 .. 10] and
	
	if nbFilter = 0
    then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreIsRedisCall(expr)))
	
	else if nbFilter = 1
	then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreIsRedisCallWithStringFirstArgument(expr)))
	
	else if nbFilter = 2
    then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreHasRedisLikeMethodName(expr)))
	
	else if nbFilter = 3 
    then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreHasRedisLikeReceiverName(expr)))
	
	else if nbFilter = 4
    then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreHasImport(expr)))
    
	else if nbFilter = 5
    then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreHasRedisClientAssignation(expr)))
	
	else if nbFilter = 6
    then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreIsReceiverLinkedToRedisClientAssignation(expr)))

	else if nbFilter = 7
    then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreIsReceiverLinkedToRedisImport(expr)))
	
	else if nbFilter = 8
    then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreIsRedisCallAstNodeLinkedToApiCallAstNode(expr)))
	
	else if nbFilter = 9
    then result = computeRedisScore(expr, nbFilter + 1, (score + computeRedisScoreIsImport(expr)))
	
	else result = score
}

int computeRedisScoreIsRedisCall(CallExpr expr) {
	if expr instanceof RedisCall
	then result = 1
	else result = 0
}

int computeRedisScoreIsRedisCallWithStringFirstArgument(CallExpr expr) {
	if expr instanceof RedisCall
	and isString(expr.(RedisCall).getArgument(0))
	and not isApiRoute(expr.(RedisCall).getArgument(0)) // The key should not start like an API route by "/"
	then result = 1
	else result = 0
}

int computeRedisScoreHasRedisLikeMethodName(CallExpr expr) {
	if isLike(expr.getCalleeName(), "redis")
	then result = 1
	else result = 0
}

int computeRedisScoreHasRedisLikeReceiverName(CallExpr expr) {
	if isLike(expr.getReceiver().(Expression).toStringExpression(), "redis")
	then result = 1
	else result = 0
}

int computeRedisScoreHasImport(CallExpr expr) {
	if hasImport(expr, "redis")
	then result = 1
	else result = 0
}

int computeRedisScoreHasRedisClientAssignation(CallExpr expr) {
	if hasRedisClientAssignation(expr)
	then result = 1
	else result = 0
}

int computeRedisScoreIsReceiverLinkedToRedisClientAssignation(CallExpr expr) {
	if isReceiverLinkedToRedisClientAssignation(expr.getReceiver())
	then result = 1
	else result = 0
}

int computeRedisScoreIsReceiverLinkedToRedisImport(CallExpr expr) {
	if isReceiverLinkedToImport(expr.getReceiver(), "redis")
	then result = 1
	else result = 0
}

int computeRedisScoreIsRedisCallAstNodeLinkedToApiCallAstNode(CallExpr expr) {
	if expr instanceof RedisCall and isAstNodeLinkedToApiCallAstNode(expr.getParent())
	then result = 1
	else result = 0
}

int computeRedisScoreIsImport(CallExpr expr) {
	if isImport(expr, "redis")
	then result = 1
	else result = 0
}

// ----------------------------------------------------------- SCORE : API -----------------------------------------------------------

int computeApiScore(Expr expr, int nbFilter, int score) {
	nbFilter in [0 .. 10] and score in [0 .. 10] and
	
	if nbFilter = 0
    then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreIsApiCall(expr)))
	
	else if nbFilter = 1
	then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreIsApiCallStringFirstArgument(expr)))
	
	else if nbFilter = 2
	then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreIsApiCallFunctionSecondArgument(expr)))

	else if nbFilter = 3
	then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreIsApiCallStringFirstArgumentApiRouteLike(expr)))
	
	else if nbFilter = 4
    then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreMatchWithApi(expr)))
	
	else if nbFilter = 5 
    then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreHasApiLikeReceiverName(expr)))
	
	else if nbFilter = 6
    then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreHasImportApi(expr)))
	
	else if nbFilter = 7
    then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreHasApiAssignation(expr)))
    
	else if nbFilter = 8
    then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreIsReceiverLinkedToApiAssignation(expr)))
	
	else if nbFilter = 9
    then result = computeApiScore(expr, nbFilter + 1, (score + computeApiScoreIsImportApi(expr)))
	
	else result = score
}

int computeApiScoreIsApiCall(Expr expr) {
	if expr instanceof ApiCall
	then result = 1
	else result = 0
}

int computeApiScoreIsApiCallStringFirstArgument(Expr expr) {
	if isString(expr.(ApiCall).getArgument(0))
	then result = 1
	else result = 0
}

int computeApiScoreIsApiCallStringFirstArgumentApiRouteLike(Expr expr) {
	if isApiRoute(expr.(ApiCall).getArgument(0))
	then result = 1
	else result = 0
}

int computeApiScoreIsApiCallFunctionSecondArgument(Expr expr) {
	if isFunction(expr.(ApiCall).getArgument(1))
	then result = 1
	else result = 0
}

int computeApiScoreMatchWithApi(Expr expr) {
	if isLike(expr.toString(), "express")
	then result = 1
	else result = 0
}

int computeApiScoreHasApiLikeReceiverName(Expr expr) {
	if expr instanceof CallExpr and isLike(expr.(CallExpr).getReceiver().toString(), "app")
	then result = 1
	else result = 0
}

int computeApiScoreHasImportApi(Expr expr) {
	if hasImport(expr, "express") or hasImport(expr, "body-parser")
	then result = 1
	else result = 0
}

int computeApiScoreHasApiAssignation(Expr expr) {
	if hasApiAssignation(expr)
	then result = 1
	else result = 0
}

int computeApiScoreIsReceiverLinkedToApiAssignation(Expr expr) {
	if isReceiverLinkedToApiAssignation(expr.(CallExpr).getReceiver())
	then result = 1
	else result = 0
}

int computeApiScoreIsImportApi(Expr expr) {
	if isImport(expr, "express") or isImport(expr, "body-parser")
	then result = 1
	else result = 0
}