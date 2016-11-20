import { Component, AfterViewInit } from "@angular/core";
import { Http, Response } from "@angular/http";
import { TimerObservable } from "rxjs/observable/TimerObservable";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { HDHRService } from "./hdhr.service";

@Component({
  selector: "my-app",
  // even though this is in the same folder in version control, we need the
  // relative path at runtime, which is in the app folder.
  templateUrl: "./app/app.component.html"
})

export class AppComponent implements AfterViewInit {

  device: string = "";
  devices = [];
  channels = [];
  percent = null;

  constructor(private hdhrService: HDHRService,
              private modalService: NgbModal) { }

  ngAfterViewInit() {
    this.hdhrService.loadDevices((devices: string[]) => {
      this.devices = devices;
    });
  }

  showDevice(device: string, content: any) {
    console.log(`Showing device...`);
    // let modal = document.getElementById("deviceModal");
    this.device = device;
    this.hdhrService.loadChannels(device, (channels) => {
      this.channels = channels;
      console.log(`Got channels ${JSON.stringify(channels)}`);
      this.modalService.open(content).result.then((result) => {
        console.log(`Closed with ${result}`);
      }, (reason) => {
        console.log(`Dismissed`);
      });
    });
  }
  /**
   * Scan for devices.
   */
  scanDevices() {
    console.log("Scannign for devices...");

    this.hdhrService.scanDevices((devices: string[]) => {
      console.log(`Devices ${JSON.stringify(devices)}`);
      this.devices = devices;
    }, (error: string) => {
      console.log(`Unable to scan devices: ${error}`);
    });
  }

  /**
   * Scan channels on a device.
   */
   scanChannels(device: string) {
     console.log(`Scanning device ${device}...`);

     this.hdhrService.scanChannels(device,
       (result: any) => {
       console.log(`Channel scan returns ${result}`);
       if (result.isScanning === true) {
         let timer = TimerObservable.create(2000, 2000);
         let subscription = timer.subscribe(t => {
           this.hdhrService.channelScanStatus(device, (result: any) => {
             this.percent = result.percentComplete;
             if (result.percentComplete === 100) {
               console.log("Scan complete");
               subscription.unsubscribe();
             }
           }, (error: string) => {
             console.log("Channel status check failed.");
           });
         });
       }
     }, (error: string) => {
       console.log(`Channel scan fails: ${error}`);
     });
   }
}
