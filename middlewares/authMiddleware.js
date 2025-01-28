function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, error: 'Unauthorized' });
    }
}

function ensureAdmin(req, res, next){
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({success: false, error: 'Forbidden' });
    }
}

function ensureDoctor(req, res, next){
    if (req.session && req.session.user && req.session.user.role === 'doctor') {
        next();
    } else {
         res.status(403).json({success: false, error: 'Forbidden' });
    }
}
module.exports = { ensureAuthenticated, ensureAdmin, ensureDoctor };