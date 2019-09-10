import Responses from '../utils/Responses';
import models from '../database/models';

const validateDeparture = (req, res, next) => {
  const userId = req.user.id;
  let { departureDate } = req.body;
  departureDate = new Date(departureDate).toISOString();
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  now = now.toISOString();
  if (departureDate < now) {
    Responses.setError(400, 'departureDate cannot come before the present day');
    return Responses.send(res);
  }
  models.Request.findOne({ where: { departureDate, userId } }).then(data => {
    if (data) {
      Responses.setError(409, 'You already have a trip slated for '
      + `${req.body.departureDate}, you may opt for a multi-city request`);
      return Responses.send(res);
    }
    next();
  }).catch(() => {
    Responses.setError(500, 'database error');
    return Responses.send(res);
  });
};

export default { validateDeparture };
