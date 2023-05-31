import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {USE_API_URL, USE_LOADER, USE_ERROR_HANDLER} from "common";
import {Observable} from "rxjs";

/** The base URL for the consumers API endpoint. */
const API_URL = "consumers/";

/**
 * The shape of the response returned by the
 * {@link ConsumersService#fetchConsumers} method.
 * @typedef {Object} ConsumerLocationsResponse
 * @property {number} id - The ID of the consumer.
 * @property {string} name - The name of the consumer.
 * @property {Object} geojson - The GeoJSON object representing the location of
 *   the consumer.
 * @property {Object} geojson.crs - The coordinate reference system (CRS) of
 *   the GeoJSON object.
 * @property {string} geojson.crs.type - The type of CRS.
 * @property {Object} geojson.crs.properties - The properties of the CRS.
 * @property {string} geojson.crs.properties.name - The name of the CRS.
 * @property {string} geojson.type - The type of GeoJSON object.
 * @property {Array} geojson.coordinates - The coordinates of the GeoJSON
 *   object.
 * @property {number} geojson.coordinates[0] - The longitude of the
 *   coordinates.
 * @property {number} geojson.coordinates[1] - The latitude of the coordinates.
 */
export type ConsumerLocationsResponse = {
  id: number,
  name: string,
  geojson: {
    crs: {
      type: "name",
      properties: {
        name: string
      }
    },
    type: "Point",
    coordinates: [number, number]
  }
}[];

/** Service for receiving consumers data. */
@Injectable({
  providedIn: 'root'
})
export class ConsumersService {
  /**
   * Constructor.
   * @param {HttpClient} http - The Angular HTTP client.
   * @param {Router} router - The Angular router.
   */
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Fetches a list of consumer locations from the API.
   * @param {Object} params - The parameters to include in the API request.
   * @param {number} params.usageAbove - Only return consumers with usage above
   *   this value.
   * @param {string[]} params.id - Only return consumers with the specified
   *   IDs.
   * @param {string[]} params.in - Only return consumers within the specified
   *   locations.
   * @returns {Observable<ConsumerLocationsResponse | null>} An observable that
   *   emits the API response or `null` if no consumers were found.
   */
  fetchConsumers(params: Partial<{
    usageAbove: number,
    id: string[],
    in: string[]
  }>): Observable<ConsumerLocationsResponse | null> {
    let url = this.router.parseUrl(API_URL);
    if (params.in) url.queryParams["in"] = params.in;
    if (params.id) url.queryParams["id"] = params.id;
    if (params.usageAbove) url.queryParams["usage_above"] = params.usageAbove;
    return this.http.get(url.toString(), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      responseType: "json",
      context: new HttpContext()
        .set(USE_API_URL, true)
        .set(USE_LOADER, true)
        .set(USE_ERROR_HANDLER, USE_ERROR_HANDLER.handler.TOAST)
    }) as Observable<ConsumerLocationsResponse>;
  }
}
