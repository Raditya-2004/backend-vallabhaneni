export function adminAuth(req, res, next) {
	const auth = req.headers.authorization || '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
	if (!token || token !== process.env.ADMIN_TOKEN) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	return next();
}


