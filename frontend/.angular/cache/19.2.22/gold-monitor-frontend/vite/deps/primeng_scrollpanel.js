import {
  BaseComponent
} from "./chunk-34OKWSLW.js";
import {
  BaseStyle
} from "./chunk-R33MQHRC.js";
import {
  PrimeTemplate,
  SharedModule,
  addClass,
  getHeight,
  removeClass,
  uuid
} from "./chunk-NUSUZZEF.js";
import {
  CommonModule,
  NgClass,
  NgStyle,
  NgTemplateOutlet
} from "./chunk-MFD7EYW4.js";
import {
  isPlatformBrowser
} from "./chunk-PP55DOIE.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Injectable,
  Input,
  NgModule,
  NgZone,
  ViewChild,
  ViewEncapsulation,
  inject,
  numberAttribute,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵviewQuery
} from "./chunk-7EEOF5RR.js";
import "./chunk-P6U2JBMQ.js";
import "./chunk-3OV72XIM.js";

// node_modules/primeng/fesm2022/primeng-scrollpanel.mjs
var _c0 = ["content"];
var _c1 = ["container"];
var _c2 = ["xBar"];
var _c3 = ["yBar"];
var _c4 = ["*"];
function ScrollPanel_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function ScrollPanel_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
var theme = ({
  dt
}) => `
.p-scrollpanel-content-container {
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;
    float: left;
}

.p-scrollpanel-content {
    height: calc(100% + calc(2 * ${dt("scrollpanel.bar.size")}));
    width: calc(100% + calc(2 * ${dt("scrollpanel.bar.size")}));
    padding-inline: 0 calc(2 * ${dt("scrollpanel.bar.size")});
    padding-block: 0 calc(2 * ${dt("scrollpanel.bar.size")});
    position: relative;
    overflow: auto;
    box-sizing: border-box;
    scrollbar-width: none;
}

.p-scrollpanel-content::-webkit-scrollbar {
    display: none;
}

.p-scrollpanel-bar {
    position: relative;
    border-radius: ${dt("scrollpanel.bar.border.radius")};
    z-index: 2;
    cursor: pointer;
    opacity: 0;
    outline-color: transparent;
    transition: outline-color ${dt("scrollpanel.transition.duration")};
    background: ${dt("scrollpanel.bar.background")};
    border: 0 none;
    transition: outline-color ${dt("scrollpanel.transition.duration")}, opacity ${dt("scrollpanel.transition.duration")};
}

.p-scrollpanel-bar:focus-visible {
    box-shadow: ${dt("scrollpanel.bar.focus.ring.shadow")};
    outline: ${dt("scrollpanel.barfocus.ring.width")} ${dt("scrollpanel.bar.focus.ring.style")} ${dt("scrollpanel.bar.focus.ring.color")};
    outline-offset: ${dt("scrollpanel.barfocus.ring.offset")};
}

.p-scrollpanel-bar-y {
    width: ${dt("scrollpanel.bar.size")};
    top: 0;
}

.p-scrollpanel-bar-x {
    height: ${dt("scrollpanel.bar.size")};
    bottom: 0;
}

.p-scrollpanel-hidden {
    visibility: hidden;
}

.p-scrollpanel:hover .p-scrollpanel-bar,
.p-scrollpanel:active .p-scrollpanel-bar {
    opacity: 1;
}

.p-scrollpanel-grabbed {
    user-select: none;
}
`;
var classes = {
  root: "p-scrollpanel p-component",
  contentContainer: "p-scrollpanel-content-container",
  content: "p-scrollpanel-content",
  barX: "p-scrollpanel-bar p-scrollpanel-bar-x",
  barY: "p-scrollpanel-bar p-scrollpanel-bar-y"
};
var ScrollPanelStyle = class _ScrollPanelStyle extends BaseStyle {
  name = "scrollpanel";
  theme = theme;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵScrollPanelStyle_BaseFactory;
    return function ScrollPanelStyle_Factory(__ngFactoryType__) {
      return (ɵScrollPanelStyle_BaseFactory || (ɵScrollPanelStyle_BaseFactory = ɵɵgetInheritedFactory(_ScrollPanelStyle)))(__ngFactoryType__ || _ScrollPanelStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ScrollPanelStyle,
    factory: _ScrollPanelStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollPanelStyle, [{
    type: Injectable
  }], null, null);
})();
var ScrollPanelClasses;
(function(ScrollPanelClasses2) {
  ScrollPanelClasses2["root"] = "p-scrollpanel";
  ScrollPanelClasses2["contentContainer"] = "p-scrollpanel-content-container";
  ScrollPanelClasses2["content"] = "p-scrollpanel-content";
  ScrollPanelClasses2["barX"] = "p-scrollpanel-bar-x";
  ScrollPanelClasses2["barY"] = "p-scrollpanel-bar-y";
})(ScrollPanelClasses || (ScrollPanelClasses = {}));
var ScrollPanel = class _ScrollPanel extends BaseComponent {
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  /**
   * Style class of the component.
   * @group Props
   */
  styleClass;
  /**
   * Step factor to scroll the content while pressing the arrow keys.
   * @group Props
   */
  step = 5;
  containerViewChild;
  contentViewChild;
  xBarViewChild;
  yBarViewChild;
  /**
   * Defines template option for content.
   * @group Templates
   */
  contentTemplate;
  templates;
  _contentTemplate;
  scrollYRatio;
  scrollXRatio;
  timeoutFrame = (fn) => setTimeout(fn, 0);
  initialized = false;
  lastPageY;
  lastPageX;
  isXBarClicked = false;
  isYBarClicked = false;
  lastScrollLeft = 0;
  lastScrollTop = 0;
  orientation = "vertical";
  timer;
  contentId;
  windowResizeListener;
  contentScrollListener;
  mouseEnterListener;
  xBarMouseDownListener;
  yBarMouseDownListener;
  documentMouseMoveListener;
  documentMouseUpListener;
  _componentStyle = inject(ScrollPanelStyle);
  zone = inject(NgZone);
  ngOnInit() {
    super.ngOnInit();
    this.contentId = uuid("pn_id_") + "_content";
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.moveBar();
        this.moveBar = this.moveBar.bind(this);
        this.onXBarMouseDown = this.onXBarMouseDown.bind(this);
        this.onYBarMouseDown = this.onYBarMouseDown.bind(this);
        this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
        this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
        this.windowResizeListener = this.renderer.listen(window, "resize", this.moveBar);
        this.contentScrollListener = this.renderer.listen(this.contentViewChild.nativeElement, "scroll", this.moveBar);
        this.mouseEnterListener = this.renderer.listen(this.contentViewChild.nativeElement, "mouseenter", this.moveBar);
        this.xBarMouseDownListener = this.renderer.listen(this.xBarViewChild.nativeElement, "mousedown", this.onXBarMouseDown);
        this.yBarMouseDownListener = this.renderer.listen(this.yBarViewChild.nativeElement, "mousedown", this.onYBarMouseDown);
        this.calculateContainerHeight();
        this.initialized = true;
      });
    }
  }
  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case "content":
          this._contentTemplate = item.template;
          break;
        default:
          this._contentTemplate = item.template;
          break;
      }
    });
  }
  calculateContainerHeight() {
    let container = this.containerViewChild.nativeElement;
    let content = this.contentViewChild.nativeElement;
    let xBar = this.xBarViewChild.nativeElement;
    const window2 = this.document.defaultView;
    let containerStyles = window2.getComputedStyle(container), xBarStyles = window2.getComputedStyle(xBar), pureContainerHeight = getHeight(container) - parseInt(xBarStyles["height"], 10);
    if (containerStyles["max-height"] != "none" && pureContainerHeight == 0) {
      if (content.offsetHeight + parseInt(xBarStyles["height"], 10) > parseInt(containerStyles["max-height"], 10)) {
        container.style.height = containerStyles["max-height"];
      } else {
        container.style.height = content.offsetHeight + parseFloat(containerStyles.paddingTop) + parseFloat(containerStyles.paddingBottom) + parseFloat(containerStyles.borderTopWidth) + parseFloat(containerStyles.borderBottomWidth) + "px";
      }
    }
  }
  moveBar() {
    let container = this.containerViewChild.nativeElement;
    let content = this.contentViewChild.nativeElement;
    let xBar = this.xBarViewChild.nativeElement;
    let totalWidth = content.scrollWidth;
    let ownWidth = content.clientWidth;
    let bottom = (container.clientHeight - xBar.clientHeight) * -1;
    this.scrollXRatio = ownWidth / totalWidth;
    let yBar = this.yBarViewChild.nativeElement;
    let totalHeight = content.scrollHeight;
    let ownHeight = content.clientHeight;
    let right = (container.clientWidth - yBar.clientWidth) * -1;
    this.scrollYRatio = ownHeight / totalHeight;
    this.requestAnimationFrame(() => {
      if (this.scrollXRatio >= 1) {
        xBar.setAttribute("data-p-scrollpanel-hidden", "true");
        addClass(xBar, "p-scrollpanel-hidden");
      } else {
        xBar.setAttribute("data-p-scrollpanel-hidden", "false");
        removeClass(xBar, "p-scrollpanel-hidden");
        const xBarWidth = Math.max(this.scrollXRatio * 100, 10);
        const xBarLeft = Math.abs(content.scrollLeft * (100 - xBarWidth) / (totalWidth - ownWidth));
        xBar.style.cssText = "width:" + xBarWidth + "%; inset-inline-start:" + xBarLeft + "%;bottom:" + bottom + "px;";
      }
      if (this.scrollYRatio >= 1) {
        yBar.setAttribute("data-p-scrollpanel-hidden", "true");
        addClass(yBar, "p-scrollpanel-hidden");
      } else {
        yBar.setAttribute("data-p-scrollpanel-hidden", "false");
        removeClass(yBar, "p-scrollpanel-hidden");
        const yBarHeight = Math.max(this.scrollYRatio * 100, 10);
        const yBarTop = content.scrollTop * (100 - yBarHeight) / (totalHeight - ownHeight);
        yBar.style.cssText = "height:" + yBarHeight + "%; top: calc(" + yBarTop + "% - " + xBar.clientHeight + "px); inset-inline-end:" + right + "px;";
      }
    });
    this.cd.markForCheck();
  }
  onScroll(event) {
    if (this.lastScrollLeft !== event.target.scrollLeft) {
      this.lastScrollLeft = event.target.scrollLeft;
      this.orientation = "horizontal";
    } else if (this.lastScrollTop !== event.target.scrollTop) {
      this.lastScrollTop = event.target.scrollTop;
      this.orientation = "vertical";
    }
    this.moveBar();
  }
  onKeyDown(event) {
    if (this.orientation === "vertical") {
      switch (event.code) {
        case "ArrowDown": {
          this.setTimer("scrollTop", this.step);
          event.preventDefault();
          break;
        }
        case "ArrowUp": {
          this.setTimer("scrollTop", this.step * -1);
          event.preventDefault();
          break;
        }
        case "ArrowLeft":
        case "ArrowRight": {
          event.preventDefault();
          break;
        }
        default:
          break;
      }
    } else if (this.orientation === "horizontal") {
      switch (event.code) {
        case "ArrowRight": {
          this.setTimer("scrollLeft", this.step);
          event.preventDefault();
          break;
        }
        case "ArrowLeft": {
          this.setTimer("scrollLeft", this.step * -1);
          event.preventDefault();
          break;
        }
        case "ArrowDown":
        case "ArrowUp": {
          event.preventDefault();
          break;
        }
        default:
          break;
      }
    }
  }
  onKeyUp() {
    this.clearTimer();
  }
  repeat(bar, step) {
    this.contentViewChild.nativeElement[bar] += step;
    this.moveBar();
  }
  setTimer(bar, step) {
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.repeat(bar, step);
    }, 40);
  }
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  bindDocumentMouseListeners() {
    if (!this.documentMouseMoveListener) {
      this.documentMouseMoveListener = (e) => {
        this.onDocumentMouseMove(e);
      };
      this.document.addEventListener("mousemove", this.documentMouseMoveListener);
    }
    if (!this.documentMouseUpListener) {
      this.documentMouseUpListener = (e) => {
        this.onDocumentMouseUp(e);
      };
      this.document.addEventListener("mouseup", this.documentMouseUpListener);
    }
  }
  unbindDocumentMouseListeners() {
    if (this.documentMouseMoveListener) {
      this.document.removeEventListener("mousemove", this.documentMouseMoveListener);
      this.documentMouseMoveListener = null;
    }
    if (this.documentMouseUpListener) {
      document.removeEventListener("mouseup", this.documentMouseUpListener);
      this.documentMouseUpListener = null;
    }
  }
  onYBarMouseDown(e) {
    this.isYBarClicked = true;
    this.yBarViewChild.nativeElement.focus();
    this.lastPageY = e.pageY;
    this.yBarViewChild.nativeElement.setAttribute("data-p-scrollpanel-grabbed", "true");
    addClass(this.yBarViewChild.nativeElement, "p-scrollpanel-grabbed");
    this.document.body.setAttribute("data-p-scrollpanel-grabbed", "true");
    addClass(this.document.body, "p-scrollpanel-grabbed");
    this.bindDocumentMouseListeners();
    e.preventDefault();
  }
  onXBarMouseDown(e) {
    this.isXBarClicked = true;
    this.xBarViewChild.nativeElement.focus();
    this.lastPageX = e.pageX;
    this.xBarViewChild.nativeElement.setAttribute("data-p-scrollpanel-grabbed", "false");
    addClass(this.xBarViewChild.nativeElement, "p-scrollpanel-grabbed");
    this.document.body.setAttribute("data-p-scrollpanel-grabbed", "false");
    addClass(this.document.body, "p-scrollpanel-grabbed");
    this.bindDocumentMouseListeners();
    e.preventDefault();
  }
  onDocumentMouseMove(e) {
    if (this.isXBarClicked) {
      this.onMouseMoveForXBar(e);
    } else if (this.isYBarClicked) {
      this.onMouseMoveForYBar(e);
    } else {
      this.onMouseMoveForXBar(e);
      this.onMouseMoveForYBar(e);
    }
  }
  onMouseMoveForXBar(e) {
    let deltaX = e.pageX - this.lastPageX;
    this.lastPageX = e.pageX;
    this.requestAnimationFrame(() => {
      this.contentViewChild.nativeElement.scrollLeft += deltaX / this.scrollXRatio;
    });
  }
  onMouseMoveForYBar(e) {
    let deltaY = e.pageY - this.lastPageY;
    this.lastPageY = e.pageY;
    this.requestAnimationFrame(() => {
      this.contentViewChild.nativeElement.scrollTop += deltaY / this.scrollYRatio;
    });
  }
  /**
   * Scrolls the top location to the given value.
   * @param scrollTop
   * @group Method
   */
  scrollTop(scrollTop) {
    let scrollableHeight = this.contentViewChild.nativeElement.scrollHeight - this.contentViewChild.nativeElement.clientHeight;
    scrollTop = scrollTop > scrollableHeight ? scrollableHeight : scrollTop > 0 ? scrollTop : 0;
    this.contentViewChild.nativeElement.scrollTop = scrollTop;
  }
  onFocus(event) {
    if (this.xBarViewChild.nativeElement.isSameNode(event.target)) {
      this.orientation = "horizontal";
    } else if (this.yBarViewChild.nativeElement.isSameNode(event.target)) {
      this.orientation = "vertical";
    }
  }
  onBlur() {
    if (this.orientation === "horizontal") {
      this.orientation = "vertical";
    }
  }
  onDocumentMouseUp(e) {
    this.yBarViewChild.nativeElement.setAttribute("data-p-scrollpanel-grabbed", "false");
    removeClass(this.yBarViewChild.nativeElement, "p-scrollpanel-grabbed");
    this.xBarViewChild.nativeElement.setAttribute("data-p-scrollpanel-grabbed", "false");
    removeClass(this.xBarViewChild.nativeElement, "p-scrollpanel-grabbed");
    this.document.body.setAttribute("data-p-scrollpanel-grabbed", "false");
    removeClass(this.document.body, "p-scrollpanel-grabbed");
    this.unbindDocumentMouseListeners();
    this.isXBarClicked = false;
    this.isYBarClicked = false;
  }
  requestAnimationFrame(f) {
    let frame = window.requestAnimationFrame || this.timeoutFrame;
    frame(f);
  }
  unbindListeners() {
    if (this.windowResizeListener) {
      this.windowResizeListener();
      this.windowResizeListener = null;
    }
    if (this.contentScrollListener) {
      this.contentScrollListener();
      this.contentScrollListener = null;
    }
    if (this.mouseEnterListener) {
      this.mouseEnterListener();
      this.mouseEnterListener = null;
    }
    if (this.xBarMouseDownListener) {
      this.xBarMouseDownListener();
      this.xBarMouseDownListener = null;
    }
    if (this.yBarMouseDownListener) {
      this.yBarMouseDownListener();
      this.yBarMouseDownListener = null;
    }
  }
  ngOnDestroy() {
    if (this.initialized) {
      this.unbindListeners();
    }
  }
  /**
   * Refreshes the position and size of the scrollbar.
   * @group Method
   */
  refresh() {
    this.moveBar();
  }
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵScrollPanel_BaseFactory;
    return function ScrollPanel_Factory(__ngFactoryType__) {
      return (ɵScrollPanel_BaseFactory || (ɵScrollPanel_BaseFactory = ɵɵgetInheritedFactory(_ScrollPanel)))(__ngFactoryType__ || _ScrollPanel);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _ScrollPanel,
    selectors: [["p-scroll-panel"], ["p-scrollPanel"], ["p-scrollpanel"]],
    contentQueries: function ScrollPanel_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, _c0, 4);
        ɵɵcontentQuery(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.contentTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function ScrollPanel_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuery(_c1, 5);
        ɵɵviewQuery(_c0, 5);
        ɵɵviewQuery(_c2, 5);
        ɵɵviewQuery(_c3, 5);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.containerViewChild = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.contentViewChild = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.xBarViewChild = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.yBarViewChild = _t.first);
      }
    },
    inputs: {
      style: "style",
      styleClass: "styleClass",
      step: [2, "step", "step", numberAttribute]
    },
    features: [ɵɵProvidersFeature([ScrollPanelStyle]), ɵɵInheritDefinitionFeature],
    ngContentSelectors: _c4,
    decls: 11,
    vars: 17,
    consts: [["container", ""], ["content", ""], ["xBar", ""], ["yBar", ""], [3, "ngClass", "ngStyle"], [1, "p-scrollpanel-content-container"], [1, "p-scrollpanel-content", 3, "mouseenter", "scroll"], [4, "ngTemplateOutlet"], ["tabindex", "0", "role", "scrollbar", 1, "p-scrollpanel-bar", "p-scrollpanel-bar-x", 3, "mousedown", "keydown", "keyup", "focus", "blur"], ["tabindex", "0", "role", "scrollbar", 1, "p-scrollpanel-bar", "p-scrollpanel-bar-y", 3, "mousedown", "keydown", "keyup", "focus"]],
    template: function ScrollPanel_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵprojectionDef();
        ɵɵelementStart(0, "div", 4, 0)(2, "div", 5)(3, "div", 6, 1);
        ɵɵlistener("mouseenter", function ScrollPanel_Template_div_mouseenter_3_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.moveBar());
        })("scroll", function ScrollPanel_Template_div_scroll_3_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onScroll($event));
        });
        ɵɵtemplate(5, ScrollPanel_Conditional_5_Template, 1, 0)(6, ScrollPanel_ng_container_6_Template, 1, 0, "ng-container", 7);
        ɵɵelementEnd()();
        ɵɵelementStart(7, "div", 8, 2);
        ɵɵlistener("mousedown", function ScrollPanel_Template_div_mousedown_7_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onXBarMouseDown($event));
        })("keydown", function ScrollPanel_Template_div_keydown_7_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onKeyDown($event));
        })("keyup", function ScrollPanel_Template_div_keyup_7_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onKeyUp());
        })("focus", function ScrollPanel_Template_div_focus_7_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onFocus($event));
        })("blur", function ScrollPanel_Template_div_blur_7_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onBlur());
        });
        ɵɵelementEnd();
        ɵɵelementStart(9, "div", 9, 3);
        ɵɵlistener("mousedown", function ScrollPanel_Template_div_mousedown_9_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onYBarMouseDown($event));
        })("keydown", function ScrollPanel_Template_div_keydown_9_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onKeyDown($event));
        })("keyup", function ScrollPanel_Template_div_keyup_9_listener() {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onKeyUp());
        })("focus", function ScrollPanel_Template_div_focus_9_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onFocus($event));
        });
        ɵɵelementEnd()();
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.styleClass);
        ɵɵproperty("ngClass", "p-scrollpanel p-component")("ngStyle", ctx.style);
        ɵɵattribute("data-pc-name", "scrollpanel");
        ɵɵadvance(2);
        ɵɵattribute("data-pc-section", "wrapper");
        ɵɵadvance();
        ɵɵattribute("data-pc-section", "content");
        ɵɵadvance(2);
        ɵɵconditional(!ctx.contentTemplate && !ctx._contentTemplate ? 5 : -1);
        ɵɵadvance();
        ɵɵproperty("ngTemplateOutlet", ctx.contentTemplate || ctx._contentTemplate);
        ɵɵadvance();
        ɵɵattribute("aria-orientation", "horizontal")("aria-valuenow", ctx.lastScrollLeft)("data-pc-section", "barx")("aria-controls", ctx.contentId);
        ɵɵadvance(2);
        ɵɵattribute("aria-orientation", "vertical")("aria-valuenow", ctx.lastScrollTop)("data-pc-section", "bary")("aria-controls", ctx.contentId);
      }
    },
    dependencies: [CommonModule, NgClass, NgTemplateOutlet, NgStyle, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollPanel, [{
    type: Component,
    args: [{
      selector: "p-scroll-panel, p-scrollPanel, p-scrollpanel",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <div #container [ngClass]="'p-scrollpanel p-component'" [ngStyle]="style" [class]="styleClass" [attr.data-pc-name]="'scrollpanel'">
            <div class="p-scrollpanel-content-container" [attr.data-pc-section]="'wrapper'">
                <div #content class="p-scrollpanel-content" [attr.data-pc-section]="'content'" (mouseenter)="moveBar()" (scroll)="onScroll($event)">
                    @if (!contentTemplate && !_contentTemplate) {
                        <ng-content></ng-content>
                    }
                    <ng-container *ngTemplateOutlet="contentTemplate || _contentTemplate"></ng-container>
                </div>
            </div>
            <div
                #xBar
                class="p-scrollpanel-bar p-scrollpanel-bar-x"
                tabindex="0"
                role="scrollbar"
                [attr.aria-orientation]="'horizontal'"
                [attr.aria-valuenow]="lastScrollLeft"
                [attr.data-pc-section]="'barx'"
                [attr.aria-controls]="contentId"
                (mousedown)="onXBarMouseDown($event)"
                (keydown)="onKeyDown($event)"
                (keyup)="onKeyUp()"
                (focus)="onFocus($event)"
                (blur)="onBlur()"
            ></div>
            <div
                #yBar
                class="p-scrollpanel-bar p-scrollpanel-bar-y"
                tabindex="0"
                role="scrollbar"
                [attr.aria-orientation]="'vertical'"
                [attr.aria-valuenow]="lastScrollTop"
                [attr.data-pc-section]="'bary'"
                [attr.aria-controls]="contentId"
                (mousedown)="onYBarMouseDown($event)"
                (keydown)="onKeyDown($event)"
                (keyup)="onKeyUp()"
                (focus)="onFocus($event)"
            ></div>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [ScrollPanelStyle]
    }]
  }], null, {
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    step: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    containerViewChild: [{
      type: ViewChild,
      args: ["container"]
    }],
    contentViewChild: [{
      type: ViewChild,
      args: ["content"]
    }],
    xBarViewChild: [{
      type: ViewChild,
      args: ["xBar"]
    }],
    yBarViewChild: [{
      type: ViewChild,
      args: ["yBar"]
    }],
    contentTemplate: [{
      type: ContentChild,
      args: ["content", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var ScrollPanelModule = class _ScrollPanelModule {
  static ɵfac = function ScrollPanelModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScrollPanelModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _ScrollPanelModule,
    imports: [ScrollPanel, SharedModule],
    exports: [ScrollPanel, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [ScrollPanel, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollPanelModule, [{
    type: NgModule,
    args: [{
      imports: [ScrollPanel, SharedModule],
      exports: [ScrollPanel, SharedModule]
    }]
  }], null, null);
})();
export {
  ScrollPanel,
  ScrollPanelClasses,
  ScrollPanelModule,
  ScrollPanelStyle
};
//# sourceMappingURL=primeng_scrollpanel.js.map
