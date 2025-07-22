
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      addListener(eventName: string, handler: Function): void;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface MapMouseEvent {
      latLng: LatLng | null;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      animation?: Animation;
    }

    enum Animation {
      DROP = 1,
    }

    class Geocoder {
      constructor();
      geocode(request: GeocoderRequest): Promise<GeocoderResponse>;
    }

    interface GeocoderRequest {
      location?: LatLng | LatLngLiteral;
    }

    interface GeocoderResponse {
      results: GeocoderResult[];
    }

    interface GeocoderResult {
      formatted_address: string;
      address_components: AddressComponent[];
      geometry: {
        location: LatLng;
      };
    }

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    namespace places {
      class PlacesService {
        constructor(attrContainer: HTMLElement);
        textSearch(request: TextSearchRequest, callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void): void;
      }

      interface TextSearchRequest {
        query: string;
        fields?: string[];
      }

      interface PlaceResult {
        place_id?: string;
        formatted_address?: string;
        geometry?: {
          location?: LatLng;
        };
      }

      enum PlacesServiceStatus {
        OK = 'OK',
      }
    }
  }
}

export {};
