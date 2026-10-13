// Local disk enquiry storage is deliberately not used in serverless production.
module.exports = function enquiries(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    return res.end(JSON.stringify({error:'Use POST to submit an enquiry.'}));
  }
  res.statusCode = 503;
  res.end(JSON.stringify({error:'Online enquiries are not connected yet. Your details have not been saved or sent, and no appointment has been reserved.'}));
};
