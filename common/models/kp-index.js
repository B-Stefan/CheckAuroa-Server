
import moment from "moment"
module.exports = function(KpIndex) {
  KpIndex.observe('access', function(ctx, next) {
    next()

  });
};
