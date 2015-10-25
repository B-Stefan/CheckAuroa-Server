import RatingRoute from "./RatingsRoute"

export default class Router {

    /**
     * @private
     * @type: connectApp
     */
    app;

    ratingRoute;
    locationRoute;
    notifyRoute;
    KpIndexRoute;

    constructor(app ){
        this.app = app
        this.ratingRoute = new RatingRoute();
        this.applyRoutes()

    }
    applyRoutes(){
        this.app.get(RatingRoute.URL                ,this.ratingRoute.getRatings.bind(this.ratingRoute));
        this.app.get(RatingRoute.URL_LAST_RATING    ,this.ratingRoute.getLastRating.bind(this.ratingRoute));
    }
}