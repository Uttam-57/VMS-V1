/**
 * @file catchAsync.js
 * @description Utility helper for utils feature.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default { catchAsync };

export { catchAsync };
