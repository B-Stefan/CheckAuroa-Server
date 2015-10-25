import RatingRoute from "./RatingsRoute"
import KpRoute from "./KpIndexRoute"

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
        this.kpRoute = new KpRoute();
        this.applyRoutes()

    }
    applyRoutes(){
        this.app.get(RatingRoute.URL                ,this.ratingRoute.getRatings.bind(this.ratingRoute));
        this.app.get(RatingRoute.URL                ,this.ratingRoute.getRatings.bind(this.ratingRoute));
        this.app.get(KpRoute.URL                    ,this.kpRoute.getKpIndexList.bind(this.kpRoute));
        this.app.get(KpRoute.URL_LAST_RATING        ,this.kpRoute.getLastIndex.bind(this.kpRoute));
    }
}