import { Injectable } from "@angular/core";
import { Http, Response, URLSearchParams } from "@angular/http";

// import "rxjs/add/operator/toPromise";
// import * as Rx from "rxjs/Observable";
// import "rxjs/Rx";
import "rxjs/add/operator/toPromise";

@Injectable()
export class HDHRService {

  constructor(private http: Http) { }

  loadDevices(success: (devices: string[]) => any) {
    this.http.get("/devices").subscribe(
      (response) => success(response.json() as string[]),
      (error) => success([]), // TODO this is probably a bad choice
      () => console.log("Devices loaded.")
    );
  }

  scanDevices(success: (response: string[]) => any,
              failure: (error: string) => any) {
    this.http.get("/scandevices").subscribe(
      (response) => success(response.json() as string[]),
      (error) => failure(error),
      () => console.log("Device scan complete.")
    );
  }

  loadChannels(device: string,
               success: (channels: any[]) => any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set("device", device);
    this.http.get("/channels", {search: params}).subscribe(
      (response) => success(response.json()),
      (error) => success([]),
      () => console.log("Channels loaded.")
    );
  }

  scanChannels(device: string,
               success: (channels: any) => any,
               failure: (error: string) => any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set("device", device);
    params.set("operation", "start");

    this.http.get("/scan", {search: params}).subscribe(
      (response) => {
        console.log(`Scan response is ${JSON.stringify(response.json())}`);
        success(response.json());
      },
      (error) => failure(error),
      () =>  {}
    );
  }

  channelScanStatus(device: string,
                    success: (channels: any) => any,
                    failure: (error: string) => any) {
    let params: URLSearchParams = new URLSearchParams();
    params.set("device", device);
    params.set("operation", "status");

    this.http.get("/scan", {search: params}).subscribe(
      (response) => {
        success(response.json());
      },
      (error) => failure(error),
      () => {}
    );
  }
}
