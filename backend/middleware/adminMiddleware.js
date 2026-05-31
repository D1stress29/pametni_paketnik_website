module.exports = function(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Dostop zavrnjen. Potrebna je vloga administratorja." });
    }
    next();
};