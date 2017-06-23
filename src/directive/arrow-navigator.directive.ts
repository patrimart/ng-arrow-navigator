
import {
  Directive, AfterViewInit, OnDestroy,
  Inject, Input, Output, ElementRef, EventEmitter,
} from "@angular/core";

import { Observable } from "rxjs/Observable";
import { fromEvent } from "rxjs/observable/fromEvent";
import "rxjs/add/operator/filter";


const directives = new Set<ArrowNavigatorDirective>();

const keyPresses$ = fromEvent(document.body, "keyup")
  .filter(() => directives.size > 1)
  .filter((e: KeyboardEvent) => e.code.startsWith("Arrow"))
  .subscribe(
    (e: KeyboardEvent) => {

      const arr: ArrowNavigatorDirective[] = [];
      const sortOn: ArrowNavigatorDirective[] = [];

      directives.forEach(d => {
        if (d.isSelected) {
          sortOn[0] = d;
        } else {
          arr.push(d);
        }
      });

      if (sortOn.length) {
        const selected = arr.filter(filterDirections(sortOn[0], e.code)).sort(distanceSort(sortOn[0]))[0]
        if (selected !== undefined) {
          selected.isSelected = true;
        }
      } else {
        arr[0].isSelected = true;
      }
    });


function distanceSort (o: ArrowNavigatorDirective) {
  const [x, y] = o.xy();
  return function (a: ArrowNavigatorDirective, b: ArrowNavigatorDirective): number {
    const [x1, y1] = a.xy(),
          [x2, y2] = b.xy();
    return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2)) - Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
  }
}

function filterDirections (o: ArrowNavigatorDirective, code: string) {
  const [x, y] = o.xy();
  return function (a: ArrowNavigatorDirective) {
    const [x1, y1] = a.xy();
    switch (code) {
      case "ArrowUp"   : return y > y1;
      case "ArrowDown" : return y < y1;
      case "ArrowLeft" : return x > x1;
      case "ArrowRight": return x < x1;
    }
  }
}




@Directive({
  selector: "[arrowNavigator]"
})
export class ArrowNavigatorDirective implements AfterViewInit, OnDestroy {

  @Output("arrowNavigatorChange") public arrowNavigatorChange = new EventEmitter<boolean>();

  private _isSelected = false;


  constructor (
    @Inject(ElementRef) private el: ElementRef,
  ) {
    console.log("ArrowNavigator constructor");
  }

  @Input("arrowNavigator")
  public set arrowNavigator (v: boolean) {
    this.isSelected = v;
  }


  public get isSelected (): boolean {
    return this._isSelected;
  }

  public set isSelected (v: boolean) {

    if (v) {
      this.el.nativeElement.focus();
      directives.forEach(d => { if (d !== this) { d.isSelected = false; }});
    }

    this._isSelected = v;
    this.arrowNavigatorChange.emit(v);
  }


  public ngAfterViewInit(): void {

    console.log("ArrowNavigator ngAfterViewInit");

    directives.add(this);
  }


  public ngOnDestroy(): void {
    console.log("ArrowNavigator ngOnDestroy");
    directives.delete(this);
  }

  public xy (): [number, number] {
    const bcr = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    return [bcr.left + bcr.width / 2, bcr.top + bcr.height / 2];
  }
}
