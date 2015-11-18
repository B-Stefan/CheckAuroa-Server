import RatingRoute from "./RatingsRoute"
import KpRoute from "./KpIndexRoute"
import WeatherRoute from "./WeatherRoute"

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
    weatherRoute;

    constructor(app ){
        this.app = app
        this.ratingRoute = new RatingRoute();
        this.kpRoute = new KpRoute();
        this.weatherRoute = new WeatherRoute();
        this.applyRoutes()

    }
    applyRoutes(){
        this.app.get(RatingRoute.URL                ,this.ratingRoute.getRatings.bind(this.ratingRoute));
        this.app.get(RatingRoute.URL                ,this.ratingRoute.getRatings.bind(this.ratingRoute));
        this.app.get(KpRoute.URL                    ,this.kpRoute.getKpIndexList.bind(this.kpRoute));
        this.app.get(KpRoute.URL_LAST_RATING        ,this.kpRoute.getLastIndex.bind(this.kpRoute));
        this.app.get(KpRoute.URL_LAST_RATING        ,this.kpRoute.getLastIndex.bind(this.kpRoute));
        this.app.get(WeatherRoute.URL               ,this.weatherRoute.getWeatherPrediction.bind(this.weatherRoute));
        this.app.get(WeatherRoute.URL_CURRENT       ,this.weatherRoute.getCurrentWeather.bind(this.weatherRoute));
    }
}