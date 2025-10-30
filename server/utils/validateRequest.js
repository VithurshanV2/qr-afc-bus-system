export const requireFields = (res, body, fields) => {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];

    if (body[field] === undefined || body[field] === null) {
      res
        .status(400)
        .json({ success: false, message: `Missing required data: ${field}` });
      return false;
    }
  }
  return true;
};
