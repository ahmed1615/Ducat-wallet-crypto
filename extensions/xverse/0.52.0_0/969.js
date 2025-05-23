"use strict";
(self.webpackChunkxverse_web_extension =
  self.webpackChunkxverse_web_extension || []).push([
  [969],
  {
    7969: (e, t, o) => {
      o.r(t), o.d(t, { connect_modal: () => n });
      var r = o(87260),
        a = o(52008);
      const i = () =>
          (() => {
            const e = !!window.chrome,
              t = window.navigator,
              o = t.vendor,
              r = void 0 !== window.opr,
              a = t.userAgent.includes("Edge"),
              i = /CriOS/.exec(t.userAgent),
              n = t.userAgent.includes("Mobile");
            return (
              !i &&
              null != e &&
              "Google Inc." === o &&
              !1 === r &&
              !1 === a &&
              !1 === n
            );
          })()
            ? "Chrome"
            : window.navigator.userAgent.includes("Firefox")
              ? "Firefox"
              : null,
        n = class {
          constructor(e) {
            (0, r.r)(this, e),
              (this.defaultProviders = void 0),
              (this.installedProviders = void 0),
              (this.persistSelection = void 0),
              (this.callback = void 0),
              (this.cancelCallback = void 0);
          }
          handleSelectProvider(e) {
            this.persistSelection && (0, a.s)(e), this.callback((0, a.b)(e));
          }
          handleCloseModal() {
            this.cancelCallback();
          }
          getBrowserUrl(e) {
            var t;
            return null !== (t = e.chromeWebStoreUrl) && void 0 !== t
              ? t
              : e.mozillaAddOnsUrl;
          }
          getMobileUrl(e) {
            var t;
            return null !== (t = e.iOSAppStoreUrl) && void 0 !== t
              ? t
              : e.googlePlayStoreUrl;
          }
          getInstallUrl(e, t, o) {
            var r, a, i, n, s, l, d, c, p, w;
            return "IOS" === o
              ? null !==
                  (a =
                    null !== (r = e.iOSAppStoreUrl) && void 0 !== r
                      ? r
                      : this.getBrowserUrl(e)) && void 0 !== a
                ? a
                : e.webUrl
              : "Chrome" === t
                ? null !==
                    (n =
                      null !== (i = e.chromeWebStoreUrl) && void 0 !== i
                        ? i
                        : this.getMobileUrl(e)) && void 0 !== n
                  ? n
                  : e.webUrl
                : "Firefox" === t
                  ? null !==
                      (l =
                        null !== (s = e.mozillaAddOnsUrl) && void 0 !== s
                          ? s
                          : this.getMobileUrl(e)) && void 0 !== l
                    ? l
                    : e.webUrl
                  : "Android" === o
                    ? null !==
                        (c =
                          null !== (d = e.googlePlayStoreUrl) && void 0 !== d
                            ? d
                            : this.getBrowserUrl(e)) && void 0 !== c
                      ? c
                      : e.webUrl
                    : null !==
                          (w =
                            null !== (p = this.getBrowserUrl(e)) && void 0 !== p
                              ? p
                              : e.webUrl) && void 0 !== w
                      ? w
                      : this.getMobileUrl(e);
          }
          render() {
            const e = i(),
              t = window.navigator.userAgent.includes("Mobile")
                ? window.navigator.userAgent.includes("iPhone")
                  ? "IOS"
                  : "Android"
                : null,
              o = this.defaultProviders.filter(
                (e) =>
                  -1 ===
                  this.installedProviders.findIndex((t) => t.id === e.id),
              ),
              a = this.installedProviders.length > 0,
              n = o.length > 0;
            return (0, r.h)(
              "div",
              {
                class:
                  "modal-container animate-in fade-in fixed inset-0 z-[8999] box-border flex h-full w-full items-end bg-[#00000040] md:items-center md:justify-center",
              },
              (0, r.h)("div", {
                class: "fixed inset-0 z-[8999]",
                onClick: () => this.handleCloseModal(),
              }),
              (0, r.h)(
                "div",
                {
                  class:
                    "modal-body animate-in md:zoom-in-50 slide-in-from-bottom md:slide-in-from-bottom-0 z-[9000] box-border flex max-h-[calc(100%-24px)] w-full max-w-full cursor-default flex-col overflow-y-scroll rounded-2xl rounded-b-none bg-white p-6 text-sm leading-snug shadow-[0_4px_5px_0_#00000005,0_16px_40px_0_#00000014] md:max-h-[calc(100%-48px)] md:w-[400px] md:rounded-b-2xl",
                },
                (0, r.h)(
                  "div",
                  { class: "flex flex-col space-y-[10px]" },
                  (0, r.h)(
                    "div",
                    { class: "flex items-center" },
                    (0, r.h)(
                      "div",
                      { class: "flex-1 text-xl font-medium text-[#242629]" },
                      "Connect a wallet",
                    ),
                    (0, r.h)(
                      "button",
                      {
                        class:
                          "rounded-full bg-transparent p-1 transition-colors hover:bg-gray-100 active:scale-95",
                        onClick: () => this.handleCloseModal(),
                      },
                      (0, r.h)("span", { class: "sr-only" }, "Close popup"),
                      (0, r.h)("img", {
                        src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTcgNyAxMCAxME0xNyA3IDcgMTciIHN0cm9rZT0iIzI0MjYyOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==",
                      }),
                    ),
                  ),
                  a
                    ? (0, r.h)(
                        "p",
                        null,
                        "Select the wallet you want to connect to.",
                      )
                    : (0, r.h)(
                        "p",
                        null,
                        "You don't have any wallets in your browser that support this app. You need to install a wallet to proceed.",
                      ),
                ),
                !t &&
                  !e &&
                  (0, r.h)(
                    "div",
                    {
                      class:
                        "mx-auto mt-4 rounded-xl bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500",
                    },
                    "Unfortunately, your browser isn't supported",
                  ),
                a &&
                  (0, r.h)(
                    "div",
                    { class: "mt-6" },
                    (0, r.h)(
                      "p",
                      { class: "mb-4 text-sm font-medium" },
                      "Installed wallets",
                    ),
                    (0, r.h)(
                      "ul",
                      { class: "space-y-3" },
                      this.installedProviders.map((e) =>
                        (0, r.h)(
                          "li",
                          {
                            class:
                              "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]",
                          },
                          (0, r.h)(
                            "div",
                            { class: "aspect-square basis-9 overflow-hidden" },
                            (0, r.h)("img", {
                              src: e.icon,
                              class: "h-full w-full rounded-[10px] bg-gray-700",
                            }),
                          ),
                          (0, r.h)(
                            "div",
                            { class: "flex-1" },
                            (0, r.h)(
                              "div",
                              { class: "text-sm font-medium text-[#242629]" },
                              e.name,
                            ),
                            e.webUrl &&
                              (0, r.h)(
                                "a",
                                {
                                  href: e.webUrl,
                                  class: "text-sm",
                                  rel: "noopener noreferrer",
                                },
                                new URL(e.webUrl).hostname,
                              ),
                          ),
                          (0, r.h)(
                            "button",
                            {
                              class:
                                "rounded-[10px] border border-[#333] bg-[#323232] px-4 py-2 text-sm font-medium text-[#EFEFEF] shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-all hover:bg-[#0C0C0D] hover:text-white hover:shadow-[0_8px_16px_0_#00000020] focus:outline focus:outline-[3px] active:scale-95",
                              onClick: () => this.handleSelectProvider(e.id),
                            },
                            "Connect",
                          ),
                        ),
                      ),
                    ),
                  ),
                n &&
                  (0, r.h)(
                    "div",
                    { class: "mt-6" },
                    a
                      ? (0, r.h)(
                          "p",
                          { class: "mb-4 text-sm font-medium" },
                          "Other wallets",
                        )
                      : (0, r.h)(
                          "div",
                          { class: "mb-5 flex justify-between" },
                          (0, r.h)(
                            "p",
                            { class: "text-sm font-medium" },
                            "Recommended wallets",
                          ),
                          (0, r.h)(
                            "a",
                            {
                              class:
                                "flex cursor-pointer items-center space-x-[5px] text-xs transition-colors hover:text-[#242629] hover:underline focus:underline",
                              href: "https://docs.hiro.so/what-is-a-wallet",
                              rel: "noopener noreferrer",
                              target: "_blank",
                            },
                            (0, r.h)(
                              "svg",
                              {
                                xmlns: "http://www.w3.org/2000/svg",
                                width: "14",
                                height: "14",
                                viewBox: "0 0 16 16",
                                fill: "none",
                              },
                              (0, r.h)("path", {
                                stroke: "#74777D",
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "1.2",
                                d: "M8.006 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z",
                              }),
                              (0, r.h)("path", {
                                stroke: "#74777D",
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "1.2",
                                d: "M5.97 5.9a2.1 2.1 0 0 1 4.08.7c0 1.4-2.1 2.1-2.1 2.1M8.006 11.5h.01",
                              }),
                            ),
                            (0, r.h)(
                              "p",
                              null,
                              "What is a wallet? ",
                              (0, r.h)(
                                "span",
                                { class: "align-text-bottom text-[9px]" },
                                "↗",
                              ),
                            ),
                          ),
                        ),
                    (0, r.h)(
                      "ul",
                      { class: "space-y-3" },
                      o.map((o) =>
                        (0, r.h)(
                          "li",
                          {
                            class:
                              "flex items-center gap-3 rounded-[10px] border border-[#EFEFF2] p-[14px]",
                          },
                          (0, r.h)(
                            "div",
                            { class: "aspect-square basis-9 overflow-hidden" },
                            (0, r.h)("img", {
                              src: o.icon,
                              class: "h-full w-full rounded-[10px] bg-gray-700",
                            }),
                          ),
                          (0, r.h)(
                            "div",
                            { class: "flex-1" },
                            (0, r.h)(
                              "div",
                              { class: "text-sm font-medium text-[#242629]" },
                              o.name,
                            ),
                            o.webUrl &&
                              (0, r.h)(
                                "a",
                                {
                                  href: o.webUrl,
                                  class: "text-sm",
                                  rel: "noopener noreferrer",
                                },
                                new URL(o.webUrl).hostname,
                              ),
                          ),
                          this.getInstallUrl(o, e, t) &&
                            (0, r.h)(
                              "a",
                              {
                                class:
                                  "rounded-[10px] border border-[#EFEFF2] px-4 py-2 text-sm font-medium shadow-[0_1px_2px_0_#0000000A] outline-[#FFBD7A] transition-colors hover:text-[#242629] hover:shadow-[0_1px_2px_0_#00000010] focus:outline focus:outline-[3px] active:scale-95",
                                href: this.getInstallUrl(o, e, t),
                                rel: "noopener noreferrer",
                                target: "_blank",
                              },
                              "Install →",
                            ),
                        ),
                      ),
                    ),
                  ),
              ),
            );
          }
          static get assetsDirs() {
            return ["assets"];
          }
          get modalEl() {
            return (0, r.g)(this);
          }
        };
      n.style =
        '*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;border:0 solid #e5e7eb;box-sizing:border-box}::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scroll-snap-strictness:proximity;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;}/*! tailwindcss v3.4.14 | MIT License | https://tailwindcss.com*/:after,:before{--tw-content:""}:host,html{-webkit-text-size-adjust:100%;font-feature-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-feature-settings:normal;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{font-feature-settings:inherit;color:inherit;font-family:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}:host{all:initial}.modal-container{color:#74777d;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol}.modal-body{-ms-overflow-style:none;scrollbar-width:none}.modal-body::-webkit-scrollbar{display:none}.sr-only{clip:rect(0,0,0,0);border-width:0;height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}.static{position:static}.fixed{position:fixed}.inset-0{inset:0}.z-\\[8999\\]{z-index:8999}.z-\\[9000\\]{z-index:9000}.mx-auto{margin-left:auto;margin-right:auto}.mb-4{margin-bottom:1rem}.mb-5{margin-bottom:1.25rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.box-border{box-sizing:border-box}.flex{display:flex}.aspect-square{aspect-ratio:1/1}.h-full{height:100%}.max-h-\\[calc\\(100\\%-24px\\)\\]{max-height:calc(100% - 24px)}.w-full{width:100%}.max-w-full{max-width:100%}.flex-1{flex:1 1 0%}.basis-9{flex-basis:2.25rem}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.flex-col{flex-direction:column}.items-end{align-items:flex-end}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-3{gap:.75rem}.space-x-\\[5px\\]>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(5px*(1 - var(--tw-space-x-reverse)));margin-right:calc(5px*var(--tw-space-x-reverse))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-\\[10px\\]>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(10px*var(--tw-space-y-reverse));margin-top:calc(10px*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-scroll{overflow-y:scroll}.rounded-2xl{border-radius:1rem}.rounded-\\[10px\\]{border-radius:10px}.rounded-full{border-radius:9999px}.rounded-xl{border-radius:.75rem}.rounded-b-none{border-bottom-left-radius:0;border-bottom-right-radius:0}.border{border-width:1px}.border-\\[\\#333\\]{--tw-border-opacity:1;border-color:rgb(51 51 51/var(--tw-border-opacity))}.border-\\[\\#EFEFF2\\]{--tw-border-opacity:1;border-color:rgb(239 239 242/var(--tw-border-opacity))}.bg-\\[\\#00000040\\]{background-color:#00000040}.bg-\\[\\#323232\\]{--tw-bg-opacity:1;background-color:rgb(50 50 50/var(--tw-bg-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.bg-transparent{background-color:transparent}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-6{padding:1.5rem}.p-\\[14px\\]{padding:14px}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1\\.5{padding-bottom:.375rem;padding-top:.375rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.align-text-bottom{vertical-align:text-bottom}.text-\\[9px\\]{font-size:9px}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-medium{font-weight:500}.leading-snug{line-height:1.375}.text-\\[\\#242629\\]{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.text-\\[\\#EFEFEF\\]{--tw-text-opacity:1;color:rgb(239 239 239/var(--tw-text-opacity))}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color)}.shadow,.shadow-\\[0_1px_2px_0_\\#0000000A\\]{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-\\[0_1px_2px_0_\\#0000000A\\]{--tw-shadow:0 1px 2px 0 #0000000a;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-\\[0_4px_5px_0_\\#00000005\\2c 0_16px_40px_0_\\#00000014\\]{--tw-shadow:0 4px 5px 0 #00000005,0 16px 40px 0 #00000014;--tw-shadow-colored:0 4px 5px 0 var(--tw-shadow-color),0 16px 40px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.outline-\\[\\#FFBD7A\\]{outline-color:#ffbd7a}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-duration:.15s;transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1)}.transition-colors{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1)}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0) scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1)) rotate(var(--tw-enter-rotate,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0) scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1)) rotate(var(--tw-exit-rotate,0))}}.animate-in{--tw-enter-opacity:initial;--tw-enter-scale:initial;--tw-enter-rotate:initial;--tw-enter-translate-x:initial;--tw-enter-translate-y:initial;animation-duration:.15s;animation-name:enter}.fade-in{--tw-enter-opacity:0}.slide-in-from-bottom{--tw-enter-translate-y:100%}.hover\\:bg-\\[\\#0C0C0D\\]:hover{--tw-bg-opacity:1;background-color:rgb(12 12 13/var(--tw-bg-opacity))}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:text-\\[\\#242629\\]:hover{--tw-text-opacity:1;color:rgb(36 38 41/var(--tw-text-opacity))}.hover\\:text-white:hover{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover{--tw-shadow:0 1px 2px 0 #00000010;--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.hover\\:shadow-\\[0_1px_2px_0_\\#00000010\\]:hover,.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.hover\\:shadow-\\[0_8px_16px_0_\\#00000020\\]:hover{--tw-shadow:0 8px 16px 0 #00000020;--tw-shadow-colored:0 8px 16px 0 var(--tw-shadow-color)}.focus\\:underline:focus{text-decoration-line:underline}.focus\\:outline:focus{outline-style:solid}.focus\\:outline-\\[3px\\]:focus{outline-width:3px}.active\\:scale-95:active{--tw-scale-x:.95;--tw-scale-y:.95;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@media (min-width:768px){.md\\:max-h-\\[calc\\(100\\%-48px\\)\\]{max-height:calc(100% - 48px)}.md\\:w-\\[400px\\]{width:400px}.md\\:items-center{align-items:center}.md\\:justify-center{justify-content:center}.md\\:rounded-b-2xl{border-bottom-left-radius:1rem;border-bottom-right-radius:1rem}.md\\:zoom-in-50{--tw-enter-scale:.5}.md\\:slide-in-from-bottom-0{--tw-enter-translate-y:0px}}';
    },
  },
]);
