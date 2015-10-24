function ensureAuthenticated(req,res,next)
{
	if(req.isAuthenticated()){
		next();
	}else{
		res.sendStatus(404);
	}
}

module.exports = ensureAuthenticated;