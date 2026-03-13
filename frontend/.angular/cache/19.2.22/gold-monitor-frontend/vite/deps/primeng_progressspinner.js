import {
  BaseComponent
} from "./chunk-34OKWSLW.js";
import {
  BaseStyle
} from "./chunk-R33MQHRC.js";
import {
  SharedModule
} from "./chunk-NUSUZZEF.js";
import {
  CommonModule,
  NgClass,
  NgStyle
} from "./chunk-MFD7EYW4.js";
import "./chunk-PP55DOIE.js";
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  Input,
  NgModule,
  ViewEncapsulation,
  inject,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetInheritedFactory,
  ɵɵnamespaceSVG,
  ɵɵproperty,
  ɵɵstyleProp
} from "./chunk-7EEOF5RR.js";
import "./chunk-P6U2JBMQ.js";
import "./chunk-3OV72XIM.js";

// node_modules/primeng/fesm2022/primeng-progressspinner.mjs
var theme = ({
  dt
}) => `
.p-progressspinner {
    position: relative;
    margin: 0 auto;
    width: 100px;
    height: 100px;
    display: inline-block;
}

.p-progressspinner::before {
    content: "";
    display: block;
    padding-top: 100%;
}

.p-progressspinner-spin {
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    animation: p-progressspinner-rotate 2s linear infinite;
}

.p-progressspinner-circle {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: 0;
    stroke: ${dt("progressspinner.colorOne")};
    animation: p-progressspinner-dash 1.5s ease-in-out infinite, p-progressspinner-color 6s ease-in-out infinite;
    stroke-linecap: round;
}

@keyframes p-progressspinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}
@keyframes p-progressspinner-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}
@keyframes p-progressspinner-color {
    100%,
    0% {
        stroke: ${dt("progressspinner.colorOne")};
    }
    40% {
        stroke: ${dt("progressspinner.colorTwo")};
    }
    66% {
        stroke: ${dt("progressspinner.colorThree")};
    }
    80%,
    90% {
        stroke: ${dt("progressspinner.colorFour")};
    }
}
`;
var classes = {
  root: "p-progressspinner",
  spin: "p-progressspinner-spin",
  circle: "p-progressspinner-circle"
};
var ProgressSpinnerStyle = class _ProgressSpinnerStyle extends BaseStyle {
  name = "progressspinner";
  theme = theme;
  classes = classes;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵProgressSpinnerStyle_BaseFactory;
    return function ProgressSpinnerStyle_Factory(__ngFactoryType__) {
      return (ɵProgressSpinnerStyle_BaseFactory || (ɵProgressSpinnerStyle_BaseFactory = ɵɵgetInheritedFactory(_ProgressSpinnerStyle)))(__ngFactoryType__ || _ProgressSpinnerStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _ProgressSpinnerStyle,
    factory: _ProgressSpinnerStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressSpinnerStyle, [{
    type: Injectable
  }], null, null);
})();
var ProgressSpinnerClasses;
(function(ProgressSpinnerClasses2) {
  ProgressSpinnerClasses2["root"] = "p-progressspinner";
  ProgressSpinnerClasses2["spin"] = "p-progressspinner-spin";
  ProgressSpinnerClasses2["circle"] = "p-progressspinner-circle";
})(ProgressSpinnerClasses || (ProgressSpinnerClasses = {}));
var ProgressSpinner = class _ProgressSpinner extends BaseComponent {
  /**
   * Class of the element.
   * @group Props
   */
  styleClass;
  /**
   * Inline style of the element.
   * @group Props
   */
  style;
  /**
   * Width of the circle stroke.
   * @group Props
   */
  strokeWidth = "2";
  /**
   * Color for the background of the circle.
   * @group Props
   */
  fill = "none";
  /**
   * Duration of the rotate animation.
   * @group Props
   */
  animationDuration = "2s";
  /**
   * Used to define a aria label attribute the current element.
   * @group Props
   */
  ariaLabel;
  _componentStyle = inject(ProgressSpinnerStyle);
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵProgressSpinner_BaseFactory;
    return function ProgressSpinner_Factory(__ngFactoryType__) {
      return (ɵProgressSpinner_BaseFactory || (ɵProgressSpinner_BaseFactory = ɵɵgetInheritedFactory(_ProgressSpinner)))(__ngFactoryType__ || _ProgressSpinner);
    };
  })();
  static ɵcmp = ɵɵdefineComponent({
    type: _ProgressSpinner,
    selectors: [["p-progressSpinner"], ["p-progress-spinner"], ["p-progressspinner"]],
    inputs: {
      styleClass: "styleClass",
      style: "style",
      strokeWidth: "strokeWidth",
      fill: "fill",
      animationDuration: "animationDuration",
      ariaLabel: "ariaLabel"
    },
    features: [ɵɵProvidersFeature([ProgressSpinnerStyle]), ɵɵInheritDefinitionFeature],
    decls: 3,
    vars: 11,
    consts: [["role", "progressbar", 1, "p-progressspinner", 3, "ngStyle", "ngClass"], ["viewBox", "25 25 50 50", 1, "p-progressspinner-spin"], ["cx", "50", "cy", "50", "r", "20", "stroke-miterlimit", "10", 1, "p-progressspinner-circle"]],
    template: function ProgressSpinner_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵelementStart(0, "div", 0);
        ɵɵnamespaceSVG();
        ɵɵelementStart(1, "svg", 1);
        ɵɵelement(2, "circle", 2);
        ɵɵelementEnd()();
      }
      if (rf & 2) {
        ɵɵproperty("ngStyle", ctx.style)("ngClass", ctx.styleClass);
        ɵɵattribute("aria-label", ctx.ariaLabel)("aria-busy", true)("data-pc-name", "progressspinner")("data-pc-section", "root");
        ɵɵadvance();
        ɵɵstyleProp("animation-duration", ctx.animationDuration);
        ɵɵattribute("data-pc-section", "root");
        ɵɵadvance();
        ɵɵattribute("fill", ctx.fill)("stroke-width", ctx.strokeWidth);
      }
    },
    dependencies: [CommonModule, NgClass, NgStyle, SharedModule],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressSpinner, [{
    type: Component,
    args: [{
      selector: "p-progressSpinner, p-progress-spinner, p-progressspinner",
      standalone: true,
      imports: [CommonModule, SharedModule],
      template: `
        <div class="p-progressspinner" [ngStyle]="style" [ngClass]="styleClass" role="progressbar" [attr.aria-label]="ariaLabel" [attr.aria-busy]="true" [attr.data-pc-name]="'progressspinner'" [attr.data-pc-section]="'root'">
            <svg class="p-progressspinner-spin" viewBox="25 25 50 50" [style.animation-duration]="animationDuration" [attr.data-pc-section]="'root'">
                <circle class="p-progressspinner-circle" cx="50" cy="50" r="20" [attr.fill]="fill" [attr.stroke-width]="strokeWidth" stroke-miterlimit="10" />
            </svg>
        </div>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [ProgressSpinnerStyle]
    }]
  }], null, {
    styleClass: [{
      type: Input
    }],
    style: [{
      type: Input
    }],
    strokeWidth: [{
      type: Input
    }],
    fill: [{
      type: Input
    }],
    animationDuration: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }]
  });
})();
var ProgressSpinnerModule = class _ProgressSpinnerModule {
  static ɵfac = function ProgressSpinnerModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProgressSpinnerModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _ProgressSpinnerModule,
    imports: [ProgressSpinner, SharedModule],
    exports: [ProgressSpinner, SharedModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [ProgressSpinner, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressSpinnerModule, [{
    type: NgModule,
    args: [{
      imports: [ProgressSpinner, SharedModule],
      exports: [ProgressSpinner, SharedModule]
    }]
  }], null, null);
})();
export {
  ProgressSpinner,
  ProgressSpinnerClasses,
  ProgressSpinnerModule,
  ProgressSpinnerStyle
};
//# sourceMappingURL=primeng_progressspinner.js.map
