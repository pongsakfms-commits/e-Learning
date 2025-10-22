const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123';

function extractToken(req) {
  if (!req) {
    return null;
  }

  const headerToken = req.get && req.get('x-admin-token');
  const bodyToken = req.body ? req.body.adminToken : null;
  const queryToken = req.query ? req.query.adminToken : null;

  return headerToken || bodyToken || queryToken || null;
}

module.exports = (req, res, next) => {
  const token = extractToken(req);

  if (token && token === ADMIN_TOKEN) {
    req.adminToken = token;
    return next();
  }

  res.status(403);

  if (req.accepts('html')) {
    return res.render('unauthorized', {
      title: 'เข้าใช้งานไม่ได้',
      message: 'คุณไม่มีสิทธิ์ในการเข้าถึงหน้าจัดการผู้เรียน กรุณาระบุ adminToken ให้ถูกต้อง.',
    });
  }

  return res.json({ error: 'Unauthorized' });
};

module.exports.ADMIN_TOKEN = ADMIN_TOKEN;
