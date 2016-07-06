module.exports = function(Review) {

    Review.avergateratingbyItem = function(itemId, cb) {
        Review
            .find({
                "where": {
                    "itemId": itemId
                }
            })
            .then(function(rev) {
                var count = 0;
                var avgr = 0;
                var sum = 0;

                var rCount = rev.length;
                for (var i = 0; i < rCount; i++) {
                    var rating = rev[i].rating;
                    sum = sum + rating;
                    if (rating > 0)
                        count = count + 1;
                }

                if (count > 0) {
                    avgr = sum / count;
                } else
                    avgr = 0;

                cb(null, avgr);
            })
    };

    Review.reviewCounter = function(itemId, cb) {
        Review
            .find({
                "where": {
                    "itemId": itemId
                }
            })
            .then(function(rev) {
                var count = rev.length;
                cb(null, count);
            })
    };

    Review.ouathtrigger = function(cb) {
        cb(null, '');
    };

    Review.remoteMethod('avergateratingbyItem', {
        http: {
            path: '/avgrating',
            verb: 'get'
        },
        accepts: {
            arg: 'itemId',
            type: 'number'
        },
        returns: {
            arg: 'avgrating',
            type: 'integer'
        }
    });

    Review.remoteMethod('reviewCounter', {
        http: {
            path: '/counter',
            verb: 'get'
        },
        accepts: {
            arg: 'itemId',
            type: 'number'
        },
        returns: {
            arg: 'reviewCount',
            type: 'integer'
        }
    });

    Review.remoteMethod('ouathtrigger', {
        http: {
            path: '/oauth',
            verb: 'get'
        },
    });

};