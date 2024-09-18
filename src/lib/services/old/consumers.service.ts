import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {USE_API_URL, USE_LOADER, USE_ERROR_HANDLER} from "common";
import {Observable} from "rxjs";

/** The base URL for the consumers API endpoint. */
const API_URL = "consumers/";

/** Represents a consumer with various properties. */
export type ConsumerLocationsResponse = {
  /**
   * The UUID of the consumer which identifies the consumer in the database and related HTTP requests.
   * @pattern ^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$
   */
  id: string;

  /** The name of the consumer. */
  name: string;

  /**
   * The consumer's location expressed as GeoJSON (Point Geometry).
   * Refer to GeoJSON schema for Point Geometry at https://geojson.org/schema/Point.json
   * and the complete schema at https://geojson.org/schema/GeoJSON.json
   */
  location: {
    crs: {
      type: "name",
      properties: {
        name: string
      }
    },
    type: "Point",
    coordinates: [number, number]
  } & object;

  /**
   * The consumer's default usage type.
   * This value is used as default value when creating new usage records for the consumer.
   */
  usageType: string;

  /** Description of the consumer. */
  description: string;

  /** Address of the consumer. */
  address: string;

  /**
   * Additional properties which may be used to store additional information about the consumer.
   * The properties are stored as JSON object in the database.
   * The key is a string and the value may be any valid JSON value.
   */
  additionalProperties: {
    [key: string]: any;
  };
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
  }> = {}): Observable<ConsumerLocationsResponse | null> {
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
