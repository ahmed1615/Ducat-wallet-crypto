(() => {
  var e = {
      67557: (e, t) => {
        "use strict";
        function r(e) {
          if (!Number.isSafeInteger(e) || e < 0)
            throw new Error("positive integer expected, got " + e);
        }
        function n(e, ...t) {
          if (
            !(
              (r = e) instanceof Uint8Array ||
              (ArrayBuffer.isView(r) && "Uint8Array" === r.constructor.name)
            )
          )
            throw new Error("Uint8Array expected");
          var r;
          if (t.length > 0 && !t.includes(e.length))
            throw new Error(
              "Uint8Array expected of length " + t + ", got length=" + e.length,
            );
        }
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.anumber = r),
          (t.abytes = n),
          (t.ahash = function (e) {
            if ("function" != typeof e || "function" != typeof e.create)
              throw new Error(
                "Hash should be wrapped by utils.wrapConstructor",
              );
            r(e.outputLen), r(e.blockLen);
          }),
          (t.aexists = function (e, t = !0) {
            if (e.destroyed)
              throw new Error("Hash instance has been destroyed");
            if (t && e.finished)
              throw new Error("Hash#digest() has already been called");
          }),
          (t.aoutput = function (e, t) {
            n(e);
            const r = t.outputLen;
            if (e.length < r)
              throw new Error(
                "digestInto() expects output buffer of length at least " + r,
              );
          });
      },
      37202: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.HashMD = void 0),
          (t.setBigUint64 = i),
          (t.Chi = function (e, t, r) {
            return (e & t) ^ (~e & r);
          }),
          (t.Maj = function (e, t, r) {
            return (e & t) ^ (e & r) ^ (t & r);
          });
        const n = r(67557),
          s = r(99175);
        function i(e, t, r, n) {
          if ("function" == typeof e.setBigUint64)
            return e.setBigUint64(t, r, n);
          const s = BigInt(32),
            i = BigInt(4294967295),
            o = Number((r >> s) & i),
            a = Number(r & i),
            c = n ? 4 : 0,
            u = n ? 0 : 4;
          e.setUint32(t + c, o, n), e.setUint32(t + u, a, n);
        }
        class o extends s.Hash {
          constructor(e, t, r, n) {
            super(),
              (this.blockLen = e),
              (this.outputLen = t),
              (this.padOffset = r),
              (this.isLE = n),
              (this.finished = !1),
              (this.length = 0),
              (this.pos = 0),
              (this.destroyed = !1),
              (this.buffer = new Uint8Array(e)),
              (this.view = (0, s.createView)(this.buffer));
          }
          update(e) {
            (0, n.aexists)(this);
            const { view: t, buffer: r, blockLen: i } = this,
              o = (e = (0, s.toBytes)(e)).length;
            for (let n = 0; n < o; ) {
              const a = Math.min(i - this.pos, o - n);
              if (a !== i)
                r.set(e.subarray(n, n + a), this.pos),
                  (this.pos += a),
                  (n += a),
                  this.pos === i && (this.process(t, 0), (this.pos = 0));
              else {
                const t = (0, s.createView)(e);
                for (; i <= o - n; n += i) this.process(t, n);
              }
            }
            return (this.length += e.length), this.roundClean(), this;
          }
          digestInto(e) {
            (0, n.aexists)(this), (0, n.aoutput)(e, this), (this.finished = !0);
            const { buffer: t, view: r, blockLen: o, isLE: a } = this;
            let { pos: c } = this;
            (t[c++] = 128),
              this.buffer.subarray(c).fill(0),
              this.padOffset > o - c && (this.process(r, 0), (c = 0));
            for (let e = c; e < o; e++) t[e] = 0;
            i(r, o - 8, BigInt(8 * this.length), a), this.process(r, 0);
            const u = (0, s.createView)(e),
              f = this.outputLen;
            if (f % 4)
              throw new Error("_sha2: outputLen should be aligned to 32bit");
            const d = f / 4,
              l = this.get();
            if (d > l.length)
              throw new Error("_sha2: outputLen bigger than state");
            for (let e = 0; e < d; e++) u.setUint32(4 * e, l[e], a);
          }
          digest() {
            const { buffer: e, outputLen: t } = this;
            this.digestInto(e);
            const r = e.slice(0, t);
            return this.destroy(), r;
          }
          _cloneInto(e) {
            e || (e = new this.constructor()), e.set(...this.get());
            const {
              blockLen: t,
              buffer: r,
              length: n,
              finished: s,
              destroyed: i,
              pos: o,
            } = this;
            return (
              (e.length = n),
              (e.pos = o),
              (e.finished = s),
              (e.destroyed = i),
              n % t && e.buffer.set(r),
              e
            );
          }
        }
        t.HashMD = o;
      },
      25145: (e, t) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.crypto = void 0),
          (t.crypto =
            "object" == typeof globalThis && "crypto" in globalThis
              ? globalThis.crypto
              : void 0);
      },
      39615: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.hmac = t.HMAC = void 0);
        const n = r(67557),
          s = r(99175);
        class i extends s.Hash {
          constructor(e, t) {
            super(),
              (this.finished = !1),
              (this.destroyed = !1),
              (0, n.ahash)(e);
            const r = (0, s.toBytes)(t);
            if (
              ((this.iHash = e.create()),
              "function" != typeof this.iHash.update)
            )
              throw new Error(
                "Expected instance of class which extends utils.Hash",
              );
            (this.blockLen = this.iHash.blockLen),
              (this.outputLen = this.iHash.outputLen);
            const i = this.blockLen,
              o = new Uint8Array(i);
            o.set(r.length > i ? e.create().update(r).digest() : r);
            for (let e = 0; e < o.length; e++) o[e] ^= 54;
            this.iHash.update(o), (this.oHash = e.create());
            for (let e = 0; e < o.length; e++) o[e] ^= 106;
            this.oHash.update(o), o.fill(0);
          }
          update(e) {
            return (0, n.aexists)(this), this.iHash.update(e), this;
          }
          digestInto(e) {
            (0, n.aexists)(this),
              (0, n.abytes)(e, this.outputLen),
              (this.finished = !0),
              this.iHash.digestInto(e),
              this.oHash.update(e),
              this.oHash.digestInto(e),
              this.destroy();
          }
          digest() {
            const e = new Uint8Array(this.oHash.outputLen);
            return this.digestInto(e), e;
          }
          _cloneInto(e) {
            e || (e = Object.create(Object.getPrototypeOf(this), {}));
            const {
              oHash: t,
              iHash: r,
              finished: n,
              destroyed: s,
              blockLen: i,
              outputLen: o,
            } = this;
            return (
              (e.finished = n),
              (e.destroyed = s),
              (e.blockLen = i),
              (e.outputLen = o),
              (e.oHash = t._cloneInto(e.oHash)),
              (e.iHash = r._cloneInto(e.iHash)),
              e
            );
          }
          destroy() {
            (this.destroyed = !0), this.oHash.destroy(), this.iHash.destroy();
          }
        }
        t.HMAC = i;
        (t.hmac = (e, t, r) => new i(e, t).update(r).digest()),
          (t.hmac.create = (e, t) => new i(e, t));
      },
      22623: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.sha224 = t.sha256 = t.SHA256 = void 0);
        const n = r(37202),
          s = r(99175),
          i = new Uint32Array([
            1116352408, 1899447441, 3049323471, 3921009573, 961987163,
            1508970993, 2453635748, 2870763221, 3624381080, 310598401,
            607225278, 1426881987, 1925078388, 2162078206, 2614888103,
            3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983,
            1249150122, 1555081692, 1996064986, 2554220882, 2821834349,
            2952996808, 3210313671, 3336571891, 3584528711, 113926993,
            338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
            1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
            3259730800, 3345764771, 3516065817, 3600352804, 4094571909,
            275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
            1322822218, 1537002063, 1747873779, 1955562222, 2024104815,
            2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
            3329325298,
          ]),
          o = new Uint32Array([
            1779033703, 3144134277, 1013904242, 2773480762, 1359893119,
            2600822924, 528734635, 1541459225,
          ]),
          a = new Uint32Array(64);
        class c extends n.HashMD {
          constructor() {
            super(64, 32, 8, !1),
              (this.A = 0 | o[0]),
              (this.B = 0 | o[1]),
              (this.C = 0 | o[2]),
              (this.D = 0 | o[3]),
              (this.E = 0 | o[4]),
              (this.F = 0 | o[5]),
              (this.G = 0 | o[6]),
              (this.H = 0 | o[7]);
          }
          get() {
            const { A: e, B: t, C: r, D: n, E: s, F: i, G: o, H: a } = this;
            return [e, t, r, n, s, i, o, a];
          }
          set(e, t, r, n, s, i, o, a) {
            (this.A = 0 | e),
              (this.B = 0 | t),
              (this.C = 0 | r),
              (this.D = 0 | n),
              (this.E = 0 | s),
              (this.F = 0 | i),
              (this.G = 0 | o),
              (this.H = 0 | a);
          }
          process(e, t) {
            for (let r = 0; r < 16; r++, t += 4) a[r] = e.getUint32(t, !1);
            for (let e = 16; e < 64; e++) {
              const t = a[e - 15],
                r = a[e - 2],
                n = (0, s.rotr)(t, 7) ^ (0, s.rotr)(t, 18) ^ (t >>> 3),
                i = (0, s.rotr)(r, 17) ^ (0, s.rotr)(r, 19) ^ (r >>> 10);
              a[e] = (i + a[e - 7] + n + a[e - 16]) | 0;
            }
            let { A: r, B: o, C: c, D: u, E: f, F: d, G: l, H: h } = this;
            for (let e = 0; e < 64; e++) {
              const t =
                  (h +
                    ((0, s.rotr)(f, 6) ^
                      (0, s.rotr)(f, 11) ^
                      (0, s.rotr)(f, 25)) +
                    (0, n.Chi)(f, d, l) +
                    i[e] +
                    a[e]) |
                  0,
                p =
                  (((0, s.rotr)(r, 2) ^
                    (0, s.rotr)(r, 13) ^
                    (0, s.rotr)(r, 22)) +
                    (0, n.Maj)(r, o, c)) |
                  0;
              (h = l),
                (l = d),
                (d = f),
                (f = (u + t) | 0),
                (u = c),
                (c = o),
                (o = r),
                (r = (t + p) | 0);
            }
            (r = (r + this.A) | 0),
              (o = (o + this.B) | 0),
              (c = (c + this.C) | 0),
              (u = (u + this.D) | 0),
              (f = (f + this.E) | 0),
              (d = (d + this.F) | 0),
              (l = (l + this.G) | 0),
              (h = (h + this.H) | 0),
              this.set(r, o, c, u, f, d, l, h);
          }
          roundClean() {
            a.fill(0);
          }
          destroy() {
            this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
          }
        }
        t.SHA256 = c;
        class u extends c {
          constructor() {
            super(),
              (this.A = -1056596264),
              (this.B = 914150663),
              (this.C = 812702999),
              (this.D = -150054599),
              (this.E = -4191439),
              (this.F = 1750603025),
              (this.G = 1694076839),
              (this.H = -1090891868),
              (this.outputLen = 28);
          }
        }
        (t.sha256 = (0, s.wrapConstructor)(() => new c())),
          (t.sha224 = (0, s.wrapConstructor)(() => new u()));
      },
      99175: (e, t, r) => {
        "use strict";
        /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */ Object.defineProperty(
          t,
          "__esModule",
          { value: !0 },
        ),
          (t.Hash = t.nextTick = t.byteSwapIfBE = t.isLE = void 0),
          (t.isBytes = function (e) {
            return (
              e instanceof Uint8Array ||
              (ArrayBuffer.isView(e) && "Uint8Array" === e.constructor.name)
            );
          }),
          (t.u8 = function (e) {
            return new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
          }),
          (t.u32 = function (e) {
            return new Uint32Array(
              e.buffer,
              e.byteOffset,
              Math.floor(e.byteLength / 4),
            );
          }),
          (t.createView = function (e) {
            return new DataView(e.buffer, e.byteOffset, e.byteLength);
          }),
          (t.rotr = function (e, t) {
            return (e << (32 - t)) | (e >>> t);
          }),
          (t.rotl = function (e, t) {
            return (e << t) | ((e >>> (32 - t)) >>> 0);
          }),
          (t.byteSwap = i),
          (t.byteSwap32 = function (e) {
            for (let t = 0; t < e.length; t++) e[t] = i(e[t]);
          }),
          (t.bytesToHex = function (e) {
            (0, s.abytes)(e);
            let t = "";
            for (let r = 0; r < e.length; r++) t += o[e[r]];
            return t;
          }),
          (t.hexToBytes = function (e) {
            if ("string" != typeof e)
              throw new Error("hex string expected, got " + typeof e);
            const t = e.length,
              r = t / 2;
            if (t % 2)
              throw new Error(
                "hex string expected, got unpadded hex of length " + t,
              );
            const n = new Uint8Array(r);
            for (let t = 0, s = 0; t < r; t++, s += 2) {
              const r = c(e.charCodeAt(s)),
                i = c(e.charCodeAt(s + 1));
              if (void 0 === r || void 0 === i) {
                const t = e[s] + e[s + 1];
                throw new Error(
                  'hex string expected, got non-hex character "' +
                    t +
                    '" at index ' +
                    s,
                );
              }
              n[t] = 16 * r + i;
            }
            return n;
          }),
          (t.asyncLoop = async function (e, r, n) {
            let s = Date.now();
            for (let i = 0; i < e; i++) {
              n(i);
              const e = Date.now() - s;
              (e >= 0 && e < r) || (await (0, t.nextTick)(), (s += e));
            }
          }),
          (t.utf8ToBytes = u),
          (t.toBytes = f),
          (t.concatBytes = function (...e) {
            let t = 0;
            for (let r = 0; r < e.length; r++) {
              const n = e[r];
              (0, s.abytes)(n), (t += n.length);
            }
            const r = new Uint8Array(t);
            for (let t = 0, n = 0; t < e.length; t++) {
              const s = e[t];
              r.set(s, n), (n += s.length);
            }
            return r;
          }),
          (t.checkOpts = function (e, t) {
            if (void 0 !== t && "[object Object]" !== {}.toString.call(t))
              throw new Error("Options should be object or undefined");
            return Object.assign(e, t);
          }),
          (t.wrapConstructor = function (e) {
            const t = (t) => e().update(f(t)).digest(),
              r = e();
            return (
              (t.outputLen = r.outputLen),
              (t.blockLen = r.blockLen),
              (t.create = () => e()),
              t
            );
          }),
          (t.wrapConstructorWithOpts = function (e) {
            const t = (t, r) => e(r).update(f(t)).digest(),
              r = e({});
            return (
              (t.outputLen = r.outputLen),
              (t.blockLen = r.blockLen),
              (t.create = (t) => e(t)),
              t
            );
          }),
          (t.wrapXOFConstructorWithOpts = function (e) {
            const t = (t, r) => e(r).update(f(t)).digest(),
              r = e({});
            return (
              (t.outputLen = r.outputLen),
              (t.blockLen = r.blockLen),
              (t.create = (t) => e(t)),
              t
            );
          }),
          (t.randomBytes = function (e = 32) {
            if (n.crypto && "function" == typeof n.crypto.getRandomValues)
              return n.crypto.getRandomValues(new Uint8Array(e));
            if (n.crypto && "function" == typeof n.crypto.randomBytes)
              return n.crypto.randomBytes(e);
            throw new Error("crypto.getRandomValues must be defined");
          });
        const n = r(25145),
          s = r(67557);
        function i(e) {
          return (
            ((e << 24) & 4278190080) |
            ((e << 8) & 16711680) |
            ((e >>> 8) & 65280) |
            ((e >>> 24) & 255)
          );
        }
        (t.isLE =
          68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0]),
          (t.byteSwapIfBE = t.isLE ? (e) => e : (e) => i(e));
        const o = Array.from({ length: 256 }, (e, t) =>
          t.toString(16).padStart(2, "0"),
        );
        const a = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
        function c(e) {
          return e >= a._0 && e <= a._9
            ? e - a._0
            : e >= a.A && e <= a.F
              ? e - (a.A - 10)
              : e >= a.a && e <= a.f
                ? e - (a.a - 10)
                : void 0;
        }
        function u(e) {
          if ("string" != typeof e)
            throw new Error("utf8ToBytes expected string, got " + typeof e);
          return new Uint8Array(new TextEncoder().encode(e));
        }
        function f(e) {
          return "string" == typeof e && (e = u(e)), (0, s.abytes)(e), e;
        }
        t.nextTick = async () => {};
        t.Hash = class {
          clone() {
            return this._cloneInto();
          }
        };
      },
      9598: (e, t, r) => {
        "use strict";
        /*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */ Object.defineProperty(
          t,
          "__esModule",
          { value: !0 },
        ),
          (t.utils =
            t.schnorr =
            t.verify =
            t.signSync =
            t.sign =
            t.getSharedSecret =
            t.recoverPublicKey =
            t.getPublicKey =
            t.Signature =
            t.Point =
            t.CURVE =
              void 0);
        const n = r(14923),
          s = BigInt(0),
          i = BigInt(1),
          o = BigInt(2),
          a = BigInt(3),
          c = BigInt(8),
          u = Object.freeze({
            a: s,
            b: BigInt(7),
            P: BigInt(
              "0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
            ),
            n: BigInt(
              "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
            ),
            h: i,
            Gx: BigInt(
              "55066263022277343669578718895168534326250603453777594175500187360389116729240",
            ),
            Gy: BigInt(
              "32670510020758816978083085130507043184471273380659243275938904335757337482424",
            ),
            beta: BigInt(
              "0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
            ),
          });
        t.CURVE = u;
        const f = (e, t) => (e + t / o) / t,
          d = {
            beta: BigInt(
              "0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
            ),
            splitScalar(e) {
              const { n: t } = u,
                r = BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
                n = -i * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
                s = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
                o = r,
                a = BigInt("0x100000000000000000000000000000000"),
                c = f(o * e, t),
                d = f(-n * e, t);
              let l = z(e - c * r - d * s, t),
                h = z(-c * n - d * o, t);
              const p = l > a,
                y = h > a;
              if ((p && (l = t - l), y && (h = t - h), l > a || h > a))
                throw new Error("splitScalarEndo: Endomorphism failed, k=" + e);
              return { k1neg: p, k1: l, k2neg: y, k2: h };
            },
          },
          l = 32,
          h = 32;
        function p(e) {
          const { a: t, b: r } = u,
            n = z(e * e),
            s = z(n * e);
          return z(s + t * e + r);
        }
        const y = u.a === s;
        class g extends Error {
          constructor(e) {
            super(e);
          }
        }
        function w(e) {
          if (!(e instanceof m)) throw new TypeError("JacobianPoint expected");
        }
        class m {
          constructor(e, t, r) {
            (this.x = e), (this.y = t), (this.z = r);
          }
          static fromAffine(e) {
            if (!(e instanceof v))
              throw new TypeError("JacobianPoint#fromAffine: expected Point");
            return e.equals(v.ZERO) ? m.ZERO : new m(e.x, e.y, i);
          }
          static toAffineBatch(e) {
            const t = (function (e, t = u.P) {
              const r = new Array(e.length),
                n = _(
                  e.reduce(
                    (e, n, i) => (n === s ? e : ((r[i] = e), z(e * n, t))),
                    i,
                  ),
                  t,
                );
              return (
                e.reduceRight(
                  (e, n, i) =>
                    n === s ? e : ((r[i] = z(e * r[i], t)), z(e * n, t)),
                  n,
                ),
                r
              );
            })(e.map((e) => e.z));
            return e.map((e, r) => e.toAffine(t[r]));
          }
          static normalizeZ(e) {
            return m.toAffineBatch(e).map(m.fromAffine);
          }
          equals(e) {
            w(e);
            const { x: t, y: r, z: n } = this,
              { x: s, y: i, z: o } = e,
              a = z(n * n),
              c = z(o * o),
              u = z(t * c),
              f = z(s * a),
              d = z(z(r * o) * c),
              l = z(z(i * n) * a);
            return u === f && d === l;
          }
          negate() {
            return new m(this.x, z(-this.y), this.z);
          }
          double() {
            const { x: e, y: t, z: r } = this,
              n = z(e * e),
              s = z(t * t),
              i = z(s * s),
              u = e + s,
              f = z(o * (z(u * u) - n - i)),
              d = z(a * n),
              l = z(d * d),
              h = z(l - o * f),
              p = z(d * (f - h) - c * i),
              y = z(o * t * r);
            return new m(h, p, y);
          }
          add(e) {
            w(e);
            const { x: t, y: r, z: n } = this,
              { x: i, y: a, z: c } = e;
            if (i === s || a === s) return this;
            if (t === s || r === s) return e;
            const u = z(n * n),
              f = z(c * c),
              d = z(t * f),
              l = z(i * u),
              h = z(z(r * c) * f),
              p = z(z(a * n) * u),
              y = z(l - d),
              g = z(p - h);
            if (y === s) return g === s ? this.double() : m.ZERO;
            const b = z(y * y),
              E = z(y * b),
              v = z(d * b),
              M = z(g * g - E - o * v),
              A = z(g * (v - M) - h * E),
              I = z(n * c * y);
            return new m(M, A, I);
          }
          subtract(e) {
            return this.add(e.negate());
          }
          multiplyUnsafe(e) {
            const t = m.ZERO;
            if ("bigint" == typeof e && e === s) return t;
            let r = B(e);
            if (r === i) return this;
            if (!y) {
              let e = t,
                n = this;
              for (; r > s; )
                r & i && (e = e.add(n)), (n = n.double()), (r >>= i);
              return e;
            }
            let { k1neg: n, k1: o, k2neg: a, k2: c } = d.splitScalar(r),
              u = t,
              f = t,
              l = this;
            for (; o > s || c > s; )
              o & i && (u = u.add(l)),
                c & i && (f = f.add(l)),
                (l = l.double()),
                (o >>= i),
                (c >>= i);
            return (
              n && (u = u.negate()),
              a && (f = f.negate()),
              (f = new m(z(f.x * d.beta), f.y, f.z)),
              u.add(f)
            );
          }
          precomputeWindow(e) {
            const t = y ? 128 / e + 1 : 256 / e + 1,
              r = [];
            let n = this,
              s = n;
            for (let i = 0; i < t; i++) {
              (s = n), r.push(s);
              for (let t = 1; t < 2 ** (e - 1); t++) (s = s.add(n)), r.push(s);
              n = s.double();
            }
            return r;
          }
          wNAF(e, t) {
            !t && this.equals(m.BASE) && (t = v.BASE);
            const r = (t && t._WINDOW_SIZE) || 1;
            if (256 % r)
              throw new Error(
                "Point#wNAF: Invalid precomputation window, must be power of 2",
              );
            let n = t && E.get(t);
            n ||
              ((n = this.precomputeWindow(r)),
              t && 1 !== r && ((n = m.normalizeZ(n)), E.set(t, n)));
            let s = m.ZERO,
              o = m.BASE;
            const a = 1 + (y ? 128 / r : 256 / r),
              c = 2 ** (r - 1),
              u = BigInt(2 ** r - 1),
              f = 2 ** r,
              d = BigInt(r);
            for (let t = 0; t < a; t++) {
              const r = t * c;
              let a = Number(e & u);
              (e >>= d), a > c && ((a -= f), (e += i));
              const l = r,
                h = r + Math.abs(a) - 1,
                p = t % 2 != 0,
                y = a < 0;
              0 === a ? (o = o.add(b(p, n[l]))) : (s = s.add(b(y, n[h])));
            }
            return { p: s, f: o };
          }
          multiply(e, t) {
            let r,
              n,
              s = B(e);
            if (y) {
              const { k1neg: e, k1: i, k2neg: o, k2: a } = d.splitScalar(s);
              let { p: c, f: u } = this.wNAF(i, t),
                { p: f, f: l } = this.wNAF(a, t);
              (c = b(e, c)),
                (f = b(o, f)),
                (f = new m(z(f.x * d.beta), f.y, f.z)),
                (r = c.add(f)),
                (n = u.add(l));
            } else {
              const { p: e, f: i } = this.wNAF(s, t);
              (r = e), (n = i);
            }
            return m.normalizeZ([r, n])[0];
          }
          toAffine(e) {
            const { x: t, y: r, z: n } = this,
              s = this.equals(m.ZERO);
            null == e && (e = s ? c : _(n));
            const o = e,
              a = z(o * o),
              u = z(a * o),
              f = z(t * a),
              d = z(r * u),
              l = z(n * o);
            if (s) return v.ZERO;
            if (l !== i) throw new Error("invZ was invalid");
            return new v(f, d);
          }
        }
        function b(e, t) {
          const r = t.negate();
          return e ? r : t;
        }
        (m.BASE = new m(u.Gx, u.Gy, i)), (m.ZERO = new m(s, i, s));
        const E = new WeakMap();
        class v {
          constructor(e, t) {
            (this.x = e), (this.y = t);
          }
          _setWindowSize(e) {
            (this._WINDOW_SIZE = e), E.delete(this);
          }
          hasEvenY() {
            return this.y % o === s;
          }
          static fromCompressedHex(e) {
            const t = 32 === e.length,
              r = k(t ? e : e.subarray(1));
            if (!Q(r)) throw new Error("Point is not on curve");
            let n = (function (e) {
              const { P: t } = u,
                r = BigInt(6),
                n = BigInt(11),
                s = BigInt(22),
                i = BigInt(23),
                c = BigInt(44),
                f = BigInt(88),
                d = (e * e * e) % t,
                l = (d * d * e) % t,
                h = (U(l, a) * l) % t,
                p = (U(h, a) * l) % t,
                y = (U(p, o) * d) % t,
                g = (U(y, n) * y) % t,
                w = (U(g, s) * g) % t,
                m = (U(w, c) * w) % t,
                b = (U(m, f) * m) % t,
                E = (U(b, c) * w) % t,
                v = (U(E, a) * l) % t,
                M = (U(v, i) * g) % t,
                A = (U(M, r) * d) % t,
                I = U(A, o);
              if ((I * I) % t !== e) throw new Error("Cannot find square root");
              return I;
            })(p(r));
            const s = (n & i) === i;
            if (t) s && (n = z(-n));
            else {
              !(1 & ~e[0]) !== s && (n = z(-n));
            }
            const c = new v(r, n);
            return c.assertValidity(), c;
          }
          static fromUncompressedHex(e) {
            const t = k(e.subarray(1, 33)),
              r = k(e.subarray(33, 65)),
              n = new v(t, r);
            return n.assertValidity(), n;
          }
          static fromHex(e) {
            const t = C(e),
              r = t.length,
              n = t[0];
            if (r === l) return this.fromCompressedHex(t);
            if (33 === r && (2 === n || 3 === n))
              return this.fromCompressedHex(t);
            if (65 === r && 4 === n) return this.fromUncompressedHex(t);
            throw new Error(
              `Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${r}`,
            );
          }
          static fromPrivateKey(e) {
            return v.BASE.multiply(W(e));
          }
          static fromSignature(e, t, r) {
            const { r: n, s } = $(t);
            if (![0, 1, 2, 3].includes(r))
              throw new Error("Cannot recover: invalid recovery bit");
            const i = P(C(e)),
              { n: o } = u,
              a = 2 === r || 3 === r ? n + o : n,
              c = _(a, o),
              f = z(-i * c, o),
              d = z(s * c, o),
              l = 1 & r ? "03" : "02",
              h = v.fromHex(l + S(a)),
              p = v.BASE.multiplyAndAddUnsafe(h, f, d);
            if (!p)
              throw new Error("Cannot recover signature: point at infinify");
            return p.assertValidity(), p;
          }
          toRawBytes(e = !1) {
            return L(this.toHex(e));
          }
          toHex(e = !1) {
            const t = S(this.x);
            if (e) {
              return `${this.hasEvenY() ? "02" : "03"}${t}`;
            }
            return `04${t}${S(this.y)}`;
          }
          toHexX() {
            return this.toHex(!0).slice(2);
          }
          toRawX() {
            return this.toRawBytes(!0).slice(1);
          }
          assertValidity() {
            const e = "Point is not on elliptic curve",
              { x: t, y: r } = this;
            if (!Q(t) || !Q(r)) throw new Error(e);
            const n = z(r * r);
            if (z(n - p(t)) !== s) throw new Error(e);
          }
          equals(e) {
            return this.x === e.x && this.y === e.y;
          }
          negate() {
            return new v(this.x, z(-this.y));
          }
          double() {
            return m.fromAffine(this).double().toAffine();
          }
          add(e) {
            return m.fromAffine(this).add(m.fromAffine(e)).toAffine();
          }
          subtract(e) {
            return this.add(e.negate());
          }
          multiply(e) {
            return m.fromAffine(this).multiply(e, this).toAffine();
          }
          multiplyAndAddUnsafe(e, t, r) {
            const n = m.fromAffine(this),
              o =
                t === s || t === i || this !== v.BASE
                  ? n.multiplyUnsafe(t)
                  : n.multiply(t),
              a = m.fromAffine(e).multiplyUnsafe(r),
              c = o.add(a);
            return c.equals(m.ZERO) ? void 0 : c.toAffine();
          }
        }
        function M(e) {
          return Number.parseInt(e[0], 16) >= 8 ? "00" + e : e;
        }
        function A(e) {
          if (e.length < 2 || 2 !== e[0])
            throw new Error(`Invalid signature integer tag: ${x(e)}`);
          const t = e[1],
            r = e.subarray(2, t + 2);
          if (!t || r.length !== t)
            throw new Error("Invalid signature integer: wrong length");
          if (0 === r[0] && r[1] <= 127)
            throw new Error("Invalid signature integer: trailing length");
          return { data: k(r), left: e.subarray(t + 2) };
        }
        (t.Point = v), (v.BASE = new v(u.Gx, u.Gy)), (v.ZERO = new v(s, s));
        class I {
          constructor(e, t) {
            (this.r = e), (this.s = t), this.assertValidity();
          }
          static fromCompact(e) {
            const t = e instanceof Uint8Array,
              r = "Signature.fromCompact";
            if ("string" != typeof e && !t)
              throw new TypeError(`${r}: Expected string or Uint8Array`);
            const n = t ? x(e) : e;
            if (128 !== n.length) throw new Error(`${r}: Expected 64-byte hex`);
            return new I(D(n.slice(0, 64)), D(n.slice(64, 128)));
          }
          static fromDER(e) {
            const t = e instanceof Uint8Array;
            if ("string" != typeof e && !t)
              throw new TypeError(
                "Signature.fromDER: Expected string or Uint8Array",
              );
            const { r, s: n } = (function (e) {
              if (e.length < 2 || 48 != e[0])
                throw new Error(`Invalid signature tag: ${x(e)}`);
              if (e[1] !== e.length - 2)
                throw new Error("Invalid signature: incorrect length");
              const { data: t, left: r } = A(e.subarray(2)),
                { data: n, left: s } = A(r);
              if (s.length)
                throw new Error(
                  `Invalid signature: left bytes after parsing: ${x(s)}`,
                );
              return { r: t, s: n };
            })(t ? e : L(e));
            return new I(r, n);
          }
          static fromHex(e) {
            return this.fromDER(e);
          }
          assertValidity() {
            const { r: e, s: t } = this;
            if (!Y(e))
              throw new Error("Invalid Signature: r must be 0 < r < n");
            if (!Y(t))
              throw new Error("Invalid Signature: s must be 0 < s < n");
          }
          hasHighS() {
            const e = u.n >> i;
            return this.s > e;
          }
          normalizeS() {
            return this.hasHighS() ? new I(this.r, z(-this.s, u.n)) : this;
          }
          toDERRawBytes() {
            return L(this.toDERHex());
          }
          toDERHex() {
            const e = M(R(this.s)),
              t = M(R(this.r)),
              r = e.length / 2,
              n = t.length / 2,
              s = R(r),
              i = R(n);
            return `30${R(n + r + 4)}02${i}${t}02${s}${e}`;
          }
          toRawBytes() {
            return this.toDERRawBytes();
          }
          toHex() {
            return this.toDERHex();
          }
          toCompactRawBytes() {
            return L(this.toCompactHex());
          }
          toCompactHex() {
            return S(this.r) + S(this.s);
          }
        }
        function N(...e) {
          if (!e.every((e) => e instanceof Uint8Array))
            throw new Error("Uint8Array list expected");
          if (1 === e.length) return e[0];
          const t = e.reduce((e, t) => e + t.length, 0),
            r = new Uint8Array(t);
          for (let t = 0, n = 0; t < e.length; t++) {
            const s = e[t];
            r.set(s, n), (n += s.length);
          }
          return r;
        }
        t.Signature = I;
        const T = Array.from({ length: 256 }, (e, t) =>
          t.toString(16).padStart(2, "0"),
        );
        function x(e) {
          if (!(e instanceof Uint8Array))
            throw new Error("Expected Uint8Array");
          let t = "";
          for (let r = 0; r < e.length; r++) t += T[e[r]];
          return t;
        }
        const j = BigInt(
          "0x10000000000000000000000000000000000000000000000000000000000000000",
        );
        function S(e) {
          if ("bigint" != typeof e) throw new Error("Expected bigint");
          if (!(s <= e && e < j))
            throw new Error("Expected number 0 <= n < 2^256");
          return e.toString(16).padStart(64, "0");
        }
        function O(e) {
          const t = L(S(e));
          if (32 !== t.length) throw new Error("Error: expected 32 bytes");
          return t;
        }
        function R(e) {
          const t = e.toString(16);
          return 1 & t.length ? `0${t}` : t;
        }
        function D(e) {
          if ("string" != typeof e)
            throw new TypeError(
              "hexToNumber: expected string, got " + typeof e,
            );
          return BigInt(`0x${e}`);
        }
        function L(e) {
          if ("string" != typeof e)
            throw new TypeError("hexToBytes: expected string, got " + typeof e);
          if (e.length % 2)
            throw new Error(
              "hexToBytes: received invalid unpadded hex" + e.length,
            );
          const t = new Uint8Array(e.length / 2);
          for (let r = 0; r < t.length; r++) {
            const n = 2 * r,
              s = e.slice(n, n + 2),
              i = Number.parseInt(s, 16);
            if (Number.isNaN(i) || i < 0)
              throw new Error("Invalid byte sequence");
            t[r] = i;
          }
          return t;
        }
        function k(e) {
          return D(x(e));
        }
        function C(e) {
          return e instanceof Uint8Array ? Uint8Array.from(e) : L(e);
        }
        function B(e) {
          if ("number" == typeof e && Number.isSafeInteger(e) && e > 0)
            return BigInt(e);
          if ("bigint" == typeof e && Y(e)) return e;
          throw new TypeError(
            "Expected valid private scalar: 0 < scalar < curve.n",
          );
        }
        function z(e, t = u.P) {
          const r = e % t;
          return r >= s ? r : t + r;
        }
        function U(e, t) {
          const { P: r } = u;
          let n = e;
          for (; t-- > s; ) (n *= n), (n %= r);
          return n;
        }
        function _(e, t = u.P) {
          if (e === s || t <= s)
            throw new Error(
              `invert: expected positive integers, got n=${e} mod=${t}`,
            );
          let r = z(e, t),
            n = t,
            o = s,
            a = i,
            c = i,
            f = s;
          for (; r !== s; ) {
            const e = n / r,
              t = n % r,
              s = o - c * e,
              i = a - f * e;
            (n = r), (r = t), (o = c), (a = f), (c = s), (f = i);
          }
          if (n !== i) throw new Error("invert: does not exist");
          return z(o, t);
        }
        function P(e, t = !1) {
          const r = (function (e) {
            const t = 8 * e.length - 256,
              r = k(e);
            return t > 0 ? r >> BigInt(t) : r;
          })(e);
          if (t) return r;
          const { n } = u;
          return r >= n ? r - n : r;
        }
        let F, q;
        class H {
          constructor(e, t) {
            if (
              ((this.hashLen = e),
              (this.qByteLen = t),
              "number" != typeof e || e < 2)
            )
              throw new Error("hashLen must be a number");
            if ("number" != typeof t || t < 2)
              throw new Error("qByteLen must be a number");
            (this.v = new Uint8Array(e).fill(1)),
              (this.k = new Uint8Array(e).fill(0)),
              (this.counter = 0);
          }
          hmac(...e) {
            return t.utils.hmacSha256(this.k, ...e);
          }
          hmacSync(...e) {
            return q(this.k, ...e);
          }
          checkSync() {
            if ("function" != typeof q)
              throw new g("hmacSha256Sync needs to be set");
          }
          incr() {
            if (this.counter >= 1e3)
              throw new Error(
                "Tried 1,000 k values for sign(), all were invalid",
              );
            this.counter += 1;
          }
          async reseed(e = new Uint8Array()) {
            (this.k = await this.hmac(this.v, Uint8Array.from([0]), e)),
              (this.v = await this.hmac(this.v)),
              0 !== e.length &&
                ((this.k = await this.hmac(this.v, Uint8Array.from([1]), e)),
                (this.v = await this.hmac(this.v)));
          }
          reseedSync(e = new Uint8Array()) {
            this.checkSync(),
              (this.k = this.hmacSync(this.v, Uint8Array.from([0]), e)),
              (this.v = this.hmacSync(this.v)),
              0 !== e.length &&
                ((this.k = this.hmacSync(this.v, Uint8Array.from([1]), e)),
                (this.v = this.hmacSync(this.v)));
          }
          async generate() {
            this.incr();
            let e = 0;
            const t = [];
            for (; e < this.qByteLen; ) {
              this.v = await this.hmac(this.v);
              const r = this.v.slice();
              t.push(r), (e += this.v.length);
            }
            return N(...t);
          }
          generateSync() {
            this.checkSync(), this.incr();
            let e = 0;
            const t = [];
            for (; e < this.qByteLen; ) {
              this.v = this.hmacSync(this.v);
              const r = this.v.slice();
              t.push(r), (e += this.v.length);
            }
            return N(...t);
          }
        }
        function Y(e) {
          return s < e && e < u.n;
        }
        function Q(e) {
          return s < e && e < u.P;
        }
        function G(e, t, r, n = !0) {
          const { n: o } = u,
            a = P(e, !0);
          if (!Y(a)) return;
          const c = _(a, o),
            f = v.BASE.multiply(a),
            d = z(f.x, o);
          if (d === s) return;
          const l = z(c * z(t + r * d, o), o);
          if (l === s) return;
          let h = new I(d, l),
            p = (f.x === h.r ? 0 : 2) | Number(f.y & i);
          return (
            n && h.hasHighS() && ((h = h.normalizeS()), (p ^= 1)),
            { sig: h, recovery: p }
          );
        }
        function W(e) {
          let t;
          if ("bigint" == typeof e) t = e;
          else if ("number" == typeof e && Number.isSafeInteger(e) && e > 0)
            t = BigInt(e);
          else if ("string" == typeof e) {
            if (64 !== e.length)
              throw new Error("Expected 32 bytes of private key");
            t = D(e);
          } else {
            if (!(e instanceof Uint8Array))
              throw new TypeError("Expected valid private key");
            if (e.length !== h)
              throw new Error("Expected 32 bytes of private key");
            t = k(e);
          }
          if (!Y(t)) throw new Error("Expected private key: 0 < key < n");
          return t;
        }
        function Z(e) {
          return e instanceof v ? (e.assertValidity(), e) : v.fromHex(e);
        }
        function $(e) {
          if (e instanceof I) return e.assertValidity(), e;
          try {
            return I.fromDER(e);
          } catch (t) {
            return I.fromCompact(e);
          }
        }
        function J(e) {
          const t = e instanceof Uint8Array,
            r = "string" == typeof e,
            n = (t || r) && e.length;
          return t
            ? 33 === n || 65 === n
            : r
              ? 66 === n || 130 === n
              : e instanceof v;
        }
        function V(e) {
          return k(e.length > l ? e.slice(0, l) : e);
        }
        function K(e) {
          const t = V(e),
            r = z(t, u.n);
          return X(r < s ? t : r);
        }
        function X(e) {
          return O(e);
        }
        function ee(e, r, n) {
          if (null == e)
            throw new Error(`sign: expected valid message hash, not "${e}"`);
          const s = C(e),
            i = W(r),
            o = [X(i), K(s)];
          if (null != n) {
            !0 === n && (n = t.utils.randomBytes(l));
            const e = C(n);
            if (e.length !== l)
              throw new Error("sign: Expected 32 bytes of extra data");
            o.push(e);
          }
          return { seed: N(...o), m: V(s), d: i };
        }
        function te(e, t) {
          const { sig: r, recovery: n } = e,
            { der: s, recovered: i } = Object.assign(
              { canonical: !0, der: !0 },
              t,
            ),
            o = s ? r.toDERRawBytes() : r.toCompactRawBytes();
          return i ? [o, n] : o;
        }
        (t.getPublicKey = function (e, t = !1) {
          return v.fromPrivateKey(e).toRawBytes(t);
        }),
          (t.recoverPublicKey = function (e, t, r, n = !1) {
            return v.fromSignature(e, t, r).toRawBytes(n);
          }),
          (t.getSharedSecret = function (e, t, r = !1) {
            if (J(e))
              throw new TypeError(
                "getSharedSecret: first arg must be private key",
              );
            if (!J(t))
              throw new TypeError(
                "getSharedSecret: second arg must be public key",
              );
            const n = Z(t);
            return n.assertValidity(), n.multiply(W(e)).toRawBytes(r);
          }),
          (t.sign = async function (e, t, r = {}) {
            const { seed: n, m: s, d: i } = ee(e, t, r.extraEntropy),
              o = new H(32, h);
            let a;
            for (
              await o.reseed(n);
              !(a = G(await o.generate(), s, i, r.canonical));

            )
              await o.reseed();
            return te(a, r);
          }),
          (t.signSync = function (e, t, r = {}) {
            const { seed: n, m: s, d: i } = ee(e, t, r.extraEntropy),
              o = new H(32, h);
            let a;
            for (
              o.reseedSync(n);
              !(a = G(o.generateSync(), s, i, r.canonical));

            )
              o.reseedSync();
            return te(a, r);
          });
        const re = { strict: !0 };
        function ne(e) {
          return z(k(e), u.n);
        }
        t.verify = function (e, t, r, n = re) {
          let s;
          try {
            (s = $(e)), (t = C(t));
          } catch (e) {
            return !1;
          }
          const { r: i, s: o } = s;
          if (n.strict && s.hasHighS()) return !1;
          const a = P(t);
          let c;
          try {
            c = Z(r);
          } catch (e) {
            return !1;
          }
          const { n: f } = u,
            d = _(o, f),
            l = z(a * d, f),
            h = z(i * d, f),
            p = v.BASE.multiplyAndAddUnsafe(c, l, h);
          return !!p && z(p.x, f) === i;
        };
        class se {
          constructor(e, t) {
            (this.r = e), (this.s = t), this.assertValidity();
          }
          static fromHex(e) {
            const t = C(e);
            if (64 !== t.length)
              throw new TypeError(
                `SchnorrSignature.fromHex: expected 64 bytes, not ${t.length}`,
              );
            const r = k(t.subarray(0, 32)),
              n = k(t.subarray(32, 64));
            return new se(r, n);
          }
          assertValidity() {
            const { r: e, s: t } = this;
            if (!Q(e) || !Y(t)) throw new Error("Invalid signature");
          }
          toHex() {
            return S(this.r) + S(this.s);
          }
          toRawBytes() {
            return L(this.toHex());
          }
        }
        class ie {
          constructor(e, r, n = t.utils.randomBytes()) {
            if (null == e)
              throw new TypeError(`sign: Expected valid message, not "${e}"`);
            this.m = C(e);
            const { x: s, scalar: i } = this.getScalar(W(r));
            if (
              ((this.px = s),
              (this.d = i),
              (this.rand = C(n)),
              32 !== this.rand.length)
            )
              throw new TypeError("sign: Expected 32 bytes of aux randomness");
          }
          getScalar(e) {
            const t = v.fromPrivateKey(e),
              r = t.hasEvenY() ? e : u.n - e;
            return { point: t, scalar: r, x: t.toRawX() };
          }
          initNonce(e, t) {
            return O(e ^ k(t));
          }
          finalizeNonce(e) {
            const t = z(k(e), u.n);
            if (t === s)
              throw new Error("sign: Creation of signature failed. k is zero");
            const { point: r, x: n, scalar: i } = this.getScalar(t);
            return { R: r, rx: n, k: i };
          }
          finalizeSig(e, t, r, n) {
            return new se(e.x, z(t + r * n, u.n)).toRawBytes();
          }
          error() {
            throw new Error("sign: Invalid signature produced");
          }
          async calc() {
            const { m: e, d: r, px: n, rand: s } = this,
              i = t.utils.taggedHash,
              o = this.initNonce(r, await i(de.aux, s)),
              {
                R: a,
                rx: c,
                k: u,
              } = this.finalizeNonce(await i(de.nonce, o, n, e)),
              f = ne(await i(de.challenge, c, n, e)),
              d = this.finalizeSig(a, u, f, r);
            return (await ce(d, e, n)) || this.error(), d;
          }
          calcSync() {
            const { m: e, d: r, px: n, rand: s } = this,
              i = t.utils.taggedHashSync,
              o = this.initNonce(r, i(de.aux, s)),
              { R: a, rx: c, k: u } = this.finalizeNonce(i(de.nonce, o, n, e)),
              f = ne(i(de.challenge, c, n, e)),
              d = this.finalizeSig(a, u, f, r);
            return ue(d, e, n) || this.error(), d;
          }
        }
        function oe(e, t, r) {
          const n = e instanceof se,
            s = n ? e : se.fromHex(e);
          return n && s.assertValidity(), { ...s, m: C(t), P: Z(r) };
        }
        function ae(e, t, r, n) {
          const s = v.BASE.multiplyAndAddUnsafe(t, W(r), z(-n, u.n));
          return !(!s || !s.hasEvenY() || s.x !== e);
        }
        async function ce(e, r, n) {
          try {
            const { r: s, s: i, m: o, P: a } = oe(e, r, n),
              c = ne(
                await t.utils.taggedHash(de.challenge, O(s), a.toRawX(), o),
              );
            return ae(s, a, i, c);
          } catch (e) {
            return !1;
          }
        }
        function ue(e, r, n) {
          try {
            const { r: s, s: i, m: o, P: a } = oe(e, r, n),
              c = ne(t.utils.taggedHashSync(de.challenge, O(s), a.toRawX(), o));
            return ae(s, a, i, c);
          } catch (e) {
            if (e instanceof g) throw e;
            return !1;
          }
        }
        (t.schnorr = {
          Signature: se,
          getPublicKey: function (e) {
            return v.fromPrivateKey(e).toRawX();
          },
          sign: async function (e, t, r) {
            return new ie(e, t, r).calc();
          },
          verify: ce,
          signSync: function (e, t, r) {
            return new ie(e, t, r).calcSync();
          },
          verifySync: ue,
        }),
          v.BASE._setWindowSize(8);
        const fe = {
            node: n,
            web:
              "object" == typeof self && "crypto" in self
                ? self.crypto
                : void 0,
          },
          de = {
            challenge: "BIP0340/challenge",
            aux: "BIP0340/aux",
            nonce: "BIP0340/nonce",
          },
          le = {};
        (t.utils = {
          bytesToHex: x,
          hexToBytes: L,
          concatBytes: N,
          mod: z,
          invert: _,
          isValidPrivateKey(e) {
            try {
              return W(e), !0;
            } catch (e) {
              return !1;
            }
          },
          _bigintTo32Bytes: O,
          _normalizePrivateKey: W,
          hashToPrivateKey: (e) => {
            if ((e = C(e)).length < 40 || e.length > 1024)
              throw new Error(
                "Expected valid bytes of private key as per FIPS 186",
              );
            return O(z(k(e), u.n - i) + i);
          },
          randomBytes: (e = 32) => {
            if (fe.web) return fe.web.getRandomValues(new Uint8Array(e));
            if (fe.node) {
              const { randomBytes: t } = fe.node;
              return Uint8Array.from(t(e));
            }
            throw new Error(
              "The environment doesn't have randomBytes function",
            );
          },
          randomPrivateKey: () =>
            t.utils.hashToPrivateKey(t.utils.randomBytes(40)),
          precompute(e = 8, t = v.BASE) {
            const r = t === v.BASE ? t : new v(t.x, t.y);
            return r._setWindowSize(e), r.multiply(a), r;
          },
          sha256: async (...e) => {
            if (fe.web) {
              const t = await fe.web.subtle.digest("SHA-256", N(...e));
              return new Uint8Array(t);
            }
            if (fe.node) {
              const { createHash: t } = fe.node,
                r = t("sha256");
              return e.forEach((e) => r.update(e)), Uint8Array.from(r.digest());
            }
            throw new Error("The environment doesn't have sha256 function");
          },
          hmacSha256: async (e, ...t) => {
            if (fe.web) {
              const r = await fe.web.subtle.importKey(
                  "raw",
                  e,
                  { name: "HMAC", hash: { name: "SHA-256" } },
                  !1,
                  ["sign"],
                ),
                n = N(...t),
                s = await fe.web.subtle.sign("HMAC", r, n);
              return new Uint8Array(s);
            }
            if (fe.node) {
              const { createHmac: r } = fe.node,
                n = r("sha256", e);
              return t.forEach((e) => n.update(e)), Uint8Array.from(n.digest());
            }
            throw new Error(
              "The environment doesn't have hmac-sha256 function",
            );
          },
          sha256Sync: void 0,
          hmacSha256Sync: void 0,
          taggedHash: async (e, ...r) => {
            let n = le[e];
            if (void 0 === n) {
              const r = await t.utils.sha256(
                Uint8Array.from(e, (e) => e.charCodeAt(0)),
              );
              (n = N(r, r)), (le[e] = n);
            }
            return t.utils.sha256(n, ...r);
          },
          taggedHashSync: (e, ...t) => {
            if ("function" != typeof F)
              throw new g("sha256Sync is undefined, you need to set it");
            let r = le[e];
            if (void 0 === r) {
              const t = F(Uint8Array.from(e, (e) => e.charCodeAt(0)));
              (r = N(t, t)), (le[e] = r);
            }
            return F(r, ...t);
          },
          _JacobianPoint: m,
        }),
          Object.defineProperties(t.utils, {
            sha256Sync: {
              configurable: !1,
              get: () => F,
              set(e) {
                F || (F = e);
              },
            },
            hmacSha256Sync: {
              configurable: !1,
              get: () => q,
              set(e) {
                q || (q = e);
              },
            },
          });
      },
      67526: (e, t) => {
        "use strict";
        (t.byteLength = function (e) {
          var t = a(e),
            r = t[0],
            n = t[1];
          return (3 * (r + n)) / 4 - n;
        }),
          (t.toByteArray = function (e) {
            var t,
              r,
              i = a(e),
              o = i[0],
              c = i[1],
              u = new s(
                (function (e, t, r) {
                  return (3 * (t + r)) / 4 - r;
                })(0, o, c),
              ),
              f = 0,
              d = c > 0 ? o - 4 : o;
            for (r = 0; r < d; r += 4)
              (t =
                (n[e.charCodeAt(r)] << 18) |
                (n[e.charCodeAt(r + 1)] << 12) |
                (n[e.charCodeAt(r + 2)] << 6) |
                n[e.charCodeAt(r + 3)]),
                (u[f++] = (t >> 16) & 255),
                (u[f++] = (t >> 8) & 255),
                (u[f++] = 255 & t);
            2 === c &&
              ((t = (n[e.charCodeAt(r)] << 2) | (n[e.charCodeAt(r + 1)] >> 4)),
              (u[f++] = 255 & t));
            1 === c &&
              ((t =
                (n[e.charCodeAt(r)] << 10) |
                (n[e.charCodeAt(r + 1)] << 4) |
                (n[e.charCodeAt(r + 2)] >> 2)),
              (u[f++] = (t >> 8) & 255),
              (u[f++] = 255 & t));
            return u;
          }),
          (t.fromByteArray = function (e) {
            for (
              var t,
                n = e.length,
                s = n % 3,
                i = [],
                o = 16383,
                a = 0,
                u = n - s;
              a < u;
              a += o
            )
              i.push(c(e, a, a + o > u ? u : a + o));
            1 === s
              ? ((t = e[n - 1]), i.push(r[t >> 2] + r[(t << 4) & 63] + "=="))
              : 2 === s &&
                ((t = (e[n - 2] << 8) + e[n - 1]),
                i.push(r[t >> 10] + r[(t >> 4) & 63] + r[(t << 2) & 63] + "="));
            return i.join("");
          });
        for (
          var r = [],
            n = [],
            s = "undefined" != typeof Uint8Array ? Uint8Array : Array,
            i =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            o = 0;
          o < 64;
          ++o
        )
          (r[o] = i[o]), (n[i.charCodeAt(o)] = o);
        function a(e) {
          var t = e.length;
          if (t % 4 > 0)
            throw new Error("Invalid string. Length must be a multiple of 4");
          var r = e.indexOf("=");
          return -1 === r && (r = t), [r, r === t ? 0 : 4 - (r % 4)];
        }
        function c(e, t, n) {
          for (var s, i, o = [], a = t; a < n; a += 3)
            (s =
              ((e[a] << 16) & 16711680) +
              ((e[a + 1] << 8) & 65280) +
              (255 & e[a + 2])),
              o.push(
                r[((i = s) >> 18) & 63] +
                  r[(i >> 12) & 63] +
                  r[(i >> 6) & 63] +
                  r[63 & i],
              );
          return o.join("");
        }
        (n["-".charCodeAt(0)] = 62), (n["_".charCodeAt(0)] = 63);
      },
      48287: (e, t, r) => {
        "use strict";
        /*!
         * The buffer module from node.js, for the browser.
         *
         * @author   Feross Aboukhadijeh <https://feross.org>
         * @license  MIT
         */
        const n = r(67526),
          s = r(251),
          i =
            "function" == typeof Symbol && "function" == typeof Symbol.for
              ? Symbol.for("nodejs.util.inspect.custom")
              : null;
        (t.Buffer = c), (t.INSPECT_MAX_BYTES = 50);
        const o = 2147483647;
        function a(e) {
          if (e > o)
            throw new RangeError(
              'The value "' + e + '" is invalid for option "size"',
            );
          const t = new Uint8Array(e);
          return Object.setPrototypeOf(t, c.prototype), t;
        }
        function c(e, t, r) {
          if ("number" == typeof e) {
            if ("string" == typeof t)
              throw new TypeError(
                'The "string" argument must be of type string. Received type number',
              );
            return d(e);
          }
          return u(e, t, r);
        }
        function u(e, t, r) {
          if ("string" == typeof e)
            return (function (e, t) {
              ("string" == typeof t && "" !== t) || (t = "utf8");
              if (!c.isEncoding(t))
                throw new TypeError("Unknown encoding: " + t);
              const r = 0 | y(e, t);
              let n = a(r);
              const s = n.write(e, t);
              s !== r && (n = n.slice(0, s));
              return n;
            })(e, t);
          if (ArrayBuffer.isView(e))
            return (function (e) {
              if ($(e, Uint8Array)) {
                const t = new Uint8Array(e);
                return h(t.buffer, t.byteOffset, t.byteLength);
              }
              return l(e);
            })(e);
          if (null == e)
            throw new TypeError(
              "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                typeof e,
            );
          if ($(e, ArrayBuffer) || (e && $(e.buffer, ArrayBuffer)))
            return h(e, t, r);
          if (
            "undefined" != typeof SharedArrayBuffer &&
            ($(e, SharedArrayBuffer) || (e && $(e.buffer, SharedArrayBuffer)))
          )
            return h(e, t, r);
          if ("number" == typeof e)
            throw new TypeError(
              'The "value" argument must not be of type number. Received type number',
            );
          const n = e.valueOf && e.valueOf();
          if (null != n && n !== e) return c.from(n, t, r);
          const s = (function (e) {
            if (c.isBuffer(e)) {
              const t = 0 | p(e.length),
                r = a(t);
              return 0 === r.length || e.copy(r, 0, 0, t), r;
            }
            if (void 0 !== e.length)
              return "number" != typeof e.length || J(e.length) ? a(0) : l(e);
            if ("Buffer" === e.type && Array.isArray(e.data)) return l(e.data);
          })(e);
          if (s) return s;
          if (
            "undefined" != typeof Symbol &&
            null != Symbol.toPrimitive &&
            "function" == typeof e[Symbol.toPrimitive]
          )
            return c.from(e[Symbol.toPrimitive]("string"), t, r);
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
              typeof e,
          );
        }
        function f(e) {
          if ("number" != typeof e)
            throw new TypeError('"size" argument must be of type number');
          if (e < 0)
            throw new RangeError(
              'The value "' + e + '" is invalid for option "size"',
            );
        }
        function d(e) {
          return f(e), a(e < 0 ? 0 : 0 | p(e));
        }
        function l(e) {
          const t = e.length < 0 ? 0 : 0 | p(e.length),
            r = a(t);
          for (let n = 0; n < t; n += 1) r[n] = 255 & e[n];
          return r;
        }
        function h(e, t, r) {
          if (t < 0 || e.byteLength < t)
            throw new RangeError('"offset" is outside of buffer bounds');
          if (e.byteLength < t + (r || 0))
            throw new RangeError('"length" is outside of buffer bounds');
          let n;
          return (
            (n =
              void 0 === t && void 0 === r
                ? new Uint8Array(e)
                : void 0 === r
                  ? new Uint8Array(e, t)
                  : new Uint8Array(e, t, r)),
            Object.setPrototypeOf(n, c.prototype),
            n
          );
        }
        function p(e) {
          if (e >= o)
            throw new RangeError(
              "Attempt to allocate Buffer larger than maximum size: 0x" +
                o.toString(16) +
                " bytes",
            );
          return 0 | e;
        }
        function y(e, t) {
          if (c.isBuffer(e)) return e.length;
          if (ArrayBuffer.isView(e) || $(e, ArrayBuffer)) return e.byteLength;
          if ("string" != typeof e)
            throw new TypeError(
              'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
                typeof e,
            );
          const r = e.length,
            n = arguments.length > 2 && !0 === arguments[2];
          if (!n && 0 === r) return 0;
          let s = !1;
          for (;;)
            switch (t) {
              case "ascii":
              case "latin1":
              case "binary":
                return r;
              case "utf8":
              case "utf-8":
                return G(e).length;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return 2 * r;
              case "hex":
                return r >>> 1;
              case "base64":
                return W(e).length;
              default:
                if (s) return n ? -1 : G(e).length;
                (t = ("" + t).toLowerCase()), (s = !0);
            }
        }
        function g(e, t, r) {
          let n = !1;
          if (((void 0 === t || t < 0) && (t = 0), t > this.length)) return "";
          if (((void 0 === r || r > this.length) && (r = this.length), r <= 0))
            return "";
          if ((r >>>= 0) <= (t >>>= 0)) return "";
          for (e || (e = "utf8"); ; )
            switch (e) {
              case "hex":
                return O(this, t, r);
              case "utf8":
              case "utf-8":
                return T(this, t, r);
              case "ascii":
                return j(this, t, r);
              case "latin1":
              case "binary":
                return S(this, t, r);
              case "base64":
                return N(this, t, r);
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return R(this, t, r);
              default:
                if (n) throw new TypeError("Unknown encoding: " + e);
                (e = (e + "").toLowerCase()), (n = !0);
            }
        }
        function w(e, t, r) {
          const n = e[t];
          (e[t] = e[r]), (e[r] = n);
        }
        function m(e, t, r, n, s) {
          if (0 === e.length) return -1;
          if (
            ("string" == typeof r
              ? ((n = r), (r = 0))
              : r > 2147483647
                ? (r = 2147483647)
                : r < -2147483648 && (r = -2147483648),
            J((r = +r)) && (r = s ? 0 : e.length - 1),
            r < 0 && (r = e.length + r),
            r >= e.length)
          ) {
            if (s) return -1;
            r = e.length - 1;
          } else if (r < 0) {
            if (!s) return -1;
            r = 0;
          }
          if (("string" == typeof t && (t = c.from(t, n)), c.isBuffer(t)))
            return 0 === t.length ? -1 : b(e, t, r, n, s);
          if ("number" == typeof t)
            return (
              (t &= 255),
              "function" == typeof Uint8Array.prototype.indexOf
                ? s
                  ? Uint8Array.prototype.indexOf.call(e, t, r)
                  : Uint8Array.prototype.lastIndexOf.call(e, t, r)
                : b(e, [t], r, n, s)
            );
          throw new TypeError("val must be string, number or Buffer");
        }
        function b(e, t, r, n, s) {
          let i,
            o = 1,
            a = e.length,
            c = t.length;
          if (
            void 0 !== n &&
            ("ucs2" === (n = String(n).toLowerCase()) ||
              "ucs-2" === n ||
              "utf16le" === n ||
              "utf-16le" === n)
          ) {
            if (e.length < 2 || t.length < 2) return -1;
            (o = 2), (a /= 2), (c /= 2), (r /= 2);
          }
          function u(e, t) {
            return 1 === o ? e[t] : e.readUInt16BE(t * o);
          }
          if (s) {
            let n = -1;
            for (i = r; i < a; i++)
              if (u(e, i) === u(t, -1 === n ? 0 : i - n)) {
                if ((-1 === n && (n = i), i - n + 1 === c)) return n * o;
              } else -1 !== n && (i -= i - n), (n = -1);
          } else
            for (r + c > a && (r = a - c), i = r; i >= 0; i--) {
              let r = !0;
              for (let n = 0; n < c; n++)
                if (u(e, i + n) !== u(t, n)) {
                  r = !1;
                  break;
                }
              if (r) return i;
            }
          return -1;
        }
        function E(e, t, r, n) {
          r = Number(r) || 0;
          const s = e.length - r;
          n ? (n = Number(n)) > s && (n = s) : (n = s);
          const i = t.length;
          let o;
          for (n > i / 2 && (n = i / 2), o = 0; o < n; ++o) {
            const n = parseInt(t.substr(2 * o, 2), 16);
            if (J(n)) return o;
            e[r + o] = n;
          }
          return o;
        }
        function v(e, t, r, n) {
          return Z(G(t, e.length - r), e, r, n);
        }
        function M(e, t, r, n) {
          return Z(
            (function (e) {
              const t = [];
              for (let r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
              return t;
            })(t),
            e,
            r,
            n,
          );
        }
        function A(e, t, r, n) {
          return Z(W(t), e, r, n);
        }
        function I(e, t, r, n) {
          return Z(
            (function (e, t) {
              let r, n, s;
              const i = [];
              for (let o = 0; o < e.length && !((t -= 2) < 0); ++o)
                (r = e.charCodeAt(o)),
                  (n = r >> 8),
                  (s = r % 256),
                  i.push(s),
                  i.push(n);
              return i;
            })(t, e.length - r),
            e,
            r,
            n,
          );
        }
        function N(e, t, r) {
          return 0 === t && r === e.length
            ? n.fromByteArray(e)
            : n.fromByteArray(e.slice(t, r));
        }
        function T(e, t, r) {
          r = Math.min(e.length, r);
          const n = [];
          let s = t;
          for (; s < r; ) {
            const t = e[s];
            let i = null,
              o = t > 239 ? 4 : t > 223 ? 3 : t > 191 ? 2 : 1;
            if (s + o <= r) {
              let r, n, a, c;
              switch (o) {
                case 1:
                  t < 128 && (i = t);
                  break;
                case 2:
                  (r = e[s + 1]),
                    128 == (192 & r) &&
                      ((c = ((31 & t) << 6) | (63 & r)), c > 127 && (i = c));
                  break;
                case 3:
                  (r = e[s + 1]),
                    (n = e[s + 2]),
                    128 == (192 & r) &&
                      128 == (192 & n) &&
                      ((c = ((15 & t) << 12) | ((63 & r) << 6) | (63 & n)),
                      c > 2047 && (c < 55296 || c > 57343) && (i = c));
                  break;
                case 4:
                  (r = e[s + 1]),
                    (n = e[s + 2]),
                    (a = e[s + 3]),
                    128 == (192 & r) &&
                      128 == (192 & n) &&
                      128 == (192 & a) &&
                      ((c =
                        ((15 & t) << 18) |
                        ((63 & r) << 12) |
                        ((63 & n) << 6) |
                        (63 & a)),
                      c > 65535 && c < 1114112 && (i = c));
              }
            }
            null === i
              ? ((i = 65533), (o = 1))
              : i > 65535 &&
                ((i -= 65536),
                n.push(((i >>> 10) & 1023) | 55296),
                (i = 56320 | (1023 & i))),
              n.push(i),
              (s += o);
          }
          return (function (e) {
            const t = e.length;
            if (t <= x) return String.fromCharCode.apply(String, e);
            let r = "",
              n = 0;
            for (; n < t; )
              r += String.fromCharCode.apply(String, e.slice(n, (n += x)));
            return r;
          })(n);
        }
        (c.TYPED_ARRAY_SUPPORT = (function () {
          try {
            const e = new Uint8Array(1),
              t = {
                foo: function () {
                  return 42;
                },
              };
            return (
              Object.setPrototypeOf(t, Uint8Array.prototype),
              Object.setPrototypeOf(e, t),
              42 === e.foo()
            );
          } catch (e) {
            return !1;
          }
        })()),
          c.TYPED_ARRAY_SUPPORT ||
            "undefined" == typeof console ||
            "function" != typeof console.error ||
            console.error(
              "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.",
            ),
          Object.defineProperty(c.prototype, "parent", {
            enumerable: !0,
            get: function () {
              if (c.isBuffer(this)) return this.buffer;
            },
          }),
          Object.defineProperty(c.prototype, "offset", {
            enumerable: !0,
            get: function () {
              if (c.isBuffer(this)) return this.byteOffset;
            },
          }),
          (c.poolSize = 8192),
          (c.from = function (e, t, r) {
            return u(e, t, r);
          }),
          Object.setPrototypeOf(c.prototype, Uint8Array.prototype),
          Object.setPrototypeOf(c, Uint8Array),
          (c.alloc = function (e, t, r) {
            return (function (e, t, r) {
              return (
                f(e),
                e <= 0
                  ? a(e)
                  : void 0 !== t
                    ? "string" == typeof r
                      ? a(e).fill(t, r)
                      : a(e).fill(t)
                    : a(e)
              );
            })(e, t, r);
          }),
          (c.allocUnsafe = function (e) {
            return d(e);
          }),
          (c.allocUnsafeSlow = function (e) {
            return d(e);
          }),
          (c.isBuffer = function (e) {
            return null != e && !0 === e._isBuffer && e !== c.prototype;
          }),
          (c.compare = function (e, t) {
            if (
              ($(e, Uint8Array) && (e = c.from(e, e.offset, e.byteLength)),
              $(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)),
              !c.isBuffer(e) || !c.isBuffer(t))
            )
              throw new TypeError(
                'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array',
              );
            if (e === t) return 0;
            let r = e.length,
              n = t.length;
            for (let s = 0, i = Math.min(r, n); s < i; ++s)
              if (e[s] !== t[s]) {
                (r = e[s]), (n = t[s]);
                break;
              }
            return r < n ? -1 : n < r ? 1 : 0;
          }),
          (c.isEncoding = function (e) {
            switch (String(e).toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "latin1":
              case "binary":
              case "base64":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return !0;
              default:
                return !1;
            }
          }),
          (c.concat = function (e, t) {
            if (!Array.isArray(e))
              throw new TypeError(
                '"list" argument must be an Array of Buffers',
              );
            if (0 === e.length) return c.alloc(0);
            let r;
            if (void 0 === t)
              for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
            const n = c.allocUnsafe(t);
            let s = 0;
            for (r = 0; r < e.length; ++r) {
              let t = e[r];
              if ($(t, Uint8Array))
                s + t.length > n.length
                  ? (c.isBuffer(t) || (t = c.from(t)), t.copy(n, s))
                  : Uint8Array.prototype.set.call(n, t, s);
              else {
                if (!c.isBuffer(t))
                  throw new TypeError(
                    '"list" argument must be an Array of Buffers',
                  );
                t.copy(n, s);
              }
              s += t.length;
            }
            return n;
          }),
          (c.byteLength = y),
          (c.prototype._isBuffer = !0),
          (c.prototype.swap16 = function () {
            const e = this.length;
            if (e % 2 != 0)
              throw new RangeError("Buffer size must be a multiple of 16-bits");
            for (let t = 0; t < e; t += 2) w(this, t, t + 1);
            return this;
          }),
          (c.prototype.swap32 = function () {
            const e = this.length;
            if (e % 4 != 0)
              throw new RangeError("Buffer size must be a multiple of 32-bits");
            for (let t = 0; t < e; t += 4)
              w(this, t, t + 3), w(this, t + 1, t + 2);
            return this;
          }),
          (c.prototype.swap64 = function () {
            const e = this.length;
            if (e % 8 != 0)
              throw new RangeError("Buffer size must be a multiple of 64-bits");
            for (let t = 0; t < e; t += 8)
              w(this, t, t + 7),
                w(this, t + 1, t + 6),
                w(this, t + 2, t + 5),
                w(this, t + 3, t + 4);
            return this;
          }),
          (c.prototype.toString = function () {
            const e = this.length;
            return 0 === e
              ? ""
              : 0 === arguments.length
                ? T(this, 0, e)
                : g.apply(this, arguments);
          }),
          (c.prototype.toLocaleString = c.prototype.toString),
          (c.prototype.equals = function (e) {
            if (!c.isBuffer(e))
              throw new TypeError("Argument must be a Buffer");
            return this === e || 0 === c.compare(this, e);
          }),
          (c.prototype.inspect = function () {
            let e = "";
            const r = t.INSPECT_MAX_BYTES;
            return (
              (e = this.toString("hex", 0, r)
                .replace(/(.{2})/g, "$1 ")
                .trim()),
              this.length > r && (e += " ... "),
              "<Buffer " + e + ">"
            );
          }),
          i && (c.prototype[i] = c.prototype.inspect),
          (c.prototype.compare = function (e, t, r, n, s) {
            if (
              ($(e, Uint8Array) && (e = c.from(e, e.offset, e.byteLength)),
              !c.isBuffer(e))
            )
              throw new TypeError(
                'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
                  typeof e,
              );
            if (
              (void 0 === t && (t = 0),
              void 0 === r && (r = e ? e.length : 0),
              void 0 === n && (n = 0),
              void 0 === s && (s = this.length),
              t < 0 || r > e.length || n < 0 || s > this.length)
            )
              throw new RangeError("out of range index");
            if (n >= s && t >= r) return 0;
            if (n >= s) return -1;
            if (t >= r) return 1;
            if (this === e) return 0;
            let i = (s >>>= 0) - (n >>>= 0),
              o = (r >>>= 0) - (t >>>= 0);
            const a = Math.min(i, o),
              u = this.slice(n, s),
              f = e.slice(t, r);
            for (let e = 0; e < a; ++e)
              if (u[e] !== f[e]) {
                (i = u[e]), (o = f[e]);
                break;
              }
            return i < o ? -1 : o < i ? 1 : 0;
          }),
          (c.prototype.includes = function (e, t, r) {
            return -1 !== this.indexOf(e, t, r);
          }),
          (c.prototype.indexOf = function (e, t, r) {
            return m(this, e, t, r, !0);
          }),
          (c.prototype.lastIndexOf = function (e, t, r) {
            return m(this, e, t, r, !1);
          }),
          (c.prototype.write = function (e, t, r, n) {
            if (void 0 === t) (n = "utf8"), (r = this.length), (t = 0);
            else if (void 0 === r && "string" == typeof t)
              (n = t), (r = this.length), (t = 0);
            else {
              if (!isFinite(t))
                throw new Error(
                  "Buffer.write(string, encoding, offset[, length]) is no longer supported",
                );
              (t >>>= 0),
                isFinite(r)
                  ? ((r >>>= 0), void 0 === n && (n = "utf8"))
                  : ((n = r), (r = void 0));
            }
            const s = this.length - t;
            if (
              ((void 0 === r || r > s) && (r = s),
              (e.length > 0 && (r < 0 || t < 0)) || t > this.length)
            )
              throw new RangeError("Attempt to write outside buffer bounds");
            n || (n = "utf8");
            let i = !1;
            for (;;)
              switch (n) {
                case "hex":
                  return E(this, e, t, r);
                case "utf8":
                case "utf-8":
                  return v(this, e, t, r);
                case "ascii":
                case "latin1":
                case "binary":
                  return M(this, e, t, r);
                case "base64":
                  return A(this, e, t, r);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return I(this, e, t, r);
                default:
                  if (i) throw new TypeError("Unknown encoding: " + n);
                  (n = ("" + n).toLowerCase()), (i = !0);
              }
          }),
          (c.prototype.toJSON = function () {
            return {
              type: "Buffer",
              data: Array.prototype.slice.call(this._arr || this, 0),
            };
          });
        const x = 4096;
        function j(e, t, r) {
          let n = "";
          r = Math.min(e.length, r);
          for (let s = t; s < r; ++s) n += String.fromCharCode(127 & e[s]);
          return n;
        }
        function S(e, t, r) {
          let n = "";
          r = Math.min(e.length, r);
          for (let s = t; s < r; ++s) n += String.fromCharCode(e[s]);
          return n;
        }
        function O(e, t, r) {
          const n = e.length;
          (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
          let s = "";
          for (let n = t; n < r; ++n) s += V[e[n]];
          return s;
        }
        function R(e, t, r) {
          const n = e.slice(t, r);
          let s = "";
          for (let e = 0; e < n.length - 1; e += 2)
            s += String.fromCharCode(n[e] + 256 * n[e + 1]);
          return s;
        }
        function D(e, t, r) {
          if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
          if (e + t > r)
            throw new RangeError("Trying to access beyond buffer length");
        }
        function L(e, t, r, n, s, i) {
          if (!c.isBuffer(e))
            throw new TypeError('"buffer" argument must be a Buffer instance');
          if (t > s || t < i)
            throw new RangeError('"value" argument is out of bounds');
          if (r + n > e.length) throw new RangeError("Index out of range");
        }
        function k(e, t, r, n, s) {
          q(t, n, s, e, r, 7);
          let i = Number(t & BigInt(4294967295));
          (e[r++] = i),
            (i >>= 8),
            (e[r++] = i),
            (i >>= 8),
            (e[r++] = i),
            (i >>= 8),
            (e[r++] = i);
          let o = Number((t >> BigInt(32)) & BigInt(4294967295));
          return (
            (e[r++] = o),
            (o >>= 8),
            (e[r++] = o),
            (o >>= 8),
            (e[r++] = o),
            (o >>= 8),
            (e[r++] = o),
            r
          );
        }
        function C(e, t, r, n, s) {
          q(t, n, s, e, r, 7);
          let i = Number(t & BigInt(4294967295));
          (e[r + 7] = i),
            (i >>= 8),
            (e[r + 6] = i),
            (i >>= 8),
            (e[r + 5] = i),
            (i >>= 8),
            (e[r + 4] = i);
          let o = Number((t >> BigInt(32)) & BigInt(4294967295));
          return (
            (e[r + 3] = o),
            (o >>= 8),
            (e[r + 2] = o),
            (o >>= 8),
            (e[r + 1] = o),
            (o >>= 8),
            (e[r] = o),
            r + 8
          );
        }
        function B(e, t, r, n, s, i) {
          if (r + n > e.length) throw new RangeError("Index out of range");
          if (r < 0) throw new RangeError("Index out of range");
        }
        function z(e, t, r, n, i) {
          return (
            (t = +t),
            (r >>>= 0),
            i || B(e, 0, r, 4),
            s.write(e, t, r, n, 23, 4),
            r + 4
          );
        }
        function U(e, t, r, n, i) {
          return (
            (t = +t),
            (r >>>= 0),
            i || B(e, 0, r, 8),
            s.write(e, t, r, n, 52, 8),
            r + 8
          );
        }
        (c.prototype.slice = function (e, t) {
          const r = this.length;
          (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r),
            (t = void 0 === t ? r : ~~t) < 0
              ? (t += r) < 0 && (t = 0)
              : t > r && (t = r),
            t < e && (t = e);
          const n = this.subarray(e, t);
          return Object.setPrototypeOf(n, c.prototype), n;
        }),
          (c.prototype.readUintLE = c.prototype.readUIntLE =
            function (e, t, r) {
              (e >>>= 0), (t >>>= 0), r || D(e, t, this.length);
              let n = this[e],
                s = 1,
                i = 0;
              for (; ++i < t && (s *= 256); ) n += this[e + i] * s;
              return n;
            }),
          (c.prototype.readUintBE = c.prototype.readUIntBE =
            function (e, t, r) {
              (e >>>= 0), (t >>>= 0), r || D(e, t, this.length);
              let n = this[e + --t],
                s = 1;
              for (; t > 0 && (s *= 256); ) n += this[e + --t] * s;
              return n;
            }),
          (c.prototype.readUint8 = c.prototype.readUInt8 =
            function (e, t) {
              return (e >>>= 0), t || D(e, 1, this.length), this[e];
            }),
          (c.prototype.readUint16LE = c.prototype.readUInt16LE =
            function (e, t) {
              return (
                (e >>>= 0),
                t || D(e, 2, this.length),
                this[e] | (this[e + 1] << 8)
              );
            }),
          (c.prototype.readUint16BE = c.prototype.readUInt16BE =
            function (e, t) {
              return (
                (e >>>= 0),
                t || D(e, 2, this.length),
                (this[e] << 8) | this[e + 1]
              );
            }),
          (c.prototype.readUint32LE = c.prototype.readUInt32LE =
            function (e, t) {
              return (
                (e >>>= 0),
                t || D(e, 4, this.length),
                (this[e] | (this[e + 1] << 8) | (this[e + 2] << 16)) +
                  16777216 * this[e + 3]
              );
            }),
          (c.prototype.readUint32BE = c.prototype.readUInt32BE =
            function (e, t) {
              return (
                (e >>>= 0),
                t || D(e, 4, this.length),
                16777216 * this[e] +
                  ((this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3])
              );
            }),
          (c.prototype.readBigUInt64LE = K(function (e) {
            H((e >>>= 0), "offset");
            const t = this[e],
              r = this[e + 7];
            (void 0 !== t && void 0 !== r) || Y(e, this.length - 8);
            const n =
                t + 256 * this[++e] + 65536 * this[++e] + this[++e] * 2 ** 24,
              s = this[++e] + 256 * this[++e] + 65536 * this[++e] + r * 2 ** 24;
            return BigInt(n) + (BigInt(s) << BigInt(32));
          })),
          (c.prototype.readBigUInt64BE = K(function (e) {
            H((e >>>= 0), "offset");
            const t = this[e],
              r = this[e + 7];
            (void 0 !== t && void 0 !== r) || Y(e, this.length - 8);
            const n =
                t * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + this[++e],
              s = this[++e] * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + r;
            return (BigInt(n) << BigInt(32)) + BigInt(s);
          })),
          (c.prototype.readIntLE = function (e, t, r) {
            (e >>>= 0), (t >>>= 0), r || D(e, t, this.length);
            let n = this[e],
              s = 1,
              i = 0;
            for (; ++i < t && (s *= 256); ) n += this[e + i] * s;
            return (s *= 128), n >= s && (n -= Math.pow(2, 8 * t)), n;
          }),
          (c.prototype.readIntBE = function (e, t, r) {
            (e >>>= 0), (t >>>= 0), r || D(e, t, this.length);
            let n = t,
              s = 1,
              i = this[e + --n];
            for (; n > 0 && (s *= 256); ) i += this[e + --n] * s;
            return (s *= 128), i >= s && (i -= Math.pow(2, 8 * t)), i;
          }),
          (c.prototype.readInt8 = function (e, t) {
            return (
              (e >>>= 0),
              t || D(e, 1, this.length),
              128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
            );
          }),
          (c.prototype.readInt16LE = function (e, t) {
            (e >>>= 0), t || D(e, 2, this.length);
            const r = this[e] | (this[e + 1] << 8);
            return 32768 & r ? 4294901760 | r : r;
          }),
          (c.prototype.readInt16BE = function (e, t) {
            (e >>>= 0), t || D(e, 2, this.length);
            const r = this[e + 1] | (this[e] << 8);
            return 32768 & r ? 4294901760 | r : r;
          }),
          (c.prototype.readInt32LE = function (e, t) {
            return (
              (e >>>= 0),
              t || D(e, 4, this.length),
              this[e] |
                (this[e + 1] << 8) |
                (this[e + 2] << 16) |
                (this[e + 3] << 24)
            );
          }),
          (c.prototype.readInt32BE = function (e, t) {
            return (
              (e >>>= 0),
              t || D(e, 4, this.length),
              (this[e] << 24) |
                (this[e + 1] << 16) |
                (this[e + 2] << 8) |
                this[e + 3]
            );
          }),
          (c.prototype.readBigInt64LE = K(function (e) {
            H((e >>>= 0), "offset");
            const t = this[e],
              r = this[e + 7];
            (void 0 !== t && void 0 !== r) || Y(e, this.length - 8);
            const n =
              this[e + 4] + 256 * this[e + 5] + 65536 * this[e + 6] + (r << 24);
            return (
              (BigInt(n) << BigInt(32)) +
              BigInt(
                t + 256 * this[++e] + 65536 * this[++e] + this[++e] * 2 ** 24,
              )
            );
          })),
          (c.prototype.readBigInt64BE = K(function (e) {
            H((e >>>= 0), "offset");
            const t = this[e],
              r = this[e + 7];
            (void 0 !== t && void 0 !== r) || Y(e, this.length - 8);
            const n =
              (t << 24) + 65536 * this[++e] + 256 * this[++e] + this[++e];
            return (
              (BigInt(n) << BigInt(32)) +
              BigInt(
                this[++e] * 2 ** 24 + 65536 * this[++e] + 256 * this[++e] + r,
              )
            );
          })),
          (c.prototype.readFloatLE = function (e, t) {
            return (
              (e >>>= 0), t || D(e, 4, this.length), s.read(this, e, !0, 23, 4)
            );
          }),
          (c.prototype.readFloatBE = function (e, t) {
            return (
              (e >>>= 0), t || D(e, 4, this.length), s.read(this, e, !1, 23, 4)
            );
          }),
          (c.prototype.readDoubleLE = function (e, t) {
            return (
              (e >>>= 0), t || D(e, 8, this.length), s.read(this, e, !0, 52, 8)
            );
          }),
          (c.prototype.readDoubleBE = function (e, t) {
            return (
              (e >>>= 0), t || D(e, 8, this.length), s.read(this, e, !1, 52, 8)
            );
          }),
          (c.prototype.writeUintLE = c.prototype.writeUIntLE =
            function (e, t, r, n) {
              if (((e = +e), (t >>>= 0), (r >>>= 0), !n)) {
                L(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
              }
              let s = 1,
                i = 0;
              for (this[t] = 255 & e; ++i < r && (s *= 256); )
                this[t + i] = (e / s) & 255;
              return t + r;
            }),
          (c.prototype.writeUintBE = c.prototype.writeUIntBE =
            function (e, t, r, n) {
              if (((e = +e), (t >>>= 0), (r >>>= 0), !n)) {
                L(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
              }
              let s = r - 1,
                i = 1;
              for (this[t + s] = 255 & e; --s >= 0 && (i *= 256); )
                this[t + s] = (e / i) & 255;
              return t + r;
            }),
          (c.prototype.writeUint8 = c.prototype.writeUInt8 =
            function (e, t, r) {
              return (
                (e = +e),
                (t >>>= 0),
                r || L(this, e, t, 1, 255, 0),
                (this[t] = 255 & e),
                t + 1
              );
            }),
          (c.prototype.writeUint16LE = c.prototype.writeUInt16LE =
            function (e, t, r) {
              return (
                (e = +e),
                (t >>>= 0),
                r || L(this, e, t, 2, 65535, 0),
                (this[t] = 255 & e),
                (this[t + 1] = e >>> 8),
                t + 2
              );
            }),
          (c.prototype.writeUint16BE = c.prototype.writeUInt16BE =
            function (e, t, r) {
              return (
                (e = +e),
                (t >>>= 0),
                r || L(this, e, t, 2, 65535, 0),
                (this[t] = e >>> 8),
                (this[t + 1] = 255 & e),
                t + 2
              );
            }),
          (c.prototype.writeUint32LE = c.prototype.writeUInt32LE =
            function (e, t, r) {
              return (
                (e = +e),
                (t >>>= 0),
                r || L(this, e, t, 4, 4294967295, 0),
                (this[t + 3] = e >>> 24),
                (this[t + 2] = e >>> 16),
                (this[t + 1] = e >>> 8),
                (this[t] = 255 & e),
                t + 4
              );
            }),
          (c.prototype.writeUint32BE = c.prototype.writeUInt32BE =
            function (e, t, r) {
              return (
                (e = +e),
                (t >>>= 0),
                r || L(this, e, t, 4, 4294967295, 0),
                (this[t] = e >>> 24),
                (this[t + 1] = e >>> 16),
                (this[t + 2] = e >>> 8),
                (this[t + 3] = 255 & e),
                t + 4
              );
            }),
          (c.prototype.writeBigUInt64LE = K(function (e, t = 0) {
            return k(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
          })),
          (c.prototype.writeBigUInt64BE = K(function (e, t = 0) {
            return C(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
          })),
          (c.prototype.writeIntLE = function (e, t, r, n) {
            if (((e = +e), (t >>>= 0), !n)) {
              const n = Math.pow(2, 8 * r - 1);
              L(this, e, t, r, n - 1, -n);
            }
            let s = 0,
              i = 1,
              o = 0;
            for (this[t] = 255 & e; ++s < r && (i *= 256); )
              e < 0 && 0 === o && 0 !== this[t + s - 1] && (o = 1),
                (this[t + s] = (((e / i) | 0) - o) & 255);
            return t + r;
          }),
          (c.prototype.writeIntBE = function (e, t, r, n) {
            if (((e = +e), (t >>>= 0), !n)) {
              const n = Math.pow(2, 8 * r - 1);
              L(this, e, t, r, n - 1, -n);
            }
            let s = r - 1,
              i = 1,
              o = 0;
            for (this[t + s] = 255 & e; --s >= 0 && (i *= 256); )
              e < 0 && 0 === o && 0 !== this[t + s + 1] && (o = 1),
                (this[t + s] = (((e / i) | 0) - o) & 255);
            return t + r;
          }),
          (c.prototype.writeInt8 = function (e, t, r) {
            return (
              (e = +e),
              (t >>>= 0),
              r || L(this, e, t, 1, 127, -128),
              e < 0 && (e = 255 + e + 1),
              (this[t] = 255 & e),
              t + 1
            );
          }),
          (c.prototype.writeInt16LE = function (e, t, r) {
            return (
              (e = +e),
              (t >>>= 0),
              r || L(this, e, t, 2, 32767, -32768),
              (this[t] = 255 & e),
              (this[t + 1] = e >>> 8),
              t + 2
            );
          }),
          (c.prototype.writeInt16BE = function (e, t, r) {
            return (
              (e = +e),
              (t >>>= 0),
              r || L(this, e, t, 2, 32767, -32768),
              (this[t] = e >>> 8),
              (this[t + 1] = 255 & e),
              t + 2
            );
          }),
          (c.prototype.writeInt32LE = function (e, t, r) {
            return (
              (e = +e),
              (t >>>= 0),
              r || L(this, e, t, 4, 2147483647, -2147483648),
              (this[t] = 255 & e),
              (this[t + 1] = e >>> 8),
              (this[t + 2] = e >>> 16),
              (this[t + 3] = e >>> 24),
              t + 4
            );
          }),
          (c.prototype.writeInt32BE = function (e, t, r) {
            return (
              (e = +e),
              (t >>>= 0),
              r || L(this, e, t, 4, 2147483647, -2147483648),
              e < 0 && (e = 4294967295 + e + 1),
              (this[t] = e >>> 24),
              (this[t + 1] = e >>> 16),
              (this[t + 2] = e >>> 8),
              (this[t + 3] = 255 & e),
              t + 4
            );
          }),
          (c.prototype.writeBigInt64LE = K(function (e, t = 0) {
            return k(
              this,
              e,
              t,
              -BigInt("0x8000000000000000"),
              BigInt("0x7fffffffffffffff"),
            );
          })),
          (c.prototype.writeBigInt64BE = K(function (e, t = 0) {
            return C(
              this,
              e,
              t,
              -BigInt("0x8000000000000000"),
              BigInt("0x7fffffffffffffff"),
            );
          })),
          (c.prototype.writeFloatLE = function (e, t, r) {
            return z(this, e, t, !0, r);
          }),
          (c.prototype.writeFloatBE = function (e, t, r) {
            return z(this, e, t, !1, r);
          }),
          (c.prototype.writeDoubleLE = function (e, t, r) {
            return U(this, e, t, !0, r);
          }),
          (c.prototype.writeDoubleBE = function (e, t, r) {
            return U(this, e, t, !1, r);
          }),
          (c.prototype.copy = function (e, t, r, n) {
            if (!c.isBuffer(e))
              throw new TypeError("argument should be a Buffer");
            if (
              (r || (r = 0),
              n || 0 === n || (n = this.length),
              t >= e.length && (t = e.length),
              t || (t = 0),
              n > 0 && n < r && (n = r),
              n === r)
            )
              return 0;
            if (0 === e.length || 0 === this.length) return 0;
            if (t < 0) throw new RangeError("targetStart out of bounds");
            if (r < 0 || r >= this.length)
              throw new RangeError("Index out of range");
            if (n < 0) throw new RangeError("sourceEnd out of bounds");
            n > this.length && (n = this.length),
              e.length - t < n - r && (n = e.length - t + r);
            const s = n - r;
            return (
              this === e && "function" == typeof Uint8Array.prototype.copyWithin
                ? this.copyWithin(t, r, n)
                : Uint8Array.prototype.set.call(e, this.subarray(r, n), t),
              s
            );
          }),
          (c.prototype.fill = function (e, t, r, n) {
            if ("string" == typeof e) {
              if (
                ("string" == typeof t
                  ? ((n = t), (t = 0), (r = this.length))
                  : "string" == typeof r && ((n = r), (r = this.length)),
                void 0 !== n && "string" != typeof n)
              )
                throw new TypeError("encoding must be a string");
              if ("string" == typeof n && !c.isEncoding(n))
                throw new TypeError("Unknown encoding: " + n);
              if (1 === e.length) {
                const t = e.charCodeAt(0);
                (("utf8" === n && t < 128) || "latin1" === n) && (e = t);
              }
            } else
              "number" == typeof e
                ? (e &= 255)
                : "boolean" == typeof e && (e = Number(e));
            if (t < 0 || this.length < t || this.length < r)
              throw new RangeError("Out of range index");
            if (r <= t) return this;
            let s;
            if (
              ((t >>>= 0),
              (r = void 0 === r ? this.length : r >>> 0),
              e || (e = 0),
              "number" == typeof e)
            )
              for (s = t; s < r; ++s) this[s] = e;
            else {
              const i = c.isBuffer(e) ? e : c.from(e, n),
                o = i.length;
              if (0 === o)
                throw new TypeError(
                  'The value "' + e + '" is invalid for argument "value"',
                );
              for (s = 0; s < r - t; ++s) this[s + t] = i[s % o];
            }
            return this;
          });
        const _ = {};
        function P(e, t, r) {
          _[e] = class extends r {
            constructor() {
              super(),
                Object.defineProperty(this, "message", {
                  value: t.apply(this, arguments),
                  writable: !0,
                  configurable: !0,
                }),
                (this.name = `${this.name} [${e}]`),
                this.stack,
                delete this.name;
            }
            get code() {
              return e;
            }
            set code(e) {
              Object.defineProperty(this, "code", {
                configurable: !0,
                enumerable: !0,
                value: e,
                writable: !0,
              });
            }
            toString() {
              return `${this.name} [${e}]: ${this.message}`;
            }
          };
        }
        function F(e) {
          let t = "",
            r = e.length;
          const n = "-" === e[0] ? 1 : 0;
          for (; r >= n + 4; r -= 3) t = `_${e.slice(r - 3, r)}${t}`;
          return `${e.slice(0, r)}${t}`;
        }
        function q(e, t, r, n, s, i) {
          if (e > r || e < t) {
            const n = "bigint" == typeof t ? "n" : "";
            let s;
            throw (
              ((s =
                i > 3
                  ? 0 === t || t === BigInt(0)
                    ? `>= 0${n} and < 2${n} ** ${8 * (i + 1)}${n}`
                    : `>= -(2${n} ** ${8 * (i + 1) - 1}${n}) and < 2 ** ${8 * (i + 1) - 1}${n}`
                  : `>= ${t}${n} and <= ${r}${n}`),
              new _.ERR_OUT_OF_RANGE("value", s, e))
            );
          }
          !(function (e, t, r) {
            H(t, "offset"),
              (void 0 !== e[t] && void 0 !== e[t + r]) ||
                Y(t, e.length - (r + 1));
          })(n, s, i);
        }
        function H(e, t) {
          if ("number" != typeof e)
            throw new _.ERR_INVALID_ARG_TYPE(t, "number", e);
        }
        function Y(e, t, r) {
          if (Math.floor(e) !== e)
            throw (
              (H(e, r), new _.ERR_OUT_OF_RANGE(r || "offset", "an integer", e))
            );
          if (t < 0) throw new _.ERR_BUFFER_OUT_OF_BOUNDS();
          throw new _.ERR_OUT_OF_RANGE(
            r || "offset",
            `>= ${r ? 1 : 0} and <= ${t}`,
            e,
          );
        }
        P(
          "ERR_BUFFER_OUT_OF_BOUNDS",
          function (e) {
            return e
              ? `${e} is outside of buffer bounds`
              : "Attempt to access memory outside buffer bounds";
          },
          RangeError,
        ),
          P(
            "ERR_INVALID_ARG_TYPE",
            function (e, t) {
              return `The "${e}" argument must be of type number. Received type ${typeof t}`;
            },
            TypeError,
          ),
          P(
            "ERR_OUT_OF_RANGE",
            function (e, t, r) {
              let n = `The value of "${e}" is out of range.`,
                s = r;
              return (
                Number.isInteger(r) && Math.abs(r) > 2 ** 32
                  ? (s = F(String(r)))
                  : "bigint" == typeof r &&
                    ((s = String(r)),
                    (r > BigInt(2) ** BigInt(32) ||
                      r < -(BigInt(2) ** BigInt(32))) &&
                      (s = F(s)),
                    (s += "n")),
                (n += ` It must be ${t}. Received ${s}`),
                n
              );
            },
            RangeError,
          );
        const Q = /[^+/0-9A-Za-z-_]/g;
        function G(e, t) {
          let r;
          t = t || 1 / 0;
          const n = e.length;
          let s = null;
          const i = [];
          for (let o = 0; o < n; ++o) {
            if (((r = e.charCodeAt(o)), r > 55295 && r < 57344)) {
              if (!s) {
                if (r > 56319) {
                  (t -= 3) > -1 && i.push(239, 191, 189);
                  continue;
                }
                if (o + 1 === n) {
                  (t -= 3) > -1 && i.push(239, 191, 189);
                  continue;
                }
                s = r;
                continue;
              }
              if (r < 56320) {
                (t -= 3) > -1 && i.push(239, 191, 189), (s = r);
                continue;
              }
              r = 65536 + (((s - 55296) << 10) | (r - 56320));
            } else s && (t -= 3) > -1 && i.push(239, 191, 189);
            if (((s = null), r < 128)) {
              if ((t -= 1) < 0) break;
              i.push(r);
            } else if (r < 2048) {
              if ((t -= 2) < 0) break;
              i.push((r >> 6) | 192, (63 & r) | 128);
            } else if (r < 65536) {
              if ((t -= 3) < 0) break;
              i.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
            } else {
              if (!(r < 1114112)) throw new Error("Invalid code point");
              if ((t -= 4) < 0) break;
              i.push(
                (r >> 18) | 240,
                ((r >> 12) & 63) | 128,
                ((r >> 6) & 63) | 128,
                (63 & r) | 128,
              );
            }
          }
          return i;
        }
        function W(e) {
          return n.toByteArray(
            (function (e) {
              if ((e = (e = e.split("=")[0]).trim().replace(Q, "")).length < 2)
                return "";
              for (; e.length % 4 != 0; ) e += "=";
              return e;
            })(e),
          );
        }
        function Z(e, t, r, n) {
          let s;
          for (s = 0; s < n && !(s + r >= t.length || s >= e.length); ++s)
            t[s + r] = e[s];
          return s;
        }
        function $(e, t) {
          return (
            e instanceof t ||
            (null != e &&
              null != e.constructor &&
              null != e.constructor.name &&
              e.constructor.name === t.name)
          );
        }
        function J(e) {
          return e != e;
        }
        const V = (function () {
          const e = "0123456789abcdef",
            t = new Array(256);
          for (let r = 0; r < 16; ++r) {
            const n = 16 * r;
            for (let s = 0; s < 16; ++s) t[n + s] = e[r] + e[s];
          }
          return t;
        })();
        function K(e) {
          return "undefined" == typeof BigInt ? X : e;
        }
        function X() {
          throw new Error("BigInt not supported");
        }
      },
      251: (e, t) => {
        /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
        (t.read = function (e, t, r, n, s) {
          var i,
            o,
            a = 8 * s - n - 1,
            c = (1 << a) - 1,
            u = c >> 1,
            f = -7,
            d = r ? s - 1 : 0,
            l = r ? -1 : 1,
            h = e[t + d];
          for (
            d += l, i = h & ((1 << -f) - 1), h >>= -f, f += a;
            f > 0;
            i = 256 * i + e[t + d], d += l, f -= 8
          );
          for (
            o = i & ((1 << -f) - 1), i >>= -f, f += n;
            f > 0;
            o = 256 * o + e[t + d], d += l, f -= 8
          );
          if (0 === i) i = 1 - u;
          else {
            if (i === c) return o ? NaN : (1 / 0) * (h ? -1 : 1);
            (o += Math.pow(2, n)), (i -= u);
          }
          return (h ? -1 : 1) * o * Math.pow(2, i - n);
        }),
          (t.write = function (e, t, r, n, s, i) {
            var o,
              a,
              c,
              u = 8 * i - s - 1,
              f = (1 << u) - 1,
              d = f >> 1,
              l = 23 === s ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
              h = n ? 0 : i - 1,
              p = n ? 1 : -1,
              y = t < 0 || (0 === t && 1 / t < 0) ? 1 : 0;
            for (
              t = Math.abs(t),
                isNaN(t) || t === 1 / 0
                  ? ((a = isNaN(t) ? 1 : 0), (o = f))
                  : ((o = Math.floor(Math.log(t) / Math.LN2)),
                    t * (c = Math.pow(2, -o)) < 1 && (o--, (c *= 2)),
                    (t += o + d >= 1 ? l / c : l * Math.pow(2, 1 - d)) * c >=
                      2 && (o++, (c /= 2)),
                    o + d >= f
                      ? ((a = 0), (o = f))
                      : o + d >= 1
                        ? ((a = (t * c - 1) * Math.pow(2, s)), (o += d))
                        : ((a = t * Math.pow(2, d - 1) * Math.pow(2, s)),
                          (o = 0)));
              s >= 8;
              e[r + h] = 255 & a, h += p, a /= 256, s -= 8
            );
            for (
              o = (o << s) | a, u += s;
              u > 0;
              e[r + h] = 255 & o, h += p, o /= 256, u -= 8
            );
            e[r + h - p] |= 128 * y;
          });
      },
      35921: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.decode = t.encode = t.unescape = t.escape = t.pad = void 0);
        const n = r(67526);
        function s(e) {
          return `${e}${"=".repeat(4 - (e.length % 4 || 4))}`;
        }
        function i(e) {
          return e.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
        }
        function o(e) {
          return s(e).replace(/-/g, "+").replace(/_/g, "/");
        }
        (t.pad = s),
          (t.escape = i),
          (t.unescape = o),
          (t.encode = function (e) {
            return i((0, n.fromByteArray)(new TextEncoder().encode(e)));
          }),
          (t.decode = function (e) {
            return new TextDecoder().decode((0, n.toByteArray)(s(o(e))));
          });
      },
      61161: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.cryptoClients = t.SECP256K1Client = void 0);
        const n = r(92485);
        Object.defineProperty(t, "SECP256K1Client", {
          enumerable: !0,
          get: function () {
            return n.SECP256K1Client;
          },
        });
        const s = { ES256K: n.SECP256K1Client };
        t.cryptoClients = s;
      },
      92485: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.SECP256K1Client = void 0);
        const n = r(39615),
          s = r(22623),
          i = r(9598),
          o = r(96216),
          a = r(68886),
          c = r(99175);
        i.utils.hmacSha256Sync = (e, ...t) => {
          const r = n.hmac.create(s.sha256, e);
          return t.forEach((e) => r.update(e)), r.digest();
        };
        class u {
          static derivePublicKey(e, t = !0) {
            return (
              66 === e.length && (e = e.slice(0, 64)),
              e.length < 64 && (e = e.padStart(64, "0")),
              (0, c.bytesToHex)(i.getPublicKey(e, t))
            );
          }
          static signHash(e, t, r = "jose") {
            if (!e || !t)
              throw new a.MissingParametersError(
                "a signing input hash and private key are all required",
              );
            const n = i.signSync(e, t.slice(0, 64), { der: !0, canonical: !1 });
            if ("der" === r) return (0, c.bytesToHex)(n);
            if ("jose" === r) return (0, o.derToJose)(n, "ES256");
            throw Error("Invalid signature format");
          }
          static loadSignature(e) {
            return (0, o.joseToDer)(e, "ES256");
          }
          static verifyHash(e, t, r) {
            if (!e || !t || !r)
              throw new a.MissingParametersError(
                "a signing input hash, der signature, and public key are all required",
              );
            return i.verify(t, e, r, { strict: !1 });
          }
        }
        (t.SECP256K1Client = u), (u.algorithmName = "ES256K");
      },
      97990: function (e, t, r) {
        "use strict";
        var n =
          (this && this.__awaiter) ||
          function (e, t, r, n) {
            return new (r || (r = Promise))(function (s, i) {
              function o(e) {
                try {
                  c(n.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function a(e) {
                try {
                  c(n.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function c(e) {
                var t;
                e.done
                  ? s(e.value)
                  : ((t = e.value),
                    t instanceof r
                      ? t
                      : new r(function (e) {
                          e(t);
                        })).then(o, a);
              }
              c((n = n.apply(e, t || [])).next());
            });
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.hashSha256Async = t.hashSha256 = void 0);
        const s = r(22623);
        function i(e) {
          return (0, s.sha256)(e);
        }
        (t.hashSha256 = i),
          (t.hashSha256Async = function (e) {
            return n(this, void 0, void 0, function* () {
              try {
                if ("undefined" != typeof crypto && void 0 !== crypto.subtle) {
                  const t =
                      "string" == typeof e ? new TextEncoder().encode(e) : e,
                    r = yield crypto.subtle.digest("SHA-256", t);
                  return new Uint8Array(r);
                }
                {
                  const t = r(32632);
                  if (!t.createHash)
                    throw new Error(
                      "`crypto` module does not contain `createHash`",
                    );
                  return Promise.resolve(
                    t.createHash("sha256").update(e).digest(),
                  );
                }
              } catch (t) {
                return (
                  console.log(t),
                  console.log(
                    'Crypto lib not found. Neither the global `crypto.subtle` Web Crypto API, nor the or the Node.js `require("crypto").createHash` module is available. Falling back to JS implementation.',
                  ),
                  Promise.resolve(i(e))
                );
              }
            });
          });
      },
      21827: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.decodeToken = void 0);
        const n = r(35921);
        t.decodeToken = function (e) {
          if ("string" == typeof e) {
            const t = e.split(".");
            return {
              header: JSON.parse(n.decode(t[0])),
              payload: JSON.parse(n.decode(t[1])),
              signature: t[2],
            };
          }
          if ("object" == typeof e) {
            if ("string" != typeof e.payload)
              throw new Error(
                "Expected token payload to be a base64 or json string",
              );
            let t = e.payload;
            "{" !== e.payload[0] && (t = n.decode(t));
            const r = [];
            return (
              e.header.map((e) => {
                const t = JSON.parse(n.decode(e));
                r.push(t);
              }),
              { header: r, payload: JSON.parse(t), signature: e.signature }
            );
          }
        };
      },
      96216: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.joseToDer = t.derToJose = void 0);
        const n = r(67526),
          s = r(35921);
        function i(e) {
          return ((e / 8) | 0) + (e % 8 == 0 ? 0 : 1);
        }
        const o = { ES256: i(256), ES384: i(384), ES512: i(521) };
        function a(e) {
          const t = o[e];
          if (t) return t;
          throw new Error(`Unknown algorithm "${e}"`);
        }
        const c = 128;
        function u(e) {
          if (e instanceof Uint8Array) return e;
          if ("string" == typeof e) return (0, n.toByteArray)((0, s.pad)(e));
          throw new TypeError(
            "ECDSA signature must be a Base64 string or a Uint8Array",
          );
        }
        function f(e, t, r) {
          let n = 0;
          for (; t + n < r && 0 === e[t + n]; ) ++n;
          return e[t + n] >= c && --n, n;
        }
        (t.derToJose = function (e, t) {
          const r = u(e),
            i = a(t),
            o = i + 1,
            c = r.length;
          let f = 0;
          if (48 !== r[f++]) throw new Error('Could not find expected "seq"');
          let d = r[f++];
          if ((129 === d && (d = r[f++]), c - f < d))
            throw new Error(
              `"seq" specified length of "${d}", only "${c - f}" remaining`,
            );
          if (2 !== r[f++])
            throw new Error('Could not find expected "int" for "r"');
          const l = r[f++];
          if (c - f - 2 < l)
            throw new Error(
              `"r" specified length of "${l}", only "${c - f - 2}" available`,
            );
          if (o < l)
            throw new Error(
              `"r" specified length of "${l}", max of "${o}" is acceptable`,
            );
          const h = f;
          if (((f += l), 2 !== r[f++]))
            throw new Error('Could not find expected "int" for "s"');
          const p = r[f++];
          if (c - f !== p)
            throw new Error(
              `"s" specified length of "${p}", expected "${c - f}"`,
            );
          if (o < p)
            throw new Error(
              `"s" specified length of "${p}", max of "${o}" is acceptable`,
            );
          const y = f;
          if (((f += p), f !== c))
            throw new Error(
              `Expected to consume entire array, but "${c - f}" bytes remain`,
            );
          const g = i - l,
            w = i - p,
            m = new Uint8Array(g + l + w + p);
          for (f = 0; f < g; ++f) m[f] = 0;
          m.set(r.subarray(h + Math.max(-g, 0), h + l), f), (f = i);
          for (const e = f; f < e + w; ++f) m[f] = 0;
          return (
            m.set(r.subarray(y + Math.max(-w, 0), y + p), f),
            (0, s.escape)((0, n.fromByteArray)(m))
          );
        }),
          (t.joseToDer = function (e, t) {
            e = u(e);
            const r = a(t),
              n = e.length;
            if (n !== 2 * r)
              throw new TypeError(
                `"${t}" signatures must be "${2 * r}" bytes, saw "${n}"`,
              );
            const s = f(e, 0, r),
              i = f(e, r, e.length),
              o = r - s,
              d = r - i,
              l = 2 + o + 1 + 1 + d,
              h = l < c,
              p = new Uint8Array((h ? 2 : 3) + l);
            let y = 0;
            return (
              (p[y++] = 48),
              h ? (p[y++] = l) : ((p[y++] = 129), (p[y++] = 255 & l)),
              (p[y++] = 2),
              (p[y++] = o),
              s < 0
                ? ((p[y++] = 0), p.set(e.subarray(0, r), y), (y += r))
                : (p.set(e.subarray(s, r), y), (y += r - s)),
              (p[y++] = 2),
              (p[y++] = d),
              i < 0
                ? ((p[y++] = 0), p.set(e.subarray(r), y))
                : p.set(e.subarray(r + i), y),
              p
            );
          });
      },
      68886: (e, t) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.InvalidTokenError = t.MissingParametersError = void 0);
        class r extends Error {
          constructor(e) {
            super(),
              (this.name = "MissingParametersError"),
              (this.message = e || "");
          }
        }
        t.MissingParametersError = r;
        class n extends Error {
          constructor(e) {
            super(),
              (this.name = "InvalidTokenError"),
              (this.message = e || "");
          }
        }
        t.InvalidTokenError = n;
      },
      69057: function (e, t, r) {
        "use strict";
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, n) {
                  void 0 === n && (n = r);
                  var s = Object.getOwnPropertyDescriptor(t, r);
                  (s &&
                    !("get" in s
                      ? !t.__esModule
                      : s.writable || s.configurable)) ||
                    (s = {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    }),
                    Object.defineProperty(e, n, s);
                }
              : function (e, t, r, n) {
                  void 0 === n && (n = r), (e[n] = t[r]);
                }),
          s =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e)
                "default" === r ||
                  Object.prototype.hasOwnProperty.call(t, r) ||
                  n(t, e, r);
            };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          s(r(90675), t),
          s(r(2695), t),
          s(r(21827), t),
          s(r(68886), t),
          s(r(61161), t);
      },
      90675: function (e, t, r) {
        "use strict";
        var n =
          (this && this.__awaiter) ||
          function (e, t, r, n) {
            return new (r || (r = Promise))(function (s, i) {
              function o(e) {
                try {
                  c(n.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function a(e) {
                try {
                  c(n.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function c(e) {
                var t;
                e.done
                  ? s(e.value)
                  : ((t = e.value),
                    t instanceof r
                      ? t
                      : new r(function (e) {
                          e(t);
                        })).then(o, a);
              }
              c((n = n.apply(e, t || [])).next());
            });
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.TokenSigner = t.createUnsecuredToken = void 0);
        const s = r(35921),
          i = r(61161),
          o = r(68886),
          a = r(97990);
        function c(e, t) {
          const r = [],
            n = s.encode(JSON.stringify(t));
          r.push(n);
          const i = s.encode(JSON.stringify(e));
          r.push(i);
          return r.join(".");
        }
        t.createUnsecuredToken = function (e) {
          return c(e, { typ: "JWT", alg: "none" }) + ".";
        };
        t.TokenSigner = class {
          constructor(e, t) {
            if (!e || !t)
              throw new o.MissingParametersError(
                "a signing algorithm and private key are required",
              );
            if ("string" != typeof e)
              throw new Error("signing algorithm parameter must be a string");
            if (((e = e.toUpperCase()), !i.cryptoClients.hasOwnProperty(e)))
              throw new Error("invalid signing algorithm");
            (this.tokenType = "JWT"),
              (this.cryptoClient = i.cryptoClients[e]),
              (this.rawPrivateKey = t);
          }
          header(e = {}) {
            const t = {
              typ: this.tokenType,
              alg: this.cryptoClient.algorithmName,
            };
            return Object.assign({}, t, e);
          }
          sign(e, t = !1, r = {}) {
            const n = this.header(r),
              s = c(e, n),
              i = (0, a.hashSha256)(s);
            return this.createWithSignedHash(e, t, n, s, i);
          }
          signAsync(e, t = !1, r = {}) {
            return n(this, void 0, void 0, function* () {
              const n = this.header(r),
                s = c(e, n),
                i = yield (0, a.hashSha256Async)(s);
              return this.createWithSignedHash(e, t, n, s, i);
            });
          }
          createWithSignedHash(e, t, r, n, i) {
            const o = this.cryptoClient.signHash(i, this.rawPrivateKey);
            if (t) {
              return {
                header: [s.encode(JSON.stringify(r))],
                payload: JSON.stringify(e),
                signature: [o],
              };
            }
            return [n, o].join(".");
          }
        };
      },
      2695: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.TokenVerifier = void 0);
        const n = r(35921),
          s = r(61161),
          i = r(68886),
          o = r(97990);
        t.TokenVerifier = class {
          constructor(e, t) {
            if (!e || !t)
              throw new i.MissingParametersError(
                "a signing algorithm and public key are required",
              );
            if ("string" != typeof e)
              throw "signing algorithm parameter must be a string";
            if (((e = e.toUpperCase()), !s.cryptoClients.hasOwnProperty(e)))
              throw "invalid signing algorithm";
            (this.tokenType = "JWT"),
              (this.cryptoClient = s.cryptoClients[e]),
              (this.rawPublicKey = t);
          }
          verify(e) {
            return "string" == typeof e
              ? this.verifyCompact(e, !1)
              : "object" == typeof e && this.verifyExpanded(e, !1);
          }
          verifyAsync(e) {
            return "string" == typeof e
              ? this.verifyCompact(e, !0)
              : "object" == typeof e
                ? this.verifyExpanded(e, !0)
                : Promise.resolve(!1);
          }
          verifyCompact(e, t) {
            const r = e.split("."),
              n = r[0] + "." + r[1],
              s = (e) => {
                const t = this.cryptoClient.loadSignature(r[2]);
                return this.cryptoClient.verifyHash(e, t, this.rawPublicKey);
              };
            if (t) return (0, o.hashSha256Async)(n).then((e) => s(e));
            {
              const e = (0, o.hashSha256)(n);
              return s(e);
            }
          }
          verifyExpanded(e, t) {
            const r = [e.header.join("."), n.encode(e.payload)].join(".");
            let s = !0;
            const i = (t) => (
              e.signature.map((e) => {
                const r = this.cryptoClient.loadSignature(e);
                this.cryptoClient.verifyHash(t, r, this.rawPublicKey) ||
                  (s = !1);
              }),
              s
            );
            if (t) return (0, o.hashSha256Async)(r).then((e) => i(e));
            {
              const e = (0, o.hashSha256)(r);
              return i(e);
            }
          }
        };
      },
      65606: (e) => {
        var t,
          r,
          n = (e.exports = {});
        function s() {
          throw new Error("setTimeout has not been defined");
        }
        function i() {
          throw new Error("clearTimeout has not been defined");
        }
        function o(e) {
          if (t === setTimeout) return setTimeout(e, 0);
          if ((t === s || !t) && setTimeout)
            return (t = setTimeout), setTimeout(e, 0);
          try {
            return t(e, 0);
          } catch (r) {
            try {
              return t.call(null, e, 0);
            } catch (r) {
              return t.call(this, e, 0);
            }
          }
        }
        !(function () {
          try {
            t = "function" == typeof setTimeout ? setTimeout : s;
          } catch (e) {
            t = s;
          }
          try {
            r = "function" == typeof clearTimeout ? clearTimeout : i;
          } catch (e) {
            r = i;
          }
        })();
        var a,
          c = [],
          u = !1,
          f = -1;
        function d() {
          u &&
            a &&
            ((u = !1),
            a.length ? (c = a.concat(c)) : (f = -1),
            c.length && l());
        }
        function l() {
          if (!u) {
            var e = o(d);
            u = !0;
            for (var t = c.length; t; ) {
              for (a = c, c = []; ++f < t; ) a && a[f].run();
              (f = -1), (t = c.length);
            }
            (a = null),
              (u = !1),
              (function (e) {
                if (r === clearTimeout) return clearTimeout(e);
                if ((r === i || !r) && clearTimeout)
                  return (r = clearTimeout), clearTimeout(e);
                try {
                  return r(e);
                } catch (t) {
                  try {
                    return r.call(null, e);
                  } catch (t) {
                    return r.call(this, e);
                  }
                }
              })(e);
          }
        }
        function h(e, t) {
          (this.fun = e), (this.array = t);
        }
        function p() {}
        (n.nextTick = function (e) {
          var t = new Array(arguments.length - 1);
          if (arguments.length > 1)
            for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
          c.push(new h(e, t)), 1 !== c.length || u || o(l);
        }),
          (h.prototype.run = function () {
            this.fun.apply(null, this.array);
          }),
          (n.title = "browser"),
          (n.browser = !0),
          (n.env = {}),
          (n.argv = []),
          (n.version = ""),
          (n.versions = {}),
          (n.on = p),
          (n.addListener = p),
          (n.once = p),
          (n.off = p),
          (n.removeListener = p),
          (n.removeAllListeners = p),
          (n.emit = p),
          (n.prependListener = p),
          (n.prependOnceListener = p),
          (n.listeners = function (e) {
            return [];
          }),
          (n.binding = function (e) {
            throw new Error("process.binding is not supported");
          }),
          (n.cwd = function () {
            return "/";
          }),
          (n.chdir = function (e) {
            throw new Error("process.chdir is not supported");
          }),
          (n.umask = function () {
            return 0;
          });
      },
      14923: () => {},
      32632: () => {},
    },
    t = {};
  function r(n) {
    var s = t[n];
    if (void 0 !== s) return s.exports;
    var i = (t[n] = { exports: {} });
    return e[n].call(i.exports, i, i.exports, r), i.exports;
  }
  (r.d = (e, t) => {
    for (var n in t)
      r.o(t, n) &&
        !r.o(e, n) &&
        Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
  }),
    (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (r.r = (e) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (() => {
      "use strict";
      var e = {};
      r.r(e),
        r.d(e, {
          hasBrowserEnv: () => Pe,
          hasStandardBrowserEnv: () => qe,
          hasStandardBrowserWebWorkerEnv: () => He,
          navigator: () => Fe,
          origin: () => Ye,
        });
      var t, n, s;
      function i(e) {
        const t = typeof e;
        return "string" === t
          ? `"${e}"`
          : "number" === t || "bigint" === t || "boolean" === t
            ? `${e}`
            : "object" === t || "function" === t
              ? ((e && Object.getPrototypeOf(e)?.constructor?.name) ?? "null")
              : t;
      }
      function o(e, r, o, a, c) {
        const u = c && "input" in c ? c.input : o.value,
          f = c?.expected ?? e.expects ?? null,
          d = c?.received ?? i(u),
          l = {
            kind: e.kind,
            type: e.type,
            input: u,
            expected: f,
            received: d,
            message: `Invalid ${r}: ${f ? `Expected ${f} but r` : "R"}eceived ${d}`,
            requirement: e.requirement,
            path: c?.path,
            issues: c?.issues,
            lang: a.lang,
            abortEarly: a.abortEarly,
            abortPipeEarly: a.abortPipeEarly,
          },
          h = "schema" === e.kind,
          p =
            c?.message ??
            e.message ??
            ((y = e.reference), (g = l.lang), s?.get(y)?.get(g)) ??
            (h
              ? (function (e) {
                  return n?.get(e);
                })(l.lang)
              : null) ??
            a.message ??
            (function (e) {
              return t?.get(e);
            })(l.lang);
        var y, g;
        p && (l.message = "function" == typeof p ? p(l) : p),
          h && (o.typed = !1),
          o.issues ? o.issues.push(l) : (o.issues = [l]);
      }
      function a(e, t) {
        return (
          Object.hasOwn(e, t) &&
          "__proto__" !== t &&
          "prototype" !== t &&
          "constructor" !== t
        );
      }
      function c(e, t) {
        const r = [...new Set(e)];
        return r.length > 1 ? `(${r.join(` ${t} `)})` : (r[0] ?? "never");
      }
      Error;
      function u(e, t, r) {
        return "function" == typeof e.default ? e.default(t, r) : e.default;
      }
      function f(e, t) {
        return !e._run({ typed: !1, value: t }, { abortEarly: !0 }).issues;
      }
      function d(e, t) {
        return {
          kind: "schema",
          type: "array",
          reference: d,
          expects: "Array",
          async: !1,
          item: e,
          message: t,
          _run(e, t) {
            const r = e.value;
            if (Array.isArray(r)) {
              (e.typed = !0), (e.value = []);
              for (let n = 0; n < r.length; n++) {
                const s = r[n],
                  i = this.item._run({ typed: !1, value: s }, t);
                if (i.issues) {
                  const o = {
                    type: "array",
                    origin: "value",
                    input: r,
                    key: n,
                    value: s,
                  };
                  for (const t of i.issues)
                    t.path ? t.path.unshift(o) : (t.path = [o]),
                      e.issues?.push(t);
                  if ((e.issues || (e.issues = i.issues), t.abortEarly)) {
                    e.typed = !1;
                    break;
                  }
                }
                i.typed || (e.typed = !1), e.value.push(i.value);
              }
            } else o(this, "type", e, t);
            return e;
          },
        };
      }
      function l(e) {
        return {
          kind: "schema",
          type: "boolean",
          reference: l,
          expects: "boolean",
          async: !1,
          message: e,
          _run(e, t) {
            return (
              "boolean" == typeof e.value
                ? (e.typed = !0)
                : o(this, "type", e, t),
              e
            );
          },
        };
      }
      function h(e, t) {
        const r = Object.entries(e)
          .filter(([e]) => isNaN(+e))
          .map(([, e]) => e);
        return {
          kind: "schema",
          type: "enum",
          reference: h,
          expects: c(r.map(i), "|"),
          async: !1,
          enum: e,
          options: r,
          message: t,
          _run(e, t) {
            return (
              this.options.includes(e.value)
                ? (e.typed = !0)
                : o(this, "type", e, t),
              e
            );
          },
        };
      }
      function p(e, t) {
        return {
          kind: "schema",
          type: "literal",
          reference: p,
          expects: i(e),
          async: !1,
          literal: e,
          message: t,
          _run(e, t) {
            return (
              e.value === this.literal ? (e.typed = !0) : o(this, "type", e, t),
              e
            );
          },
        };
      }
      function y(e, t) {
        return {
          kind: "schema",
          type: "non_optional",
          reference: y,
          expects: "!undefined",
          async: !1,
          wrapped: e,
          message: t,
          _run(e, t) {
            return void 0 === e.value
              ? (o(this, "type", e, t), e)
              : this.wrapped._run(e, t);
          },
        };
      }
      function g(e) {
        return {
          kind: "schema",
          type: "null",
          reference: g,
          expects: "null",
          async: !1,
          message: e,
          _run(e, t) {
            return null === e.value ? (e.typed = !0) : o(this, "type", e, t), e;
          },
        };
      }
      function w(e, ...t) {
        const r = {
          kind: "schema",
          type: "nullish",
          reference: w,
          expects: `(${e.expects} | null | undefined)`,
          async: !1,
          wrapped: e,
          _run(e, t) {
            return (null !== e.value && void 0 !== e.value) ||
              ("default" in this && (e.value = u(this, e, t)),
              null !== e.value && void 0 !== e.value)
              ? this.wrapped._run(e, t)
              : ((e.typed = !0), e);
          },
        };
        return 0 in t && (r.default = t[0]), r;
      }
      function m(e) {
        return {
          kind: "schema",
          type: "number",
          reference: m,
          expects: "number",
          async: !1,
          message: e,
          _run(e, t) {
            return (
              "number" != typeof e.value || isNaN(e.value)
                ? o(this, "type", e, t)
                : (e.typed = !0),
              e
            );
          },
        };
      }
      function b(e, t) {
        return {
          kind: "schema",
          type: "object",
          reference: b,
          expects: "Object",
          async: !1,
          entries: e,
          message: t,
          _run(e, t) {
            const r = e.value;
            if (r && "object" == typeof r) {
              (e.typed = !0), (e.value = {});
              for (const n in this.entries) {
                const s = r[n],
                  i = this.entries[n]._run({ typed: !1, value: s }, t);
                if (i.issues) {
                  const o = {
                    type: "object",
                    origin: "value",
                    input: r,
                    key: n,
                    value: s,
                  };
                  for (const t of i.issues)
                    t.path ? t.path.unshift(o) : (t.path = [o]),
                      e.issues?.push(t);
                  if ((e.issues || (e.issues = i.issues), t.abortEarly)) {
                    e.typed = !1;
                    break;
                  }
                }
                i.typed || (e.typed = !1),
                  (void 0 !== i.value || n in r) && (e.value[n] = i.value);
              }
            } else o(this, "type", e, t);
            return e;
          },
        };
      }
      function E(e, ...t) {
        const r = {
          kind: "schema",
          type: "optional",
          reference: E,
          expects: `(${e.expects} | undefined)`,
          async: !1,
          wrapped: e,
          _run(e, t) {
            return void 0 === e.value &&
              ("default" in this && (e.value = u(this, e, t)),
              void 0 === e.value)
              ? ((e.typed = !0), e)
              : this.wrapped._run(e, t);
          },
        };
        return 0 in t && (r.default = t[0]), r;
      }
      function v(e, t) {
        return {
          kind: "schema",
          type: "picklist",
          reference: v,
          expects: c(e.map(i), "|"),
          async: !1,
          options: e,
          message: t,
          _run(e, t) {
            return (
              this.options.includes(e.value)
                ? (e.typed = !0)
                : o(this, "type", e, t),
              e
            );
          },
        };
      }
      function M(e) {
        return {
          kind: "schema",
          type: "string",
          reference: M,
          expects: "string",
          async: !1,
          message: e,
          _run(e, t) {
            return (
              "string" == typeof e.value
                ? (e.typed = !0)
                : o(this, "type", e, t),
              e
            );
          },
        };
      }
      function A(e) {
        let t;
        if (e) for (const r of e) t ? t.push(...r.issues) : (t = r.issues);
        return t;
      }
      function I(e, t) {
        return {
          kind: "schema",
          type: "union",
          reference: I,
          expects: c(
            e.map((e) => e.expects),
            "|",
          ),
          async: !1,
          options: e,
          message: t,
          _run(e, t) {
            let r, n, s;
            for (const i of this.options) {
              const o = i._run({ typed: !1, value: e.value }, t);
              if (o.typed) {
                if (!o.issues) {
                  r = o;
                  break;
                }
                n ? n.push(o) : (n = [o]);
              } else s ? s.push(o) : (s = [o]);
            }
            if (r) return r;
            if (n) {
              if (1 === n.length) return n[0];
              o(this, "type", e, t, { issues: A(n) }), (e.typed = !0);
            } else {
              if (1 === s?.length) return s[0];
              o(this, "type", e, t, { issues: A(s) });
            }
            return e;
          },
        };
      }
      function N() {
        return {
          kind: "schema",
          type: "unknown",
          reference: N,
          expects: "unknown",
          async: !1,
          _run: (e) => ((e.typed = !0), e),
        };
      }
      function T(e, t, r) {
        return {
          kind: "schema",
          type: "variant",
          reference: T,
          expects: "Object",
          async: !1,
          key: e,
          options: t,
          message: r,
          _run(e, t) {
            const r = e.value;
            if (r && "object" == typeof r) {
              let n,
                s = 0,
                i = this.key,
                a = [];
              const u = (e, o) => {
                for (const c of e.options) {
                  if ("variant" === c.type) u(c, new Set(o).add(c.key));
                  else {
                    let e = !0,
                      u = 0;
                    for (const n of o) {
                      if (
                        c.entries[n]._run({ typed: !1, value: r[n] }, t).issues
                      ) {
                        (e = !1),
                          i !== n &&
                            (s < u || (s === u && n in r && !(i in r))) &&
                            ((s = u), (i = n), (a = [])),
                          i === n && a.push(c.entries[n].expects);
                        break;
                      }
                      u++;
                    }
                    if (e) {
                      const e = c._run({ typed: !1, value: r }, t);
                      (!n || (!n.typed && e.typed)) && (n = e);
                    }
                  }
                  if (n && !n.issues) break;
                }
              };
              if ((u(this, new Set([this.key])), n)) return n;
              o(this, "type", e, t, {
                input: r[i],
                expected: c(a, "|"),
                path: [
                  {
                    type: "object",
                    origin: "value",
                    input: r,
                    key: i,
                    value: r[i],
                  },
                ],
              });
            } else o(this, "type", e, t);
            return e;
          },
        };
      }
      function x(e, t) {
        const r = { ...e.entries };
        for (const e of t) delete r[e];
        return { ...e, entries: r };
      }
      function j(...e) {
        return {
          ...e[0],
          pipe: e,
          _run(t, r) {
            for (const n of e)
              if ("metadata" !== n.kind) {
                if (
                  t.issues &&
                  ("schema" === n.kind || "transformation" === n.kind)
                ) {
                  t.typed = !1;
                  break;
                }
                (t.issues && (r.abortEarly || r.abortPipeEarly)) ||
                  (t = n._run(t, r));
              }
            return t;
          },
        };
      }
      r(69057);
      function S(e, t) {
        return function () {
          return e.apply(t, arguments);
        };
      }
      var O = r(65606);
      const { toString: R } = Object.prototype,
        { getPrototypeOf: D } = Object,
        L =
          ((k = Object.create(null)),
          (e) => {
            const t = R.call(e);
            return k[t] || (k[t] = t.slice(8, -1).toLowerCase());
          });
      var k;
      const C = (e) => ((e = e.toLowerCase()), (t) => L(t) === e),
        B = (e) => (t) => typeof t === e,
        { isArray: z } = Array,
        U = B("undefined");
      const _ = C("ArrayBuffer");
      const P = B("string"),
        F = B("function"),
        q = B("number"),
        H = (e) => null !== e && "object" == typeof e,
        Y = (e) => {
          if ("object" !== L(e)) return !1;
          const t = D(e);
          return !(
            (null !== t &&
              t !== Object.prototype &&
              null !== Object.getPrototypeOf(t)) ||
            Symbol.toStringTag in e ||
            Symbol.iterator in e
          );
        },
        Q = C("Date"),
        G = C("File"),
        W = C("Blob"),
        Z = C("FileList"),
        $ = C("URLSearchParams"),
        [J, V, K, X] = ["ReadableStream", "Request", "Response", "Headers"].map(
          C,
        );
      function ee(e, t, { allOwnKeys: r = !1 } = {}) {
        if (null == e) return;
        let n, s;
        if (("object" != typeof e && (e = [e]), z(e)))
          for (n = 0, s = e.length; n < s; n++) t.call(null, e[n], n, e);
        else {
          const s = r ? Object.getOwnPropertyNames(e) : Object.keys(e),
            i = s.length;
          let o;
          for (n = 0; n < i; n++) (o = s[n]), t.call(null, e[o], o, e);
        }
      }
      function te(e, t) {
        t = t.toLowerCase();
        const r = Object.keys(e);
        let n,
          s = r.length;
        for (; s-- > 0; ) if (((n = r[s]), t === n.toLowerCase())) return n;
        return null;
      }
      const re =
          "undefined" != typeof globalThis
            ? globalThis
            : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
                ? window
                : global,
        ne = (e) => !U(e) && e !== re;
      const se =
        ((ie = "undefined" != typeof Uint8Array && D(Uint8Array)),
        (e) => ie && e instanceof ie);
      var ie;
      const oe = C("HTMLFormElement"),
        ae = (
          ({ hasOwnProperty: e }) =>
          (t, r) =>
            e.call(t, r)
        )(Object.prototype),
        ce = C("RegExp"),
        ue = (e, t) => {
          const r = Object.getOwnPropertyDescriptors(e),
            n = {};
          ee(r, (r, s) => {
            let i;
            !1 !== (i = t(r, s, e)) && (n[s] = i || r);
          }),
            Object.defineProperties(e, n);
        },
        fe = "abcdefghijklmnopqrstuvwxyz",
        de = "0123456789",
        le = { DIGIT: de, ALPHA: fe, ALPHA_DIGIT: fe + fe.toUpperCase() + de };
      const he = C("AsyncFunction"),
        pe =
          ((ye = "function" == typeof setImmediate),
          (ge = F(re.postMessage)),
          ye
            ? setImmediate
            : ge
              ? ((we = `axios@${Math.random()}`),
                (me = []),
                re.addEventListener(
                  "message",
                  ({ source: e, data: t }) => {
                    e === re && t === we && me.length && me.shift()();
                  },
                  !1,
                ),
                (e) => {
                  me.push(e), re.postMessage(we, "*");
                })
              : (e) => setTimeout(e));
      var ye, ge, we, me;
      const be =
          "undefined" != typeof queueMicrotask
            ? queueMicrotask.bind(re)
            : (void 0 !== O && O.nextTick) || pe,
        Ee = {
          isArray: z,
          isArrayBuffer: _,
          isBuffer: function (e) {
            return (
              null !== e &&
              !U(e) &&
              null !== e.constructor &&
              !U(e.constructor) &&
              F(e.constructor.isBuffer) &&
              e.constructor.isBuffer(e)
            );
          },
          isFormData: (e) => {
            let t;
            return (
              e &&
              (("function" == typeof FormData && e instanceof FormData) ||
                (F(e.append) &&
                  ("formdata" === (t = L(e)) ||
                    ("object" === t &&
                      F(e.toString) &&
                      "[object FormData]" === e.toString()))))
            );
          },
          isArrayBufferView: function (e) {
            let t;
            return (
              (t =
                "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
                  ? ArrayBuffer.isView(e)
                  : e && e.buffer && _(e.buffer)),
              t
            );
          },
          isString: P,
          isNumber: q,
          isBoolean: (e) => !0 === e || !1 === e,
          isObject: H,
          isPlainObject: Y,
          isReadableStream: J,
          isRequest: V,
          isResponse: K,
          isHeaders: X,
          isUndefined: U,
          isDate: Q,
          isFile: G,
          isBlob: W,
          isRegExp: ce,
          isFunction: F,
          isStream: (e) => H(e) && F(e.pipe),
          isURLSearchParams: $,
          isTypedArray: se,
          isFileList: Z,
          forEach: ee,
          merge: function e() {
            const { caseless: t } = (ne(this) && this) || {},
              r = {},
              n = (n, s) => {
                const i = (t && te(r, s)) || s;
                Y(r[i]) && Y(n)
                  ? (r[i] = e(r[i], n))
                  : Y(n)
                    ? (r[i] = e({}, n))
                    : z(n)
                      ? (r[i] = n.slice())
                      : (r[i] = n);
              };
            for (let e = 0, t = arguments.length; e < t; e++)
              arguments[e] && ee(arguments[e], n);
            return r;
          },
          extend: (e, t, r, { allOwnKeys: n } = {}) => (
            ee(
              t,
              (t, n) => {
                r && F(t) ? (e[n] = S(t, r)) : (e[n] = t);
              },
              { allOwnKeys: n },
            ),
            e
          ),
          trim: (e) =>
            e.trim
              ? e.trim()
              : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""),
          stripBOM: (e) => (65279 === e.charCodeAt(0) && (e = e.slice(1)), e),
          inherits: (e, t, r, n) => {
            (e.prototype = Object.create(t.prototype, n)),
              (e.prototype.constructor = e),
              Object.defineProperty(e, "super", { value: t.prototype }),
              r && Object.assign(e.prototype, r);
          },
          toFlatObject: (e, t, r, n) => {
            let s, i, o;
            const a = {};
            if (((t = t || {}), null == e)) return t;
            do {
              for (s = Object.getOwnPropertyNames(e), i = s.length; i-- > 0; )
                (o = s[i]),
                  (n && !n(o, e, t)) || a[o] || ((t[o] = e[o]), (a[o] = !0));
              e = !1 !== r && D(e);
            } while (e && (!r || r(e, t)) && e !== Object.prototype);
            return t;
          },
          kindOf: L,
          kindOfTest: C,
          endsWith: (e, t, r) => {
            (e = String(e)),
              (void 0 === r || r > e.length) && (r = e.length),
              (r -= t.length);
            const n = e.indexOf(t, r);
            return -1 !== n && n === r;
          },
          toArray: (e) => {
            if (!e) return null;
            if (z(e)) return e;
            let t = e.length;
            if (!q(t)) return null;
            const r = new Array(t);
            for (; t-- > 0; ) r[t] = e[t];
            return r;
          },
          forEachEntry: (e, t) => {
            const r = (e && e[Symbol.iterator]).call(e);
            let n;
            for (; (n = r.next()) && !n.done; ) {
              const r = n.value;
              t.call(e, r[0], r[1]);
            }
          },
          matchAll: (e, t) => {
            let r;
            const n = [];
            for (; null !== (r = e.exec(t)); ) n.push(r);
            return n;
          },
          isHTMLForm: oe,
          hasOwnProperty: ae,
          hasOwnProp: ae,
          reduceDescriptors: ue,
          freezeMethods: (e) => {
            ue(e, (t, r) => {
              if (F(e) && -1 !== ["arguments", "caller", "callee"].indexOf(r))
                return !1;
              const n = e[r];
              F(n) &&
                ((t.enumerable = !1),
                "writable" in t
                  ? (t.writable = !1)
                  : t.set ||
                    (t.set = () => {
                      throw Error(
                        "Can not rewrite read-only method '" + r + "'",
                      );
                    }));
            });
          },
          toObjectSet: (e, t) => {
            const r = {},
              n = (e) => {
                e.forEach((e) => {
                  r[e] = !0;
                });
              };
            return z(e) ? n(e) : n(String(e).split(t)), r;
          },
          toCamelCase: (e) =>
            e
              .toLowerCase()
              .replace(/[-_\s]([a-z\d])(\w*)/g, function (e, t, r) {
                return t.toUpperCase() + r;
              }),
          noop: () => {},
          toFiniteNumber: (e, t) =>
            null != e && Number.isFinite((e = +e)) ? e : t,
          findKey: te,
          global: re,
          isContextDefined: ne,
          ALPHABET: le,
          generateString: (e = 16, t = le.ALPHA_DIGIT) => {
            let r = "";
            const { length: n } = t;
            for (; e--; ) r += t[(Math.random() * n) | 0];
            return r;
          },
          isSpecCompliantForm: function (e) {
            return !!(
              e &&
              F(e.append) &&
              "FormData" === e[Symbol.toStringTag] &&
              e[Symbol.iterator]
            );
          },
          toJSONObject: (e) => {
            const t = new Array(10),
              r = (e, n) => {
                if (H(e)) {
                  if (t.indexOf(e) >= 0) return;
                  if (!("toJSON" in e)) {
                    t[n] = e;
                    const s = z(e) ? [] : {};
                    return (
                      ee(e, (e, t) => {
                        const i = r(e, n + 1);
                        !U(i) && (s[t] = i);
                      }),
                      (t[n] = void 0),
                      s
                    );
                  }
                }
                return e;
              };
            return r(e, 0);
          },
          isAsyncFn: he,
          isThenable: (e) => e && (H(e) || F(e)) && F(e.then) && F(e.catch),
          setImmediate: pe,
          asap: be,
        };
      function ve(e, t, r, n, s) {
        Error.call(this),
          Error.captureStackTrace
            ? Error.captureStackTrace(this, this.constructor)
            : (this.stack = new Error().stack),
          (this.message = e),
          (this.name = "AxiosError"),
          t && (this.code = t),
          r && (this.config = r),
          n && (this.request = n),
          s &&
            ((this.response = s), (this.status = s.status ? s.status : null));
      }
      Ee.inherits(ve, Error, {
        toJSON: function () {
          return {
            message: this.message,
            name: this.name,
            description: this.description,
            number: this.number,
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            config: Ee.toJSONObject(this.config),
            code: this.code,
            status: this.status,
          };
        },
      });
      const Me = ve.prototype,
        Ae = {};
      [
        "ERR_BAD_OPTION_VALUE",
        "ERR_BAD_OPTION",
        "ECONNABORTED",
        "ETIMEDOUT",
        "ERR_NETWORK",
        "ERR_FR_TOO_MANY_REDIRECTS",
        "ERR_DEPRECATED",
        "ERR_BAD_RESPONSE",
        "ERR_BAD_REQUEST",
        "ERR_CANCELED",
        "ERR_NOT_SUPPORT",
        "ERR_INVALID_URL",
      ].forEach((e) => {
        Ae[e] = { value: e };
      }),
        Object.defineProperties(ve, Ae),
        Object.defineProperty(Me, "isAxiosError", { value: !0 }),
        (ve.from = (e, t, r, n, s, i) => {
          const o = Object.create(Me);
          return (
            Ee.toFlatObject(
              e,
              o,
              function (e) {
                return e !== Error.prototype;
              },
              (e) => "isAxiosError" !== e,
            ),
            ve.call(o, e.message, t, r, n, s),
            (o.cause = e),
            (o.name = e.name),
            i && Object.assign(o, i),
            o
          );
        });
      const Ie = ve;
      var Ne = r(48287).Buffer;
      function Te(e) {
        return Ee.isPlainObject(e) || Ee.isArray(e);
      }
      function xe(e) {
        return Ee.endsWith(e, "[]") ? e.slice(0, -2) : e;
      }
      function je(e, t, r) {
        return e
          ? e
              .concat(t)
              .map(function (e, t) {
                return (e = xe(e)), !r && t ? "[" + e + "]" : e;
              })
              .join(r ? "." : "")
          : t;
      }
      const Se = Ee.toFlatObject(Ee, {}, null, function (e) {
        return /^is[A-Z]/.test(e);
      });
      const Oe = function (e, t, r) {
        if (!Ee.isObject(e)) throw new TypeError("target must be an object");
        t = t || new FormData();
        const n = (r = Ee.toFlatObject(
            r,
            { metaTokens: !0, dots: !1, indexes: !1 },
            !1,
            function (e, t) {
              return !Ee.isUndefined(t[e]);
            },
          )).metaTokens,
          s = r.visitor || u,
          i = r.dots,
          o = r.indexes,
          a =
            (r.Blob || ("undefined" != typeof Blob && Blob)) &&
            Ee.isSpecCompliantForm(t);
        if (!Ee.isFunction(s))
          throw new TypeError("visitor must be a function");
        function c(e) {
          if (null === e) return "";
          if (Ee.isDate(e)) return e.toISOString();
          if (!a && Ee.isBlob(e))
            throw new Ie("Blob is not supported. Use a Buffer instead.");
          return Ee.isArrayBuffer(e) || Ee.isTypedArray(e)
            ? a && "function" == typeof Blob
              ? new Blob([e])
              : Ne.from(e)
            : e;
        }
        function u(e, r, s) {
          let a = e;
          if (e && !s && "object" == typeof e)
            if (Ee.endsWith(r, "{}"))
              (r = n ? r : r.slice(0, -2)), (e = JSON.stringify(e));
            else if (
              (Ee.isArray(e) &&
                (function (e) {
                  return Ee.isArray(e) && !e.some(Te);
                })(e)) ||
              ((Ee.isFileList(e) || Ee.endsWith(r, "[]")) &&
                (a = Ee.toArray(e)))
            )
              return (
                (r = xe(r)),
                a.forEach(function (e, n) {
                  !Ee.isUndefined(e) &&
                    null !== e &&
                    t.append(
                      !0 === o ? je([r], n, i) : null === o ? r : r + "[]",
                      c(e),
                    );
                }),
                !1
              );
          return !!Te(e) || (t.append(je(s, r, i), c(e)), !1);
        }
        const f = [],
          d = Object.assign(Se, {
            defaultVisitor: u,
            convertValue: c,
            isVisitable: Te,
          });
        if (!Ee.isObject(e)) throw new TypeError("data must be an object");
        return (
          (function e(r, n) {
            if (!Ee.isUndefined(r)) {
              if (-1 !== f.indexOf(r))
                throw Error("Circular reference detected in " + n.join("."));
              f.push(r),
                Ee.forEach(r, function (r, i) {
                  !0 ===
                    (!(Ee.isUndefined(r) || null === r) &&
                      s.call(t, r, Ee.isString(i) ? i.trim() : i, n, d)) &&
                    e(r, n ? n.concat(i) : [i]);
                }),
                f.pop();
            }
          })(e),
          t
        );
      };
      function Re(e) {
        const t = {
          "!": "%21",
          "'": "%27",
          "(": "%28",
          ")": "%29",
          "~": "%7E",
          "%20": "+",
          "%00": "\0",
        };
        return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (e) {
          return t[e];
        });
      }
      function De(e, t) {
        (this._pairs = []), e && Oe(e, this, t);
      }
      const Le = De.prototype;
      (Le.append = function (e, t) {
        this._pairs.push([e, t]);
      }),
        (Le.toString = function (e) {
          const t = e
            ? function (t) {
                return e.call(this, t, Re);
              }
            : Re;
          return this._pairs
            .map(function (e) {
              return t(e[0]) + "=" + t(e[1]);
            }, "")
            .join("&");
        });
      const ke = De;
      function Ce(e) {
        return encodeURIComponent(e)
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",")
          .replace(/%20/g, "+")
          .replace(/%5B/gi, "[")
          .replace(/%5D/gi, "]");
      }
      function Be(e, t, r) {
        if (!t) return e;
        const n = (r && r.encode) || Ce,
          s = r && r.serialize;
        let i;
        if (
          ((i = s
            ? s(t, r)
            : Ee.isURLSearchParams(t)
              ? t.toString()
              : new ke(t, r).toString(n)),
          i)
        ) {
          const t = e.indexOf("#");
          -1 !== t && (e = e.slice(0, t)),
            (e += (-1 === e.indexOf("?") ? "?" : "&") + i);
        }
        return e;
      }
      const ze = class {
          constructor() {
            this.handlers = [];
          }
          use(e, t, r) {
            return (
              this.handlers.push({
                fulfilled: e,
                rejected: t,
                synchronous: !!r && r.synchronous,
                runWhen: r ? r.runWhen : null,
              }),
              this.handlers.length - 1
            );
          }
          eject(e) {
            this.handlers[e] && (this.handlers[e] = null);
          }
          clear() {
            this.handlers && (this.handlers = []);
          }
          forEach(e) {
            Ee.forEach(this.handlers, function (t) {
              null !== t && e(t);
            });
          }
        },
        Ue = {
          silentJSONParsing: !0,
          forcedJSONParsing: !0,
          clarifyTimeoutError: !1,
        },
        _e = {
          isBrowser: !0,
          classes: {
            URLSearchParams:
              "undefined" != typeof URLSearchParams ? URLSearchParams : ke,
            FormData: "undefined" != typeof FormData ? FormData : null,
            Blob: "undefined" != typeof Blob ? Blob : null,
          },
          protocols: ["http", "https", "file", "blob", "url", "data"],
        },
        Pe = "undefined" != typeof window && "undefined" != typeof document,
        Fe = ("object" == typeof navigator && navigator) || void 0,
        qe =
          Pe &&
          (!Fe ||
            ["ReactNative", "NativeScript", "NS"].indexOf(Fe.product) < 0),
        He =
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          "function" == typeof self.importScripts,
        Ye = (Pe && window.location.href) || "http://localhost",
        Qe = { ...e, ..._e };
      const Ge = function (e) {
        function t(e, r, n, s) {
          let i = e[s++];
          if ("__proto__" === i) return !0;
          const o = Number.isFinite(+i),
            a = s >= e.length;
          if (((i = !i && Ee.isArray(n) ? n.length : i), a))
            return Ee.hasOwnProp(n, i) ? (n[i] = [n[i], r]) : (n[i] = r), !o;
          (n[i] && Ee.isObject(n[i])) || (n[i] = []);
          return (
            t(e, r, n[i], s) &&
              Ee.isArray(n[i]) &&
              (n[i] = (function (e) {
                const t = {},
                  r = Object.keys(e);
                let n;
                const s = r.length;
                let i;
                for (n = 0; n < s; n++) (i = r[n]), (t[i] = e[i]);
                return t;
              })(n[i])),
            !o
          );
        }
        if (Ee.isFormData(e) && Ee.isFunction(e.entries)) {
          const r = {};
          return (
            Ee.forEachEntry(e, (e, n) => {
              t(
                (function (e) {
                  return Ee.matchAll(/\w+|\[(\w*)]/g, e).map((e) =>
                    "[]" === e[0] ? "" : e[1] || e[0],
                  );
                })(e),
                n,
                r,
                0,
              );
            }),
            r
          );
        }
        return null;
      };
      const We = {
        transitional: Ue,
        adapter: ["xhr", "http", "fetch"],
        transformRequest: [
          function (e, t) {
            const r = t.getContentType() || "",
              n = r.indexOf("application/json") > -1,
              s = Ee.isObject(e);
            s && Ee.isHTMLForm(e) && (e = new FormData(e));
            if (Ee.isFormData(e)) return n ? JSON.stringify(Ge(e)) : e;
            if (
              Ee.isArrayBuffer(e) ||
              Ee.isBuffer(e) ||
              Ee.isStream(e) ||
              Ee.isFile(e) ||
              Ee.isBlob(e) ||
              Ee.isReadableStream(e)
            )
              return e;
            if (Ee.isArrayBufferView(e)) return e.buffer;
            if (Ee.isURLSearchParams(e))
              return (
                t.setContentType(
                  "application/x-www-form-urlencoded;charset=utf-8",
                  !1,
                ),
                e.toString()
              );
            let i;
            if (s) {
              if (r.indexOf("application/x-www-form-urlencoded") > -1)
                return (function (e, t) {
                  return Oe(
                    e,
                    new Qe.classes.URLSearchParams(),
                    Object.assign(
                      {
                        visitor: function (e, t, r, n) {
                          return Qe.isNode && Ee.isBuffer(e)
                            ? (this.append(t, e.toString("base64")), !1)
                            : n.defaultVisitor.apply(this, arguments);
                        },
                      },
                      t,
                    ),
                  );
                })(e, this.formSerializer).toString();
              if (
                (i = Ee.isFileList(e)) ||
                r.indexOf("multipart/form-data") > -1
              ) {
                const t = this.env && this.env.FormData;
                return Oe(
                  i ? { "files[]": e } : e,
                  t && new t(),
                  this.formSerializer,
                );
              }
            }
            return s || n
              ? (t.setContentType("application/json", !1),
                (function (e, t, r) {
                  if (Ee.isString(e))
                    try {
                      return (t || JSON.parse)(e), Ee.trim(e);
                    } catch (e) {
                      if ("SyntaxError" !== e.name) throw e;
                    }
                  return (r || JSON.stringify)(e);
                })(e))
              : e;
          },
        ],
        transformResponse: [
          function (e) {
            const t = this.transitional || We.transitional,
              r = t && t.forcedJSONParsing,
              n = "json" === this.responseType;
            if (Ee.isResponse(e) || Ee.isReadableStream(e)) return e;
            if (e && Ee.isString(e) && ((r && !this.responseType) || n)) {
              const r = !(t && t.silentJSONParsing) && n;
              try {
                return JSON.parse(e);
              } catch (e) {
                if (r) {
                  if ("SyntaxError" === e.name)
                    throw Ie.from(
                      e,
                      Ie.ERR_BAD_RESPONSE,
                      this,
                      null,
                      this.response,
                    );
                  throw e;
                }
              }
            }
            return e;
          },
        ],
        timeout: 0,
        xsrfCookieName: "XSRF-TOKEN",
        xsrfHeaderName: "X-XSRF-TOKEN",
        maxContentLength: -1,
        maxBodyLength: -1,
        env: { FormData: Qe.classes.FormData, Blob: Qe.classes.Blob },
        validateStatus: function (e) {
          return e >= 200 && e < 300;
        },
        headers: {
          common: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": void 0,
          },
        },
      };
      Ee.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
        We.headers[e] = {};
      });
      const Ze = We,
        $e = Ee.toObjectSet([
          "age",
          "authorization",
          "content-length",
          "content-type",
          "etag",
          "expires",
          "from",
          "host",
          "if-modified-since",
          "if-unmodified-since",
          "last-modified",
          "location",
          "max-forwards",
          "proxy-authorization",
          "referer",
          "retry-after",
          "user-agent",
        ]),
        Je = Symbol("internals");
      function Ve(e) {
        return e && String(e).trim().toLowerCase();
      }
      function Ke(e) {
        return !1 === e || null == e
          ? e
          : Ee.isArray(e)
            ? e.map(Ke)
            : String(e);
      }
      function Xe(e, t, r, n, s) {
        return Ee.isFunction(n)
          ? n.call(this, t, r)
          : (s && (t = r),
            Ee.isString(t)
              ? Ee.isString(n)
                ? -1 !== t.indexOf(n)
                : Ee.isRegExp(n)
                  ? n.test(t)
                  : void 0
              : void 0);
      }
      class et {
        constructor(e) {
          e && this.set(e);
        }
        set(e, t, r) {
          const n = this;
          function s(e, t, r) {
            const s = Ve(t);
            if (!s) throw new Error("header name must be a non-empty string");
            const i = Ee.findKey(n, s);
            (!i ||
              void 0 === n[i] ||
              !0 === r ||
              (void 0 === r && !1 !== n[i])) &&
              (n[i || t] = Ke(e));
          }
          const i = (e, t) => Ee.forEach(e, (e, r) => s(e, r, t));
          if (Ee.isPlainObject(e) || e instanceof this.constructor) i(e, t);
          else if (
            Ee.isString(e) &&
            (e = e.trim()) &&
            !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())
          )
            i(
              ((e) => {
                const t = {};
                let r, n, s;
                return (
                  e &&
                    e.split("\n").forEach(function (e) {
                      (s = e.indexOf(":")),
                        (r = e.substring(0, s).trim().toLowerCase()),
                        (n = e.substring(s + 1).trim()),
                        !r ||
                          (t[r] && $e[r]) ||
                          ("set-cookie" === r
                            ? t[r]
                              ? t[r].push(n)
                              : (t[r] = [n])
                            : (t[r] = t[r] ? t[r] + ", " + n : n));
                    }),
                  t
                );
              })(e),
              t,
            );
          else if (Ee.isHeaders(e))
            for (const [t, n] of e.entries()) s(n, t, r);
          else null != e && s(t, e, r);
          return this;
        }
        get(e, t) {
          if ((e = Ve(e))) {
            const r = Ee.findKey(this, e);
            if (r) {
              const e = this[r];
              if (!t) return e;
              if (!0 === t)
                return (function (e) {
                  const t = Object.create(null),
                    r = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
                  let n;
                  for (; (n = r.exec(e)); ) t[n[1]] = n[2];
                  return t;
                })(e);
              if (Ee.isFunction(t)) return t.call(this, e, r);
              if (Ee.isRegExp(t)) return t.exec(e);
              throw new TypeError("parser must be boolean|regexp|function");
            }
          }
        }
        has(e, t) {
          if ((e = Ve(e))) {
            const r = Ee.findKey(this, e);
            return !(!r || void 0 === this[r] || (t && !Xe(0, this[r], r, t)));
          }
          return !1;
        }
        delete(e, t) {
          const r = this;
          let n = !1;
          function s(e) {
            if ((e = Ve(e))) {
              const s = Ee.findKey(r, e);
              !s || (t && !Xe(0, r[s], s, t)) || (delete r[s], (n = !0));
            }
          }
          return Ee.isArray(e) ? e.forEach(s) : s(e), n;
        }
        clear(e) {
          const t = Object.keys(this);
          let r = t.length,
            n = !1;
          for (; r--; ) {
            const s = t[r];
            (e && !Xe(0, this[s], s, e, !0)) || (delete this[s], (n = !0));
          }
          return n;
        }
        normalize(e) {
          const t = this,
            r = {};
          return (
            Ee.forEach(this, (n, s) => {
              const i = Ee.findKey(r, s);
              if (i) return (t[i] = Ke(n)), void delete t[s];
              const o = e
                ? (function (e) {
                    return e
                      .trim()
                      .toLowerCase()
                      .replace(
                        /([a-z\d])(\w*)/g,
                        (e, t, r) => t.toUpperCase() + r,
                      );
                  })(s)
                : String(s).trim();
              o !== s && delete t[s], (t[o] = Ke(n)), (r[o] = !0);
            }),
            this
          );
        }
        concat(...e) {
          return this.constructor.concat(this, ...e);
        }
        toJSON(e) {
          const t = Object.create(null);
          return (
            Ee.forEach(this, (r, n) => {
              null != r &&
                !1 !== r &&
                (t[n] = e && Ee.isArray(r) ? r.join(", ") : r);
            }),
            t
          );
        }
        [Symbol.iterator]() {
          return Object.entries(this.toJSON())[Symbol.iterator]();
        }
        toString() {
          return Object.entries(this.toJSON())
            .map(([e, t]) => e + ": " + t)
            .join("\n");
        }
        get [Symbol.toStringTag]() {
          return "AxiosHeaders";
        }
        static from(e) {
          return e instanceof this ? e : new this(e);
        }
        static concat(e, ...t) {
          const r = new this(e);
          return t.forEach((e) => r.set(e)), r;
        }
        static accessor(e) {
          const t = (this[Je] = this[Je] = { accessors: {} }).accessors,
            r = this.prototype;
          function n(e) {
            const n = Ve(e);
            t[n] ||
              (!(function (e, t) {
                const r = Ee.toCamelCase(" " + t);
                ["get", "set", "has"].forEach((n) => {
                  Object.defineProperty(e, n + r, {
                    value: function (e, r, s) {
                      return this[n].call(this, t, e, r, s);
                    },
                    configurable: !0,
                  });
                });
              })(r, e),
              (t[n] = !0));
          }
          return Ee.isArray(e) ? e.forEach(n) : n(e), this;
        }
      }
      et.accessor([
        "Content-Type",
        "Content-Length",
        "Accept",
        "Accept-Encoding",
        "User-Agent",
        "Authorization",
      ]),
        Ee.reduceDescriptors(et.prototype, ({ value: e }, t) => {
          let r = t[0].toUpperCase() + t.slice(1);
          return {
            get: () => e,
            set(e) {
              this[r] = e;
            },
          };
        }),
        Ee.freezeMethods(et);
      const tt = et;
      function rt(e, t) {
        const r = this || Ze,
          n = t || r,
          s = tt.from(n.headers);
        let i = n.data;
        return (
          Ee.forEach(e, function (e) {
            i = e.call(r, i, s.normalize(), t ? t.status : void 0);
          }),
          s.normalize(),
          i
        );
      }
      function nt(e) {
        return !(!e || !e.__CANCEL__);
      }
      function st(e, t, r) {
        Ie.call(this, null == e ? "canceled" : e, Ie.ERR_CANCELED, t, r),
          (this.name = "CanceledError");
      }
      Ee.inherits(st, Ie, { __CANCEL__: !0 });
      const it = st;
      function ot(e, t, r) {
        const n = r.config.validateStatus;
        r.status && n && !n(r.status)
          ? t(
              new Ie(
                "Request failed with status code " + r.status,
                [Ie.ERR_BAD_REQUEST, Ie.ERR_BAD_RESPONSE][
                  Math.floor(r.status / 100) - 4
                ],
                r.config,
                r.request,
                r,
              ),
            )
          : e(r);
      }
      const at = function (e, t) {
        e = e || 10;
        const r = new Array(e),
          n = new Array(e);
        let s,
          i = 0,
          o = 0;
        return (
          (t = void 0 !== t ? t : 1e3),
          function (a) {
            const c = Date.now(),
              u = n[o];
            s || (s = c), (r[i] = a), (n[i] = c);
            let f = o,
              d = 0;
            for (; f !== i; ) (d += r[f++]), (f %= e);
            if (((i = (i + 1) % e), i === o && (o = (o + 1) % e), c - s < t))
              return;
            const l = u && c - u;
            return l ? Math.round((1e3 * d) / l) : void 0;
          }
        );
      };
      const ct = function (e, t) {
          let r,
            n,
            s = 0,
            i = 1e3 / t;
          const o = (t, i = Date.now()) => {
            (s = i),
              (r = null),
              n && (clearTimeout(n), (n = null)),
              e.apply(null, t);
          };
          return [
            (...e) => {
              const t = Date.now(),
                a = t - s;
              a >= i
                ? o(e, t)
                : ((r = e),
                  n ||
                    (n = setTimeout(() => {
                      (n = null), o(r);
                    }, i - a)));
            },
            () => r && o(r),
          ];
        },
        ut = (e, t, r = 3) => {
          let n = 0;
          const s = at(50, 250);
          return ct((r) => {
            const i = r.loaded,
              o = r.lengthComputable ? r.total : void 0,
              a = i - n,
              c = s(a);
            n = i;
            e({
              loaded: i,
              total: o,
              progress: o ? i / o : void 0,
              bytes: a,
              rate: c || void 0,
              estimated: c && o && i <= o ? (o - i) / c : void 0,
              event: r,
              lengthComputable: null != o,
              [t ? "download" : "upload"]: !0,
            });
          }, r);
        },
        ft = (e, t) => {
          const r = null != e;
          return [
            (n) => t[0]({ lengthComputable: r, total: e, loaded: n }),
            t[1],
          ];
        },
        dt =
          (e) =>
          (...t) =>
            Ee.asap(() => e(...t)),
        lt = Qe.hasStandardBrowserEnv
          ? (function () {
              const e =
                  Qe.navigator &&
                  /(msie|trident)/i.test(Qe.navigator.userAgent),
                t = document.createElement("a");
              let r;
              function n(r) {
                let n = r;
                return (
                  e && (t.setAttribute("href", n), (n = t.href)),
                  t.setAttribute("href", n),
                  {
                    href: t.href,
                    protocol: t.protocol ? t.protocol.replace(/:$/, "") : "",
                    host: t.host,
                    search: t.search ? t.search.replace(/^\?/, "") : "",
                    hash: t.hash ? t.hash.replace(/^#/, "") : "",
                    hostname: t.hostname,
                    port: t.port,
                    pathname:
                      "/" === t.pathname.charAt(0)
                        ? t.pathname
                        : "/" + t.pathname,
                  }
                );
              }
              return (
                (r = n(window.location.href)),
                function (e) {
                  const t = Ee.isString(e) ? n(e) : e;
                  return t.protocol === r.protocol && t.host === r.host;
                }
              );
            })()
          : function () {
              return !0;
            },
        ht = Qe.hasStandardBrowserEnv
          ? {
              write(e, t, r, n, s, i) {
                const o = [e + "=" + encodeURIComponent(t)];
                Ee.isNumber(r) &&
                  o.push("expires=" + new Date(r).toGMTString()),
                  Ee.isString(n) && o.push("path=" + n),
                  Ee.isString(s) && o.push("domain=" + s),
                  !0 === i && o.push("secure"),
                  (document.cookie = o.join("; "));
              },
              read(e) {
                const t = document.cookie.match(
                  new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"),
                );
                return t ? decodeURIComponent(t[3]) : null;
              },
              remove(e) {
                this.write(e, "", Date.now() - 864e5);
              },
            }
          : { write() {}, read: () => null, remove() {} };
      function pt(e, t) {
        return e &&
          !(function (e) {
            return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
          })(t)
          ? (function (e, t) {
              return t
                ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "")
                : e;
            })(e, t)
          : t;
      }
      const yt = (e) => (e instanceof tt ? { ...e } : e);
      function gt(e, t) {
        t = t || {};
        const r = {};
        function n(e, t, r) {
          return Ee.isPlainObject(e) && Ee.isPlainObject(t)
            ? Ee.merge.call({ caseless: r }, e, t)
            : Ee.isPlainObject(t)
              ? Ee.merge({}, t)
              : Ee.isArray(t)
                ? t.slice()
                : t;
        }
        function s(e, t, r) {
          return Ee.isUndefined(t)
            ? Ee.isUndefined(e)
              ? void 0
              : n(void 0, e, r)
            : n(e, t, r);
        }
        function i(e, t) {
          if (!Ee.isUndefined(t)) return n(void 0, t);
        }
        function o(e, t) {
          return Ee.isUndefined(t)
            ? Ee.isUndefined(e)
              ? void 0
              : n(void 0, e)
            : n(void 0, t);
        }
        function a(r, s, i) {
          return i in t ? n(r, s) : i in e ? n(void 0, r) : void 0;
        }
        const c = {
          url: i,
          method: i,
          data: i,
          baseURL: o,
          transformRequest: o,
          transformResponse: o,
          paramsSerializer: o,
          timeout: o,
          timeoutMessage: o,
          withCredentials: o,
          withXSRFToken: o,
          adapter: o,
          responseType: o,
          xsrfCookieName: o,
          xsrfHeaderName: o,
          onUploadProgress: o,
          onDownloadProgress: o,
          decompress: o,
          maxContentLength: o,
          maxBodyLength: o,
          beforeRedirect: o,
          transport: o,
          httpAgent: o,
          httpsAgent: o,
          cancelToken: o,
          socketPath: o,
          responseEncoding: o,
          validateStatus: a,
          headers: (e, t) => s(yt(e), yt(t), !0),
        };
        return (
          Ee.forEach(Object.keys(Object.assign({}, e, t)), function (n) {
            const i = c[n] || s,
              o = i(e[n], t[n], n);
            (Ee.isUndefined(o) && i !== a) || (r[n] = o);
          }),
          r
        );
      }
      const wt = (e) => {
          const t = gt({}, e);
          let r,
            {
              data: n,
              withXSRFToken: s,
              xsrfHeaderName: i,
              xsrfCookieName: o,
              headers: a,
              auth: c,
            } = t;
          if (
            ((t.headers = a = tt.from(a)),
            (t.url = Be(pt(t.baseURL, t.url), e.params, e.paramsSerializer)),
            c &&
              a.set(
                "Authorization",
                "Basic " +
                  btoa(
                    (c.username || "") +
                      ":" +
                      (c.password
                        ? unescape(encodeURIComponent(c.password))
                        : ""),
                  ),
              ),
            Ee.isFormData(n))
          )
            if (Qe.hasStandardBrowserEnv || Qe.hasStandardBrowserWebWorkerEnv)
              a.setContentType(void 0);
            else if (!1 !== (r = a.getContentType())) {
              const [e, ...t] = r
                ? r
                    .split(";")
                    .map((e) => e.trim())
                    .filter(Boolean)
                : [];
              a.setContentType([e || "multipart/form-data", ...t].join("; "));
            }
          if (
            Qe.hasStandardBrowserEnv &&
            (s && Ee.isFunction(s) && (s = s(t)), s || (!1 !== s && lt(t.url)))
          ) {
            const e = i && o && ht.read(o);
            e && a.set(i, e);
          }
          return t;
        },
        mt =
          "undefined" != typeof XMLHttpRequest &&
          function (e) {
            return new Promise(function (t, r) {
              const n = wt(e);
              let s = n.data;
              const i = tt.from(n.headers).normalize();
              let o,
                a,
                c,
                u,
                f,
                {
                  responseType: d,
                  onUploadProgress: l,
                  onDownloadProgress: h,
                } = n;
              function p() {
                u && u(),
                  f && f(),
                  n.cancelToken && n.cancelToken.unsubscribe(o),
                  n.signal && n.signal.removeEventListener("abort", o);
              }
              let y = new XMLHttpRequest();
              function g() {
                if (!y) return;
                const n = tt.from(
                  "getAllResponseHeaders" in y && y.getAllResponseHeaders(),
                );
                ot(
                  function (e) {
                    t(e), p();
                  },
                  function (e) {
                    r(e), p();
                  },
                  {
                    data:
                      d && "text" !== d && "json" !== d
                        ? y.response
                        : y.responseText,
                    status: y.status,
                    statusText: y.statusText,
                    headers: n,
                    config: e,
                    request: y,
                  },
                ),
                  (y = null);
              }
              y.open(n.method.toUpperCase(), n.url, !0),
                (y.timeout = n.timeout),
                "onloadend" in y
                  ? (y.onloadend = g)
                  : (y.onreadystatechange = function () {
                      y &&
                        4 === y.readyState &&
                        (0 !== y.status ||
                          (y.responseURL &&
                            0 === y.responseURL.indexOf("file:"))) &&
                        setTimeout(g);
                    }),
                (y.onabort = function () {
                  y &&
                    (r(new Ie("Request aborted", Ie.ECONNABORTED, e, y)),
                    (y = null));
                }),
                (y.onerror = function () {
                  r(new Ie("Network Error", Ie.ERR_NETWORK, e, y)), (y = null);
                }),
                (y.ontimeout = function () {
                  let t = n.timeout
                    ? "timeout of " + n.timeout + "ms exceeded"
                    : "timeout exceeded";
                  const s = n.transitional || Ue;
                  n.timeoutErrorMessage && (t = n.timeoutErrorMessage),
                    r(
                      new Ie(
                        t,
                        s.clarifyTimeoutError ? Ie.ETIMEDOUT : Ie.ECONNABORTED,
                        e,
                        y,
                      ),
                    ),
                    (y = null);
                }),
                void 0 === s && i.setContentType(null),
                "setRequestHeader" in y &&
                  Ee.forEach(i.toJSON(), function (e, t) {
                    y.setRequestHeader(t, e);
                  }),
                Ee.isUndefined(n.withCredentials) ||
                  (y.withCredentials = !!n.withCredentials),
                d && "json" !== d && (y.responseType = n.responseType),
                h && (([c, f] = ut(h, !0)), y.addEventListener("progress", c)),
                l &&
                  y.upload &&
                  (([a, u] = ut(l)),
                  y.upload.addEventListener("progress", a),
                  y.upload.addEventListener("loadend", u)),
                (n.cancelToken || n.signal) &&
                  ((o = (t) => {
                    y &&
                      (r(!t || t.type ? new it(null, e, y) : t),
                      y.abort(),
                      (y = null));
                  }),
                  n.cancelToken && n.cancelToken.subscribe(o),
                  n.signal &&
                    (n.signal.aborted
                      ? o()
                      : n.signal.addEventListener("abort", o)));
              const w = (function (e) {
                const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
                return (t && t[1]) || "";
              })(n.url);
              w && -1 === Qe.protocols.indexOf(w)
                ? r(
                    new Ie(
                      "Unsupported protocol " + w + ":",
                      Ie.ERR_BAD_REQUEST,
                      e,
                    ),
                  )
                : y.send(s || null);
            });
          },
        bt = (e, t) => {
          const { length: r } = (e = e ? e.filter(Boolean) : []);
          if (t || r) {
            let r,
              n = new AbortController();
            const s = function (e) {
              if (!r) {
                (r = !0), o();
                const t = e instanceof Error ? e : this.reason;
                n.abort(
                  t instanceof Ie
                    ? t
                    : new it(t instanceof Error ? t.message : t),
                );
              }
            };
            let i =
              t &&
              setTimeout(() => {
                (i = null),
                  s(new Ie(`timeout ${t} of ms exceeded`, Ie.ETIMEDOUT));
              }, t);
            const o = () => {
              e &&
                (i && clearTimeout(i),
                (i = null),
                e.forEach((e) => {
                  e.unsubscribe
                    ? e.unsubscribe(s)
                    : e.removeEventListener("abort", s);
                }),
                (e = null));
            };
            e.forEach((e) => e.addEventListener("abort", s));
            const { signal: a } = n;
            return (a.unsubscribe = () => Ee.asap(o)), a;
          }
        },
        Et = function* (e, t) {
          let r = e.byteLength;
          if (!t || r < t) return void (yield e);
          let n,
            s = 0;
          for (; s < r; ) (n = s + t), yield e.slice(s, n), (s = n);
        },
        vt = async function* (e) {
          if (e[Symbol.asyncIterator]) return void (yield* e);
          const t = e.getReader();
          try {
            for (;;) {
              const { done: e, value: r } = await t.read();
              if (e) break;
              yield r;
            }
          } finally {
            await t.cancel();
          }
        },
        Mt = (e, t, r, n) => {
          const s = (async function* (e, t) {
            for await (const r of vt(e)) yield* Et(r, t);
          })(e, t);
          let i,
            o = 0,
            a = (e) => {
              i || ((i = !0), n && n(e));
            };
          return new ReadableStream(
            {
              async pull(e) {
                try {
                  const { done: t, value: n } = await s.next();
                  if (t) return a(), void e.close();
                  let i = n.byteLength;
                  if (r) {
                    let e = (o += i);
                    r(e);
                  }
                  e.enqueue(new Uint8Array(n));
                } catch (e) {
                  throw (a(e), e);
                }
              },
              cancel: (e) => (a(e), s.return()),
            },
            { highWaterMark: 2 },
          );
        },
        At =
          "function" == typeof fetch &&
          "function" == typeof Request &&
          "function" == typeof Response,
        It = At && "function" == typeof ReadableStream,
        Nt =
          At &&
          ("function" == typeof TextEncoder
            ? ((Tt = new TextEncoder()), (e) => Tt.encode(e))
            : async (e) => new Uint8Array(await new Response(e).arrayBuffer()));
      var Tt;
      const xt = (e, ...t) => {
          try {
            return !!e(...t);
          } catch (e) {
            return !1;
          }
        },
        jt =
          It &&
          xt(() => {
            let e = !1;
            const t = new Request(Qe.origin, {
              body: new ReadableStream(),
              method: "POST",
              get duplex() {
                return (e = !0), "half";
              },
            }).headers.has("Content-Type");
            return e && !t;
          }),
        St = It && xt(() => Ee.isReadableStream(new Response("").body)),
        Ot = { stream: St && ((e) => e.body) };
      var Rt;
      At &&
        ((Rt = new Response()),
        ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
          !Ot[e] &&
            (Ot[e] = Ee.isFunction(Rt[e])
              ? (t) => t[e]()
              : (t, r) => {
                  throw new Ie(
                    `Response type '${e}' is not supported`,
                    Ie.ERR_NOT_SUPPORT,
                    r,
                  );
                });
        }));
      const Dt = async (e, t) => {
          const r = Ee.toFiniteNumber(e.getContentLength());
          return null == r
            ? (async (e) => {
                if (null == e) return 0;
                if (Ee.isBlob(e)) return e.size;
                if (Ee.isSpecCompliantForm(e)) {
                  const t = new Request(Qe.origin, { method: "POST", body: e });
                  return (await t.arrayBuffer()).byteLength;
                }
                return Ee.isArrayBufferView(e) || Ee.isArrayBuffer(e)
                  ? e.byteLength
                  : (Ee.isURLSearchParams(e) && (e += ""),
                    Ee.isString(e) ? (await Nt(e)).byteLength : void 0);
              })(t)
            : r;
        },
        Lt =
          At &&
          (async (e) => {
            let {
              url: t,
              method: r,
              data: n,
              signal: s,
              cancelToken: i,
              timeout: o,
              onDownloadProgress: a,
              onUploadProgress: c,
              responseType: u,
              headers: f,
              withCredentials: d = "same-origin",
              fetchOptions: l,
            } = wt(e);
            u = u ? (u + "").toLowerCase() : "text";
            let h,
              p = bt([s, i && i.toAbortSignal()], o);
            const y =
              p &&
              p.unsubscribe &&
              (() => {
                p.unsubscribe();
              });
            let g;
            try {
              if (
                c &&
                jt &&
                "get" !== r &&
                "head" !== r &&
                0 !== (g = await Dt(f, n))
              ) {
                let e,
                  r = new Request(t, {
                    method: "POST",
                    body: n,
                    duplex: "half",
                  });
                if (
                  (Ee.isFormData(n) &&
                    (e = r.headers.get("content-type")) &&
                    f.setContentType(e),
                  r.body)
                ) {
                  const [e, t] = ft(g, ut(dt(c)));
                  n = Mt(r.body, 65536, e, t);
                }
              }
              Ee.isString(d) || (d = d ? "include" : "omit");
              const s = "credentials" in Request.prototype;
              h = new Request(t, {
                ...l,
                signal: p,
                method: r.toUpperCase(),
                headers: f.normalize().toJSON(),
                body: n,
                duplex: "half",
                credentials: s ? d : void 0,
              });
              let i = await fetch(h);
              const o = St && ("stream" === u || "response" === u);
              if (St && (a || (o && y))) {
                const e = {};
                ["status", "statusText", "headers"].forEach((t) => {
                  e[t] = i[t];
                });
                const t = Ee.toFiniteNumber(i.headers.get("content-length")),
                  [r, n] = (a && ft(t, ut(dt(a), !0))) || [];
                i = new Response(
                  Mt(i.body, 65536, r, () => {
                    n && n(), y && y();
                  }),
                  e,
                );
              }
              u = u || "text";
              let w = await Ot[Ee.findKey(Ot, u) || "text"](i, e);
              return (
                !o && y && y(),
                await new Promise((t, r) => {
                  ot(t, r, {
                    data: w,
                    headers: tt.from(i.headers),
                    status: i.status,
                    statusText: i.statusText,
                    config: e,
                    request: h,
                  });
                })
              );
            } catch (t) {
              if (
                (y && y(),
                t && "TypeError" === t.name && /fetch/i.test(t.message))
              )
                throw Object.assign(
                  new Ie("Network Error", Ie.ERR_NETWORK, e, h),
                  { cause: t.cause || t },
                );
              throw Ie.from(t, t && t.code, e, h);
            }
          }),
        kt = { http: null, xhr: mt, fetch: Lt };
      Ee.forEach(kt, (e, t) => {
        if (e) {
          try {
            Object.defineProperty(e, "name", { value: t });
          } catch (e) {}
          Object.defineProperty(e, "adapterName", { value: t });
        }
      });
      const Ct = (e) => `- ${e}`,
        Bt = (e) => Ee.isFunction(e) || null === e || !1 === e,
        zt = (e) => {
          e = Ee.isArray(e) ? e : [e];
          const { length: t } = e;
          let r, n;
          const s = {};
          for (let i = 0; i < t; i++) {
            let t;
            if (
              ((r = e[i]),
              (n = r),
              !Bt(r) && ((n = kt[(t = String(r)).toLowerCase()]), void 0 === n))
            )
              throw new Ie(`Unknown adapter '${t}'`);
            if (n) break;
            s[t || "#" + i] = n;
          }
          if (!n) {
            const e = Object.entries(s).map(
              ([e, t]) =>
                `adapter ${e} ` +
                (!1 === t
                  ? "is not supported by the environment"
                  : "is not available in the build"),
            );
            let r = t
              ? e.length > 1
                ? "since :\n" + e.map(Ct).join("\n")
                : " " + Ct(e[0])
              : "as no adapter specified";
            throw new Ie(
              "There is no suitable adapter to dispatch the request " + r,
              "ERR_NOT_SUPPORT",
            );
          }
          return n;
        };
      function Ut(e) {
        if (
          (e.cancelToken && e.cancelToken.throwIfRequested(),
          e.signal && e.signal.aborted)
        )
          throw new it(null, e);
      }
      function _t(e) {
        Ut(e),
          (e.headers = tt.from(e.headers)),
          (e.data = rt.call(e, e.transformRequest)),
          -1 !== ["post", "put", "patch"].indexOf(e.method) &&
            e.headers.setContentType("application/x-www-form-urlencoded", !1);
        return zt(e.adapter || Ze.adapter)(e).then(
          function (t) {
            return (
              Ut(e),
              (t.data = rt.call(e, e.transformResponse, t)),
              (t.headers = tt.from(t.headers)),
              t
            );
          },
          function (t) {
            return (
              nt(t) ||
                (Ut(e),
                t &&
                  t.response &&
                  ((t.response.data = rt.call(
                    e,
                    e.transformResponse,
                    t.response,
                  )),
                  (t.response.headers = tt.from(t.response.headers)))),
              Promise.reject(t)
            );
          },
        );
      }
      const Pt = "1.7.7",
        Ft = {};
      ["object", "boolean", "number", "function", "string", "symbol"].forEach(
        (e, t) => {
          Ft[e] = function (r) {
            return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
          };
        },
      );
      const qt = {};
      Ft.transitional = function (e, t, r) {
        function n(e, t) {
          return (
            "[Axios v1.7.7] Transitional option '" +
            e +
            "'" +
            t +
            (r ? ". " + r : "")
          );
        }
        return (r, s, i) => {
          if (!1 === e)
            throw new Ie(
              n(s, " has been removed" + (t ? " in " + t : "")),
              Ie.ERR_DEPRECATED,
            );
          return (
            t &&
              !qt[s] &&
              ((qt[s] = !0),
              console.warn(
                n(
                  s,
                  " has been deprecated since v" +
                    t +
                    " and will be removed in the near future",
                ),
              )),
            !e || e(r, s, i)
          );
        };
      };
      const Ht = {
          assertOptions: function (e, t, r) {
            if ("object" != typeof e)
              throw new Ie(
                "options must be an object",
                Ie.ERR_BAD_OPTION_VALUE,
              );
            const n = Object.keys(e);
            let s = n.length;
            for (; s-- > 0; ) {
              const i = n[s],
                o = t[i];
              if (o) {
                const t = e[i],
                  r = void 0 === t || o(t, i, e);
                if (!0 !== r)
                  throw new Ie(
                    "option " + i + " must be " + r,
                    Ie.ERR_BAD_OPTION_VALUE,
                  );
              } else if (!0 !== r)
                throw new Ie("Unknown option " + i, Ie.ERR_BAD_OPTION);
            }
          },
          validators: Ft,
        },
        Yt = Ht.validators;
      class Qt {
        constructor(e) {
          (this.defaults = e),
            (this.interceptors = { request: new ze(), response: new ze() });
        }
        async request(e, t) {
          try {
            return await this._request(e, t);
          } catch (e) {
            if (e instanceof Error) {
              let t;
              Error.captureStackTrace
                ? Error.captureStackTrace((t = {}))
                : (t = new Error());
              const r = t.stack ? t.stack.replace(/^.+\n/, "") : "";
              try {
                e.stack
                  ? r &&
                    !String(e.stack).endsWith(r.replace(/^.+\n.+\n/, "")) &&
                    (e.stack += "\n" + r)
                  : (e.stack = r);
              } catch (e) {}
            }
            throw e;
          }
        }
        _request(e, t) {
          "string" == typeof e ? ((t = t || {}).url = e) : (t = e || {}),
            (t = gt(this.defaults, t));
          const { transitional: r, paramsSerializer: n, headers: s } = t;
          void 0 !== r &&
            Ht.assertOptions(
              r,
              {
                silentJSONParsing: Yt.transitional(Yt.boolean),
                forcedJSONParsing: Yt.transitional(Yt.boolean),
                clarifyTimeoutError: Yt.transitional(Yt.boolean),
              },
              !1,
            ),
            null != n &&
              (Ee.isFunction(n)
                ? (t.paramsSerializer = { serialize: n })
                : Ht.assertOptions(
                    n,
                    { encode: Yt.function, serialize: Yt.function },
                    !0,
                  )),
            (t.method = (
              t.method ||
              this.defaults.method ||
              "get"
            ).toLowerCase());
          let i = s && Ee.merge(s.common, s[t.method]);
          s &&
            Ee.forEach(
              ["delete", "get", "head", "post", "put", "patch", "common"],
              (e) => {
                delete s[e];
              },
            ),
            (t.headers = tt.concat(i, s));
          const o = [];
          let a = !0;
          this.interceptors.request.forEach(function (e) {
            ("function" == typeof e.runWhen && !1 === e.runWhen(t)) ||
              ((a = a && e.synchronous), o.unshift(e.fulfilled, e.rejected));
          });
          const c = [];
          let u;
          this.interceptors.response.forEach(function (e) {
            c.push(e.fulfilled, e.rejected);
          });
          let f,
            d = 0;
          if (!a) {
            const e = [_t.bind(this), void 0];
            for (
              e.unshift.apply(e, o),
                e.push.apply(e, c),
                f = e.length,
                u = Promise.resolve(t);
              d < f;

            )
              u = u.then(e[d++], e[d++]);
            return u;
          }
          f = o.length;
          let l = t;
          for (d = 0; d < f; ) {
            const e = o[d++],
              t = o[d++];
            try {
              l = e(l);
            } catch (e) {
              t.call(this, e);
              break;
            }
          }
          try {
            u = _t.call(this, l);
          } catch (e) {
            return Promise.reject(e);
          }
          for (d = 0, f = c.length; d < f; ) u = u.then(c[d++], c[d++]);
          return u;
        }
        getUri(e) {
          return Be(
            pt((e = gt(this.defaults, e)).baseURL, e.url),
            e.params,
            e.paramsSerializer,
          );
        }
      }
      Ee.forEach(["delete", "get", "head", "options"], function (e) {
        Qt.prototype[e] = function (t, r) {
          return this.request(
            gt(r || {}, { method: e, url: t, data: (r || {}).data }),
          );
        };
      }),
        Ee.forEach(["post", "put", "patch"], function (e) {
          function t(t) {
            return function (r, n, s) {
              return this.request(
                gt(s || {}, {
                  method: e,
                  headers: t ? { "Content-Type": "multipart/form-data" } : {},
                  url: r,
                  data: n,
                }),
              );
            };
          }
          (Qt.prototype[e] = t()), (Qt.prototype[e + "Form"] = t(!0));
        });
      const Gt = Qt;
      class Wt {
        constructor(e) {
          if ("function" != typeof e)
            throw new TypeError("executor must be a function.");
          let t;
          this.promise = new Promise(function (e) {
            t = e;
          });
          const r = this;
          this.promise.then((e) => {
            if (!r._listeners) return;
            let t = r._listeners.length;
            for (; t-- > 0; ) r._listeners[t](e);
            r._listeners = null;
          }),
            (this.promise.then = (e) => {
              let t;
              const n = new Promise((e) => {
                r.subscribe(e), (t = e);
              }).then(e);
              return (
                (n.cancel = function () {
                  r.unsubscribe(t);
                }),
                n
              );
            }),
            e(function (e, n, s) {
              r.reason || ((r.reason = new it(e, n, s)), t(r.reason));
            });
        }
        throwIfRequested() {
          if (this.reason) throw this.reason;
        }
        subscribe(e) {
          this.reason
            ? e(this.reason)
            : this._listeners
              ? this._listeners.push(e)
              : (this._listeners = [e]);
        }
        unsubscribe(e) {
          if (!this._listeners) return;
          const t = this._listeners.indexOf(e);
          -1 !== t && this._listeners.splice(t, 1);
        }
        toAbortSignal() {
          const e = new AbortController(),
            t = (t) => {
              e.abort(t);
            };
          return (
            this.subscribe(t),
            (e.signal.unsubscribe = () => this.unsubscribe(t)),
            e.signal
          );
        }
        static source() {
          let e;
          const t = new Wt(function (t) {
            e = t;
          });
          return { token: t, cancel: e };
        }
      }
      const Zt = Wt;
      const $t = {
        Continue: 100,
        SwitchingProtocols: 101,
        Processing: 102,
        EarlyHints: 103,
        Ok: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        MultiStatus: 207,
        AlreadyReported: 208,
        ImUsed: 226,
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        UseProxy: 305,
        Unused: 306,
        TemporaryRedirect: 307,
        PermanentRedirect: 308,
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        PayloadTooLarge: 413,
        UriTooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        ImATeapot: 418,
        MisdirectedRequest: 421,
        UnprocessableEntity: 422,
        Locked: 423,
        FailedDependency: 424,
        TooEarly: 425,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451,
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HttpVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        InsufficientStorage: 507,
        LoopDetected: 508,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511,
      };
      Object.entries($t).forEach(([e, t]) => {
        $t[t] = e;
      });
      const Jt = $t;
      const Vt = (function e(t) {
        const r = new Gt(t),
          n = S(Gt.prototype.request, r);
        return (
          Ee.extend(n, Gt.prototype, r, { allOwnKeys: !0 }),
          Ee.extend(n, r, null, { allOwnKeys: !0 }),
          (n.create = function (r) {
            return e(gt(t, r));
          }),
          n
        );
      })(Ze);
      (Vt.Axios = Gt),
        (Vt.CanceledError = it),
        (Vt.CancelToken = Zt),
        (Vt.isCancel = nt),
        (Vt.VERSION = Pt),
        (Vt.toFormData = Oe),
        (Vt.AxiosError = Ie),
        (Vt.Cancel = Vt.CanceledError),
        (Vt.all = function (e) {
          return Promise.all(e);
        }),
        (Vt.spread = function (e) {
          return function (t) {
            return e.apply(null, t);
          };
        }),
        (Vt.isAxiosError = function (e) {
          return Ee.isObject(e) && !0 === e.isAxiosError;
        }),
        (Vt.mergeConfig = gt),
        (Vt.AxiosHeaders = tt),
        (Vt.formToJSON = (e) => Ge(Ee.isHTMLForm(e) ? new FormData(e) : e)),
        (Vt.getAdapter = zt),
        (Vt.HttpStatusCode = Jt),
        (Vt.default = Vt);
      const Kt = Vt;
      /*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
      var Xt = function () {
          return (
            (Xt =
              Object.assign ||
              function (e) {
                for (var t, r = 1, n = arguments.length; r < n; r++)
                  for (var s in (t = arguments[r]))
                    Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
                return e;
              }),
            Xt.apply(this, arguments)
          );
        },
        er = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
        tr = (e) => {
          if (!e || "string" != typeof e)
            throw new Error(`Expected base58 string but got “${e}”`);
          if (e.match(/[IOl0]/gmu))
            throw new Error(
              `Invalid base58 character “${e.match(/[IOl0]/gmu)}”`,
            );
          const t = e.match(/^1+/gmu),
            r = t ? t[0].length : 0,
            n = ((e.length - r) * (Math.log(58) / Math.log(256)) + 1) >>> 0;
          return new Uint8Array([
            ...new Uint8Array(r),
            ...e
              .match(/.{1}/gmu)
              .map((e) => er.indexOf(e))
              .reduce(
                (e, t) =>
                  e.map((e) => {
                    const r = 58 * e + t;
                    return (t = r >> 8), r;
                  }),
                new Uint8Array(n),
              )
              .reverse()
              .filter(((s = !1), (e) => (s = s || e))),
          ]);
          var s;
        };
      (() => {
        const e = Array(256).fill(-1);
        for (let t = 0; t < 58; ++t) e[er.charCodeAt(t)] = t;
      })();
      var rr,
        nr,
        sr,
        ir = () => {},
        or =
          ((rr = function (e, t) {
            Object.defineProperty(t, "__esModule", { value: !0 }),
              (t.bech32m = t.bech32 = void 0);
            const r = "qpzry9x8gf2tvdw0s3jn54khce6mua7l",
              n = {};
            for (let e = 0; e < 32; e++) {
              const t = r.charAt(e);
              n[t] = e;
            }
            function s(e) {
              const t = e >> 25;
              return (
                ((33554431 & e) << 5) ^
                (996825010 & -(1 & t)) ^
                (642813549 & -((t >> 1) & 1)) ^
                (513874426 & -((t >> 2) & 1)) ^
                (1027748829 & -((t >> 3) & 1)) ^
                (705979059 & -((t >> 4) & 1))
              );
            }
            function i(e) {
              let t = 1;
              for (let r = 0; r < e.length; ++r) {
                const n = e.charCodeAt(r);
                if (n < 33 || n > 126) return "Invalid prefix (" + e + ")";
                t = s(t) ^ (n >> 5);
              }
              t = s(t);
              for (let r = 0; r < e.length; ++r) {
                const n = e.charCodeAt(r);
                t = s(t) ^ (31 & n);
              }
              return t;
            }
            function o(e, t, r, n) {
              let s = 0,
                i = 0;
              const o = (1 << r) - 1,
                a = [];
              for (let n = 0; n < e.length; ++n)
                for (s = (s << t) | e[n], i += t; i >= r; )
                  (i -= r), a.push((s >> i) & o);
              if (n) i > 0 && a.push((s << (r - i)) & o);
              else {
                if (i >= t) return "Excess padding";
                if ((s << (r - i)) & o) return "Non-zero padding";
              }
              return a;
            }
            function a(e) {
              return o(e, 8, 5, !0);
            }
            function c(e) {
              const t = o(e, 5, 8, !1);
              if (Array.isArray(t)) return t;
            }
            function u(e) {
              const t = o(e, 5, 8, !1);
              if (Array.isArray(t)) return t;
              throw new Error(t);
            }
            function f(e) {
              let t;
              function o(e, r) {
                if (((r = r || 90), e.length < 8)) return e + " too short";
                if (e.length > r) return "Exceeds length limit";
                const o = e.toLowerCase(),
                  a = e.toUpperCase();
                if (e !== o && e !== a) return "Mixed-case string " + e;
                const c = (e = o).lastIndexOf("1");
                if (-1 === c) return "No separator character for " + e;
                if (0 === c) return "Missing prefix for " + e;
                const u = e.slice(0, c),
                  f = e.slice(c + 1);
                if (f.length < 6) return "Data too short";
                let d = i(u);
                if ("string" == typeof d) return d;
                const l = [];
                for (let e = 0; e < f.length; ++e) {
                  const t = f.charAt(e),
                    r = n[t];
                  if (void 0 === r) return "Unknown character " + t;
                  (d = s(d) ^ r), e + 6 >= f.length || l.push(r);
                }
                return d !== t
                  ? "Invalid checksum for " + e
                  : { prefix: u, words: l };
              }
              return (
                (t = "bech32" === e ? 1 : 734539939),
                {
                  decodeUnsafe: function (e, t) {
                    const r = o(e, t);
                    if ("object" == typeof r) return r;
                  },
                  decode: function (e, t) {
                    const r = o(e, t);
                    if ("object" == typeof r) return r;
                    throw new Error(r);
                  },
                  encode: function (e, n, o) {
                    if (((o = o || 90), e.length + 7 + n.length > o))
                      throw new TypeError("Exceeds length limit");
                    let a = i((e = e.toLowerCase()));
                    if ("string" == typeof a) throw new Error(a);
                    let c = e + "1";
                    for (let e = 0; e < n.length; ++e) {
                      const t = n[e];
                      if (t >> 5) throw new Error("Non 5-bit word");
                      (a = s(a) ^ t), (c += r.charAt(t));
                    }
                    for (let e = 0; e < 6; ++e) a = s(a);
                    a ^= t;
                    for (let e = 0; e < 6; ++e)
                      c += r.charAt((a >> (5 * (5 - e))) & 31);
                    return c;
                  },
                  toWords: a,
                  fromWordsUnsafe: c,
                  fromWords: u,
                }
              );
            }
            (t.bech32 = f("bech32")), (t.bech32m = f("bech32m"));
          }),
          rr((nr = { exports: {} }), nr.exports),
          nr.exports);
      (sr = or) &&
        sr.__esModule &&
        Object.prototype.hasOwnProperty.call(sr, "default") &&
        sr.default;
      var ar = or.bech32m,
        cr = or.bech32;
      const ur = [
        1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
        -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
        1925078388, -2132889090, -1680079193, -1046744716, -459576895,
        -272742522, 264347078, 604807628, 770255983, 1249150122, 1555081692,
        1996064986, -1740746414, -1473132947, -1341970488, -1084653625,
        -958395405, -710438585, 113926993, 338241895, 666307205, 773529912,
        1294757372, 1396182291, 1695183700, 1986661051, -2117940946,
        -1838011259, -1564481375, -1474664885, -1035236496, -949202525,
        -778901479, -694614492, -200395387, 275423344, 430227734, 506948616,
        659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
        1955562222, 2024104815, -2067236844, -1933114872, -1866530822,
        -1538233109, -1090935817, -965641998,
      ];
      class fr {
        constructor() {
          (this.A = 1779033703),
            (this.B = -1150833019),
            (this.C = 1013904242),
            (this.D = -1521486534),
            (this.E = 1359893119),
            (this.F = -1694144372),
            (this.G = 528734635),
            (this.H = 1541459225),
            (this._size = 0),
            (this._sp = 0),
            (!lr || hr >= 8e3) && ((lr = new ArrayBuffer(8e3)), (hr = 0)),
            (this._byte = new Uint8Array(lr, hr, 80)),
            (this._word = new Int32Array(lr, hr, 20)),
            (hr += 80);
        }
        update(e) {
          if ("string" == typeof e) return this._utf8(e);
          if (null == e) throw new TypeError("Invalid type: " + typeof e);
          const t = e.byteOffset,
            r = e.byteLength;
          let n = (r / 64) | 0,
            s = 0;
          if (n && !(3 & t) && !(this._size % 64)) {
            const r = new Int32Array(e.buffer, t, 16 * n);
            for (; n--; ) this._int32(r, s >> 2), (s += 64);
            this._size += s;
          }
          if (1 !== e.BYTES_PER_ELEMENT && e.buffer) {
            const n = new Uint8Array(e.buffer, t + s, r - s);
            return this._uint8(n);
          }
          return s === r ? this : this._uint8(e, s);
        }
        _uint8(e, t) {
          const { _byte: r, _word: n } = this,
            s = e.length;
          for (t |= 0; t < s; ) {
            const i = this._size % 64;
            let o = i;
            for (; t < s && o < 64; ) r[o++] = e[t++];
            o >= 64 && this._int32(n), (this._size += o - i);
          }
          return this;
        }
        _utf8(e) {
          const { _byte: t, _word: r } = this,
            n = e.length;
          let s = this._sp;
          for (let i = 0; i < n; ) {
            const o = this._size % 64;
            let a = o;
            for (; i < n && a < 64; ) {
              let r = 0 | e.charCodeAt(i++);
              r < 128
                ? (t[a++] = r)
                : r < 2048
                  ? ((t[a++] = 192 | (r >>> 6)), (t[a++] = 128 | (63 & r)))
                  : r < 55296 || r > 57343
                    ? ((t[a++] = 224 | (r >>> 12)),
                      (t[a++] = 128 | ((r >>> 6) & 63)),
                      (t[a++] = 128 | (63 & r)))
                    : s
                      ? ((r = ((1023 & s) << 10) + (1023 & r) + 65536),
                        (t[a++] = 240 | (r >>> 18)),
                        (t[a++] = 128 | ((r >>> 12) & 63)),
                        (t[a++] = 128 | ((r >>> 6) & 63)),
                        (t[a++] = 128 | (63 & r)),
                        (s = 0))
                      : (s = r);
            }
            a >= 64 && (this._int32(r), (r[0] = r[16])), (this._size += a - o);
          }
          return (this._sp = s), this;
        }
        _int32(e, t) {
          let { A: r, B: n, C: s, D: i, E: o, F: a, G: c, H: u } = this,
            f = 0;
          for (t |= 0; f < 16; ) dr[f++] = yr(e[t++]);
          for (f = 16; f < 64; f++)
            dr[f] =
              (vr(dr[f - 2]) + dr[f - 7] + Er(dr[f - 15]) + dr[f - 16]) | 0;
          for (f = 0; f < 64; f++) {
            const e = (u + br(o) + gr(o, a, c) + ur[f] + dr[f]) | 0,
              t = (mr(r) + wr(r, n, s)) | 0;
            (u = c),
              (c = a),
              (a = o),
              (o = (i + e) | 0),
              (i = s),
              (s = n),
              (n = r),
              (r = (e + t) | 0);
          }
          (this.A = (r + this.A) | 0),
            (this.B = (n + this.B) | 0),
            (this.C = (s + this.C) | 0),
            (this.D = (i + this.D) | 0),
            (this.E = (o + this.E) | 0),
            (this.F = (a + this.F) | 0),
            (this.G = (c + this.G) | 0),
            (this.H = (u + this.H) | 0);
        }
        digest(e) {
          const { _byte: t, _word: r } = this;
          let n = this._size % 64 | 0;
          for (t[n++] = 128; 3 & n; ) t[n++] = 0;
          if (((n >>= 2), n > 14)) {
            for (; n < 16; ) r[n++] = 0;
            (n = 0), this._int32(r);
          }
          for (; n < 16; ) r[n++] = 0;
          const s = 8 * this._size,
            i = (4294967295 & s) >>> 0,
            o = (s - i) / 4294967296;
          return (
            o && (r[14] = yr(o)),
            i && (r[15] = yr(i)),
            this._int32(r),
            "hex" === e ? this._hex() : this._bin()
          );
        }
        _hex() {
          const { A: e, B: t, C: r, D: n, E: s, F: i, G: o, H: a } = this;
          return pr(e) + pr(t) + pr(r) + pr(n) + pr(s) + pr(i) + pr(o) + pr(a);
        }
        _bin() {
          const {
            A: e,
            B: t,
            C: r,
            D: n,
            E: s,
            F: i,
            G: o,
            H: a,
            _byte: c,
            _word: u,
          } = this;
          return (
            (u[0] = yr(e)),
            (u[1] = yr(t)),
            (u[2] = yr(r)),
            (u[3] = yr(n)),
            (u[4] = yr(s)),
            (u[5] = yr(i)),
            (u[6] = yr(o)),
            (u[7] = yr(a)),
            c.slice(0, 32)
          );
        }
      }
      const dr = new Int32Array(64);
      let lr,
        hr = 0;
      const pr = (e) => (e + 4294967296).toString(16).substr(-8),
        yr =
          254 === new Uint8Array(new Uint16Array([65279]).buffer)[0]
            ? (e) => e
            : (e) =>
                ((e << 24) & 4278190080) |
                ((e << 8) & 16711680) |
                ((e >> 8) & 65280) |
                ((e >> 24) & 255),
        gr = (e, t, r) => r ^ (e & (t ^ r)),
        wr = (e, t, r) => (e & t) | (r & (e | t)),
        mr = (e) =>
          ((e >>> 2) | (e << 30)) ^
          ((e >>> 13) | (e << 19)) ^
          ((e >>> 22) | (e << 10)),
        br = (e) =>
          ((e >>> 6) | (e << 26)) ^
          ((e >>> 11) | (e << 21)) ^
          ((e >>> 25) | (e << 7)),
        Er = (e) =>
          ((e >>> 7) | (e << 25)) ^ ((e >>> 18) | (e << 14)) ^ (e >>> 3),
        vr = (e) =>
          ((e >>> 17) | (e << 15)) ^ ((e >>> 19) | (e << 13)) ^ (e >>> 10);
      var Mr,
        Ar,
        Ir = function (e) {
          return new fr().update(e).digest();
        };
      !(function (e) {
        (e.mainnet = "mainnet"),
          (e.testnet = "testnet"),
          (e.regtest = "regtest");
      })(Mr || (Mr = {})),
        (function (e) {
          (e.p2pkh = "p2pkh"),
            (e.p2sh = "p2sh"),
            (e.p2wpkh = "p2wpkh"),
            (e.p2wsh = "p2wsh"),
            (e.p2tr = "p2tr");
        })(Ar || (Ar = {}));
      var Nr,
        Tr = {
          0: { type: Ar.p2pkh, network: Mr.mainnet },
          111: { type: Ar.p2pkh, network: Mr.testnet },
          5: { type: Ar.p2sh, network: Mr.mainnet },
          196: { type: Ar.p2sh, network: Mr.testnet },
        },
        xr = function (e) {
          var t,
            r = e.substr(0, 2).toLowerCase();
          if ("bc" === r || "tb" === r)
            return (function (e) {
              var t;
              try {
                t =
                  e.startsWith("bc1p") ||
                  e.startsWith("tb1p") ||
                  e.startsWith("bcrt1p")
                    ? ar.decode(e)
                    : cr.decode(e);
              } catch (e) {
                throw new Error("Invalid address");
              }
              var r = { bc: Mr.mainnet, tb: Mr.testnet, bcrt: Mr.regtest }[
                t.prefix
              ];
              if (void 0 === r) throw new Error("Invalid address");
              var n = t.words[0];
              if (n < 0 || n > 16) throw new Error("Invalid address");
              return {
                bech32: !0,
                network: r,
                address: e,
                type:
                  20 === cr.fromWords(t.words.slice(1)).length
                    ? Ar.p2wpkh
                    : 1 === n
                      ? Ar.p2tr
                      : Ar.p2wsh,
              };
            })(e);
          try {
            t = ir(e);
          } catch (e) {
            throw new Error("Invalid address");
          }
          var n = t.length;
          if (25 !== n) throw new Error("Invalid address");
          var s = t[0],
            i = t.slice(n - 4, n),
            o = t.slice(0, n - 4),
            a = Ir(Ir(o)).slice(0, 4);
          if (
            i.some(function (e, t) {
              return e !== a[t];
            })
          )
            throw new Error("Invalid address");
          if (!Object.keys(Tr).map(Number).includes(s))
            throw new Error("Invalid address");
          return Xt(Xt({}, Tr[s]), { address: e, bech32: !1 });
        },
        jr = r(48287),
        Sr = ((e) => (
          (e.Mainnet = "Mainnet"),
          (e.Testnet = "Testnet"),
          (e.Testnet4 = "Testnet4"),
          (e.Signet = "Signet"),
          (e.Regtest = "Regtest"),
          e
        ))(Sr || {}),
        Or = E(I([M(), m(), g()])),
        Rr = b({
          jsonrpc: p("2.0"),
          method: M(),
          params: E(
            I([
              d(N()),
              (function e(t, r) {
                return {
                  kind: "schema",
                  type: "loose_object",
                  reference: e,
                  expects: "Object",
                  async: !1,
                  entries: t,
                  message: r,
                  _run(e, t) {
                    const r = e.value;
                    if (r && "object" == typeof r) {
                      (e.typed = !0), (e.value = {});
                      for (const n in this.entries) {
                        const s = r[n],
                          i = this.entries[n]._run({ typed: !1, value: s }, t);
                        if (i.issues) {
                          const o = {
                            type: "object",
                            origin: "value",
                            input: r,
                            key: n,
                            value: s,
                          };
                          for (const t of i.issues)
                            t.path ? t.path.unshift(o) : (t.path = [o]),
                              e.issues?.push(t);
                          if (
                            (e.issues || (e.issues = i.issues), t.abortEarly)
                          ) {
                            e.typed = !1;
                            break;
                          }
                        }
                        i.typed || (e.typed = !1),
                          (void 0 !== i.value || n in r) &&
                            (e.value[n] = i.value);
                      }
                      if (!e.issues || !t.abortEarly)
                        for (const t in r)
                          a(r, t) &&
                            !(t in this.entries) &&
                            (e.value[t] = r[t]);
                    } else o(this, "type", e, t);
                    return e;
                  },
                };
              })({}),
              g(),
            ]),
          ),
          id: ((Nr = Or), Nr.wrapped),
        }),
        Dr = b({ jsonrpc: p("2.0"), result: y(N()), id: Or }),
        Lr = b({ jsonrpc: p("2.0"), error: y(N()), id: Or }),
        kr = I([Dr, Lr]),
        Cr = T("type", [
          b({ type: p("accountChange") }),
          b({
            type: p("networkChange"),
            bitcoin: b({ name: h(Sr) }),
            stacks: b({ name: M() }),
          }),
          b({ type: p("disconnect") }),
        ]);
      function Br(e) {
        return e?.split(".").reduce((e, t) => e?.[t], window);
      }
      var zr = b({
          contract: M(),
          functionName: M(),
          arguments: E(d(M())),
          functionArgs: E(d(M())),
          postConditions: E(d(M())),
          postConditionMode: E(I([p("allow"), p("deny")])),
        }),
        Ur =
          (b({ txid: M(), transaction: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("stx_callContract"), params: zr, id: M() })
              .entries,
          }),
          b({
            name: M(),
            clarityCode: M(),
            clarityVersion: E(M()),
            postConditions: E(d(M())),
            postConditionMode: E(I([p("allow"), p("deny")])),
          })),
        _r =
          (b({ txid: M(), transaction: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("stx_deployContract"), params: Ur, id: M() })
              .entries,
          }),
          v(["software", "ledger", "keystone"])),
        Pr = ((e) => (
          (e.Ordinals = "ordinals"),
          (e.Payment = "payment"),
          (e.Stacks = "stacks"),
          e
        ))(Pr || {}),
        Fr = ((e) => (
          (e.p2pkh = "p2pkh"),
          (e.p2sh = "p2sh"),
          (e.p2wpkh = "p2wpkh"),
          (e.p2wsh = "p2wsh"),
          (e.p2tr = "p2tr"),
          (e.stacks = "stacks"),
          e
        ))(Fr || {}),
        qr = b({
          address: M(),
          publicKey: M(),
          purpose: h(Pr),
          addressType: h(Fr),
          walletType: _r,
        }),
        Hr = b({ read: E(l()) }),
        Yr = b({ readNetwork: E(l()) }),
        Qr = b({
          type: p("account"),
          resourceId: M(),
          clientId: M(),
          actions: Hr,
        }),
        Gr = b({
          type: p("wallet"),
          resourceId: M(),
          clientId: M(),
          actions: Yr,
        }),
        Wr = T("type", [
          b({ ...x(Qr, ["clientId"]).entries }),
          b({ ...x(Gr, ["clientId"]).entries }),
        ]),
        Zr = T("type", [Qr, Gr]),
        $r = w(d(Wr)),
        Jr =
          (p(!0),
          b({
            ...Rr.entries,
            ...b({
              method: p("wallet_requestPermissions"),
              params: $r,
              id: M(),
            }).entries,
          }),
          w(g())),
        Vr =
          (w(g()),
          b({
            ...Rr.entries,
            ...b({
              method: p("wallet_renouncePermissions"),
              params: Jr,
              id: M(),
            }).entries,
          }),
          w(g())),
        Kr =
          (w(g()),
          b({
            ...Rr.entries,
            ...b({ method: p("wallet_disconnect"), params: Vr, id: M() })
              .entries,
          }),
          w(g())),
        Xr =
          (b({
            ...Rr.entries,
            ...b({ method: p("wallet_getWalletType"), params: Kr, id: M() })
              .entries,
          }),
          w(g())),
        en =
          (d(Zr),
          b({
            ...Rr.entries,
            ...b({
              method: p("wallet_getCurrentPermissions"),
              params: Xr,
              id: M(),
            }).entries,
          }),
          w(g())),
        tn = b({ bitcoin: b({ name: h(Sr) }), stacks: b({ name: M() }) }),
        rn =
          (b({
            ...Rr.entries,
            ...b({ method: p("wallet_getNetwork"), params: en, id: M() })
              .entries,
          }),
          b({ name: h(Sr) })),
        nn =
          (w(g()),
          b({
            ...Rr.entries,
            ...b({ method: p("wallet_changeNetwork"), params: rn, id: M() })
              .entries,
          }),
          w(g())),
        sn =
          (b({ id: M(), addresses: d(qr), walletType: _r, network: tn }),
          b({
            ...Rr.entries,
            ...b({ method: p("wallet_getAccount"), params: nn, id: M() })
              .entries,
          }),
          w(
            b({
              permissions: E(d(Wr)),
              addresses: E(d(h(Pr))),
              message: E(
                j(
                  M(),
                  (function e(t, r) {
                    return {
                      kind: "validation",
                      type: "max_length",
                      reference: e,
                      async: !1,
                      expects: `<=${t}`,
                      requirement: t,
                      message: r,
                      _run(e, t) {
                        return (
                          e.typed &&
                            e.value.length > this.requirement &&
                            o(this, "length", e, t, {
                              received: `${e.value.length}`,
                            }),
                          e
                        );
                      },
                    };
                  })(80, "The message must not exceed 80 characters."),
                ),
              ),
            }),
          )),
        on =
          (b({ id: M(), addresses: d(qr), walletType: _r, network: tn }),
          b({
            ...Rr.entries,
            ...b({ method: p("wallet_connect"), params: sn, id: M() }).entries,
          }),
          w(g())),
        an =
          (b({
            addresses: d(
              b({
                address: M(),
                publicKey: M(),
                gaiaHubUrl: M(),
                gaiaAppKey: M(),
              }),
            ),
            network: tn,
          }),
          b({
            ...Rr.entries,
            ...b({ method: p("stx_getAccounts"), params: on, id: M() }).entries,
          }),
          w(b({ message: E(M()) }))),
        cn =
          (b({ addresses: d(qr), network: tn }),
          b({
            ...Rr.entries,
            ...b({ method: p("stx_getAddresses"), params: an, id: M() })
              .entries,
          }),
          b({ message: M(), publicKey: M(), parameterFormatVersion: E(m()) })),
        un =
          (b({ signature: M(), publicKey: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("stx_signMessage"), params: cn, id: M() }).entries,
          }),
          b({
            domain: M(),
            message: M(),
            parameterFormatVersion: E(m()),
            publicKey: E(M()),
          })),
        fn =
          (b({ signature: M(), publicKey: M() }),
          b({
            ...Rr.entries,
            ...b({
              method: p("stx_signStructuredMessage"),
              params: un,
              id: M(),
            }).entries,
          }),
          b({ transaction: M(), pubkey: E(M()), broadcast: E(l()) })),
        dn =
          (b({ transaction: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("stx_signTransaction"), params: fn, id: M() })
              .entries,
          }),
          b({
            transactions: j(
              d(
                j(
                  M(),
                  (function e(t, r) {
                    return {
                      kind: "validation",
                      type: "check",
                      reference: e,
                      async: !1,
                      expects: null,
                      requirement: t,
                      message: r,
                      _run(e, t) {
                        return (
                          e.typed &&
                            !this.requirement(e.value) &&
                            o(this, "input", e, t),
                          e
                        );
                      },
                    };
                  })((e) => !0, "Invalid hex-encoded Stacks transaction."),
                ),
              ),
              (function e(t, r) {
                return {
                  kind: "validation",
                  type: "min_length",
                  reference: e,
                  async: !1,
                  expects: `>=${t}`,
                  requirement: t,
                  message: r,
                  _run(e, t) {
                    return (
                      e.typed &&
                        e.value.length < this.requirement &&
                        o(this, "length", e, t, {
                          received: `${e.value.length}`,
                        }),
                      e
                    );
                  },
                };
              })(1),
            ),
            broadcast: E(l()),
          })),
        ln =
          (b({ transactions: d(M()) }),
          b({
            ...Rr.entries,
            ...b({ method: p("stx_signTransactions"), params: dn, id: M() })
              .entries,
          }),
          b({
            amount: I([m(), M()]),
            recipient: M(),
            memo: E(M()),
            version: E(M()),
            postConditionMode: E(m()),
            postConditions: E(d(M())),
            pubkey: E(M()),
          })),
        hn =
          (b({ txid: M(), transaction: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("stx_transferStx"), params: ln, id: M() }).entries,
          }),
          w(g())),
        pn =
          (b({ version: M(), methods: E(d(M())), supports: d(M()) }),
          b({
            ...Rr.entries,
            ...b({ method: p("getInfo"), params: hn, id: M() }).entries,
          }),
          b({ purposes: d(h(Pr)), message: E(M()) })),
        yn =
          (b({ addresses: d(qr), network: tn }),
          b({
            ...Rr.entries,
            ...b({ method: p("getAddresses"), params: pn, id: M() }).entries,
          }),
          ((e) => ((e.ECDSA = "ECDSA"), (e.BIP322 = "BIP322"), e))(yn || {})),
        gn = b({ address: M(), message: M(), protocol: E(h(yn)) }),
        wn =
          (b({
            signature: M(),
            messageHash: M(),
            address: M(),
            protocol: h(yn),
          }),
          b({
            ...Rr.entries,
            ...b({ method: p("signMessage"), params: gn, id: M() }).entries,
          }),
          b({ recipients: d(b({ address: M(), amount: m() })) })),
        mn =
          (b({ txid: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("sendTransfer"), params: wn, id: M() }).entries,
          }),
          b({
            psbt: M(),
            signInputs: (function e(t, r, n) {
              return {
                kind: "schema",
                type: "record",
                reference: e,
                expects: "Object",
                async: !1,
                key: t,
                value: r,
                message: n,
                _run(e, t) {
                  const r = e.value;
                  if (r && "object" == typeof r) {
                    (e.typed = !0), (e.value = {});
                    for (const n in r)
                      if (a(r, n)) {
                        const s = r[n],
                          i = this.key._run({ typed: !1, value: n }, t);
                        if (i.issues) {
                          const o = {
                            type: "object",
                            origin: "key",
                            input: r,
                            key: n,
                            value: s,
                          };
                          for (const t of i.issues)
                            (t.path = [o]), e.issues?.push(t);
                          if (
                            (e.issues || (e.issues = i.issues), t.abortEarly)
                          ) {
                            e.typed = !1;
                            break;
                          }
                        }
                        const o = this.value._run({ typed: !1, value: s }, t);
                        if (o.issues) {
                          const i = {
                            type: "object",
                            origin: "value",
                            input: r,
                            key: n,
                            value: s,
                          };
                          for (const t of o.issues)
                            t.path ? t.path.unshift(i) : (t.path = [i]),
                              e.issues?.push(t);
                          if (
                            (e.issues || (e.issues = o.issues), t.abortEarly)
                          ) {
                            e.typed = !1;
                            break;
                          }
                        }
                        (i.typed && o.typed) || (e.typed = !1),
                          i.typed && (e.value[i.value] = o.value);
                      }
                  } else o(this, "type", e, t);
                  return e;
                },
              };
            })(M(), d(m())),
            broadcast: E(l()),
          })),
        bn =
          (b({ psbt: M(), txid: E(M()) }),
          b({
            ...Rr.entries,
            ...b({ method: p("signPsbt"), params: mn, id: M() }).entries,
          }),
          b({ purposes: d(h(Pr)), message: E(M()) })),
        En =
          (d(b({ ...qr.entries, ...b({ walletType: _r }).entries })),
          b({
            ...Rr.entries,
            ...b({ method: p("getAccounts"), params: bn, id: M() }).entries,
          }),
          w(g()),
          b({ confirmed: M(), unconfirmed: M(), total: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("getBalance"), id: M() }).entries,
          }),
          b({
            amount: M(),
            cap: M(),
            heightStart: E(M()),
            heightEnd: E(M()),
            offsetStart: E(M()),
            offsetEnd: E(M()),
          })),
        vn = b({ contentType: M(), contentBase64: M() }),
        Mn = b({
          runeName: M(),
          divisibility: E(m()),
          symbol: E(M()),
          premine: E(M()),
          isMintable: l(),
          delegateInscriptionId: E(M()),
          destinationAddress: M(),
          refundAddress: M(),
          feeRate: m(),
          appServiceFee: E(m()),
          appServiceFeeAddress: E(M()),
          terms: E(En),
          inscriptionDetails: E(vn),
          network: E(h(Sr)),
        }),
        An =
          (b({ orderId: M(), fundTransactionId: M(), fundingAddress: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("runes_etch"), params: Mn, id: M() }).entries,
          }),
          w(g())),
        In =
          (b({
            balances: d(
              b({
                runeName: M(),
                amount: M(),
                divisibility: m(),
                symbol: M(),
                inscriptionId: w(M()),
                spendableBalance: M(),
              }),
            ),
          }),
          b({
            ...Rr.entries,
            ...b({ method: p("runes_getBalance"), params: An, id: M() })
              .entries,
          }),
          b({
            appServiceFee: E(m()),
            appServiceFeeAddress: E(M()),
            destinationAddress: M(),
            feeRate: m(),
            refundAddress: M(),
            repeats: m(),
            runeName: M(),
            network: E(h(Sr)),
          })),
        Nn =
          (b({ orderId: M(), fundTransactionId: M(), fundingAddress: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("runes_mint"), params: In, id: M() }).entries,
          }),
          b({
            recipients: d(b({ runeName: M(), amount: M(), address: M() })),
          })),
        Tn =
          (b({ txid: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("runes_transfer"), params: Nn, id: M() }).entries,
          }),
          b({ offset: m(), limit: m() })),
        xn =
          (b({
            total: m(),
            limit: m(),
            offset: m(),
            inscriptions: d(
              b({
                inscriptionId: M(),
                inscriptionNumber: M(),
                address: M(),
                collectionName: E(M()),
                postage: M(),
                contentLength: M(),
                contentType: M(),
                timestamp: m(),
                offset: m(),
                genesisTransaction: M(),
                output: M(),
              }),
            ),
          }),
          b({
            ...Rr.entries,
            ...b({ method: p("ord_getInscriptions"), params: Tn, id: M() })
              .entries,
          }),
          b({ transfers: d(b({ address: M(), inscriptionId: M() })) })),
        jn =
          (b({ txid: M() }),
          b({
            ...Rr.entries,
            ...b({ method: p("ord_sendInscriptions"), params: xn, id: M() })
              .entries,
          }),
          async (e, t, r) => {
            let n =
              window.XverseProviders?.BitcoinProvider || window.BitcoinProvider;
            if ((r && (n = await Br(r)), !n))
              throw new Error("no wallet provider was found");
            if (!e) throw new Error("A wallet method is required");
            const s = await n.request(e, t);
            return f(Lr, s)
              ? { status: "error", error: s.error }
              : f(Dr, s)
                ? { status: "success", result: s.result }
                : {
                    status: "error",
                    error: {
                      code: -32603,
                      message: "Received unknown response from provider.",
                      data: s,
                    },
                  };
          }),
        Sn = {
          Mainnet: "",
          Testnet: "-testnet",
          Testnet4: "-testnet4",
          Signet: "-signet",
        },
        On = (e = "Mainnet") => {
          if ("Regtest" === e)
            throw new Error(`Ordinals API does not support ${e} network`);
          return `https://ordinals${Sn[e]}.xverse.app/v1`;
        },
        Rn = class {
          client;
          constructor(e) {
            this.client = Kt.create({ baseURL: On(e) });
          }
          parseError = (e) => ({
            code: e.response?.status,
            message: JSON.stringify(e.response?.data),
          });
          estimateMintCost = async (e) => {
            try {
              return {
                data: (await this.client.post("/runes/mint/estimate", { ...e }))
                  .data,
              };
            } catch (e) {
              const t = e;
              return { error: this.parseError(t) };
            }
          };
          estimateEtchCost = async (e) => {
            try {
              return {
                data: (await this.client.post("/runes/etch/estimate", { ...e }))
                  .data,
              };
            } catch (e) {
              const t = e;
              return { error: this.parseError(t) };
            }
          };
          createMintOrder = async (e) => {
            try {
              return {
                data: (await this.client.post("/runes/mint/orders", { ...e }))
                  .data,
              };
            } catch (e) {
              const t = e;
              return { error: this.parseError(t) };
            }
          };
          createEtchOrder = async (e) => {
            try {
              return {
                data: (await this.client.post("/runes/etch/orders", { ...e }))
                  .data,
              };
            } catch (e) {
              const t = e;
              return { error: this.parseError(t) };
            }
          };
          executeMint = async (e, t) => {
            try {
              return {
                data: (
                  await this.client.post(`/runes/mint/orders/${e}/execute`, {
                    fundTransactionId: t,
                  })
                ).data,
              };
            } catch (e) {
              const t = e;
              return { error: this.parseError(t) };
            }
          };
          executeEtch = async (e, t) => {
            try {
              return {
                data: (
                  await this.client.post(`/runes/etch/orders/${e}/execute`, {
                    fundTransactionId: t,
                  })
                ).data,
              };
            } catch (e) {
              const t = e;
              return { error: this.parseError(t) };
            }
          };
          getOrder = async (e) => {
            try {
              return { data: (await this.client.get(`/orders/${e}`)).data };
            } catch (e) {
              const t = e;
              return { error: this.parseError(t) };
            }
          };
          rbfOrder = async (e) => {
            const { orderId: t, newFeeRate: r } = e;
            try {
              return {
                data: (
                  await this.client.post(`/orders/${t}/rbf-estimate`, {
                    newFeeRate: r,
                  })
                ).data,
              };
            } catch (e) {
              const t = e;
              return { error: this.parseError(t) };
            }
          };
        },
        Dn = {},
        Ln = (e = "Mainnet") => (Dn[e] || (Dn[e] = new Rn(e)), Dn[e]),
        kn = class {
          async mintRunes(e) {
            try {
              const t = await this.requestInternal("getInfo", null).catch(
                () => null,
              );
              if (t && "success" === t.status) {
                const r = t.result.methods?.includes("runes_mint");
                if (r) {
                  const t = await this.requestInternal("runes_mint", e);
                  if (t) {
                    if ("success" === t.status) return t;
                    if ("error" === t.status && -32601 !== t.error.code)
                      return t;
                  }
                }
              }
              const r = {
                  destinationAddress: e.destinationAddress,
                  feeRate: e.feeRate,
                  refundAddress: e.refundAddress,
                  repeats: e.repeats,
                  runeName: e.runeName,
                  appServiceFee: e.appServiceFee,
                  appServiceFeeAddress: e.appServiceFeeAddress,
                },
                n = await new Rn(e.network).createMintOrder(r);
              if (!n.data)
                return {
                  status: "error",
                  error: {
                    code: 400 === n.error.code ? -32600 : -32603,
                    message: n.error.message,
                  },
                };
              const s = await this.requestInternal("sendTransfer", {
                recipients: [
                  { address: n.data.fundAddress, amount: n.data.fundAmount },
                ],
              });
              return "success" !== s.status
                ? s
                : (await new Rn(e.network).executeMint(
                    n.data.orderId,
                    s.result.txid,
                  ),
                  {
                    status: "success",
                    result: {
                      orderId: n.data.orderId,
                      fundTransactionId: s.result.txid,
                      fundingAddress: n.data.fundAddress,
                    },
                  });
            } catch (e) {
              return {
                status: "error",
                error: { code: -32603, message: e.message },
              };
            }
          }
          async etchRunes(e) {
            const t = {
              destinationAddress: e.destinationAddress,
              refundAddress: e.refundAddress,
              feeRate: e.feeRate,
              runeName: e.runeName,
              divisibility: e.divisibility,
              symbol: e.symbol,
              premine: e.premine,
              isMintable: e.isMintable,
              terms: e.terms,
              inscriptionDetails: e.inscriptionDetails,
              delegateInscriptionId: e.delegateInscriptionId,
              appServiceFee: e.appServiceFee,
              appServiceFeeAddress: e.appServiceFeeAddress,
            };
            try {
              const r = await this.requestInternal("getInfo", null).catch(
                () => null,
              );
              if (r && "success" === r.status) {
                const t = r.result.methods?.includes("runes_etch");
                if (t) {
                  const t = await this.requestInternal("runes_etch", e);
                  if (t) {
                    if ("success" === t.status) return t;
                    if ("error" === t.status && -32601 !== t.error.code)
                      return t;
                  }
                }
              }
              const n = await new Rn(e.network).createEtchOrder(t);
              if (!n.data)
                return {
                  status: "error",
                  error: {
                    code: 400 === n.error.code ? -32600 : -32603,
                    message: n.error.message,
                  },
                };
              const s = await this.requestInternal("sendTransfer", {
                recipients: [
                  { address: n.data.fundAddress, amount: n.data.fundAmount },
                ],
              });
              return "success" !== s.status
                ? s
                : (await new Rn(e.network).executeEtch(
                    n.data.orderId,
                    s.result.txid,
                  ),
                  {
                    status: "success",
                    result: {
                      orderId: n.data.orderId,
                      fundTransactionId: s.result.txid,
                      fundingAddress: n.data.fundAddress,
                    },
                  });
            } catch (e) {
              return {
                status: "error",
                error: { code: -32603, message: e.message },
              };
            }
          }
          async estimateMint(e) {
            const t = {
                destinationAddress: e.destinationAddress,
                feeRate: e.feeRate,
                repeats: e.repeats,
                runeName: e.runeName,
                appServiceFee: e.appServiceFee,
                appServiceFeeAddress: e.appServiceFeeAddress,
              },
              r = await Ln(e.network).estimateMintCost(t);
            return r.data
              ? { status: "success", result: r.data }
              : {
                  status: "error",
                  error: {
                    code: 400 === r.error.code ? -32600 : -32603,
                    message: r.error.message,
                  },
                };
          }
          async estimateEtch(e) {
            const t = {
                destinationAddress: e.destinationAddress,
                feeRate: e.feeRate,
                runeName: e.runeName,
                divisibility: e.divisibility,
                symbol: e.symbol,
                premine: e.premine,
                isMintable: e.isMintable,
                terms: e.terms,
                inscriptionDetails: e.inscriptionDetails,
                delegateInscriptionId: e.delegateInscriptionId,
                appServiceFee: e.appServiceFee,
                appServiceFeeAddress: e.appServiceFeeAddress,
              },
              r = await Ln(e.network).estimateEtchCost(t);
            return r.data
              ? { status: "success", result: r.data }
              : {
                  status: "error",
                  error: {
                    code: 400 === r.error.code ? -32600 : -32603,
                    message: r.error.message,
                  },
                };
          }
          async getOrder(e) {
            const t = await Ln(e.network).getOrder(e.id);
            return t.data
              ? { status: "success", result: t.data }
              : {
                  status: "error",
                  error: {
                    code:
                      400 === t.error.code || 404 === t.error.code
                        ? -32600
                        : -32603,
                    message: t.error.message,
                  },
                };
          }
          async estimateRbfOrder(e) {
            const t = { newFeeRate: e.newFeeRate, orderId: e.orderId },
              r = await Ln(e.network).rbfOrder(t);
            return r.data
              ? {
                  status: "success",
                  result: {
                    fundingAddress: r.data.fundingAddress,
                    rbfCost: r.data.rbfCost,
                  },
                }
              : {
                  status: "error",
                  error: {
                    code:
                      400 === r.error.code || 404 === r.error.code
                        ? -32600
                        : -32603,
                    message: r.error.message,
                  },
                };
          }
          async rbfOrder(e) {
            try {
              const t = { newFeeRate: e.newFeeRate, orderId: e.orderId },
                r = await Ln(e.network).rbfOrder(t);
              if (!r.data)
                return {
                  status: "error",
                  error: {
                    code:
                      400 === r.error.code || 404 === r.error.code
                        ? -32600
                        : -32603,
                    message: r.error.message,
                  },
                };
              const n = await this.requestInternal("sendTransfer", {
                recipients: [
                  { address: r.data.fundingAddress, amount: r.data.rbfCost },
                ],
              });
              return "success" !== n.status
                ? n
                : {
                    status: "success",
                    result: {
                      fundingAddress: r.data.fundingAddress,
                      orderId: t.orderId,
                      fundRBFTransactionId: n.result.txid,
                    },
                  };
            } catch (e) {
              return {
                status: "error",
                error: { code: -32603, message: e.message },
              };
            }
          }
          async request(e, t) {
            switch (e) {
              case "runes_mint":
                return this.mintRunes(t);
              case "runes_etch":
                return this.etchRunes(t);
              case "runes_estimateMint":
                return this.estimateMint(t);
              case "runes_estimateEtch":
                return this.estimateEtch(t);
              case "runes_getOrder":
                return this.getOrder(t);
              case "runes_estimateRbfOrder":
                return this.estimateRbfOrder(t);
              case "runes_rbfOrder":
                return this.rbfOrder(t);
              default:
                return this.requestInternal(e, t);
            }
          }
        };
      function Cn(e) {
        let t = [];
        for (let r in e) {
          let n = e[r];
          for (let e of n) t.push({ index: e, address: r });
        }
        return t;
      }
      var Bn = {
        fordefi: {
          id: "FordefiProviders.UtxoProvider",
          name: "Fordefi",
          webUrl: "https://www.fordefi.com/",
          chromeWebStoreUrl:
            "https://chromewebstore.google.com/detail/fordefi/hcmehenccjdmfbojapcbcofkgdpbnlle",
          icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEzNDk0XzY2MjU0KSI+CjxwYXRoIGQ9Ik0xMC44NzY5IDE1LjYzNzhIMS41VjE4LjM5OUMxLjUgMTkuODAxMyAyLjYzNDQ3IDIwLjkzOCA0LjAzMzkyIDIwLjkzOEg4LjI0OTkyTDEwLjg3NjkgMTUuNjM3OFoiIGZpbGw9IiM3OTk0RkYiLz4KPHBhdGggZD0iTTEuNSA5Ljc3NTUxSDE5LjA1MTZMMTcuMDEzOSAxMy44NzExSDEuNVY5Ljc3NTUxWiIgZmlsbD0iIzQ4NkRGRiIvPgo8cGF0aCBkPSJNNy42NTk5NiAzSDEuNTI0NDFWOC4wMDcwNEgyMi40NjEyVjNIMTYuMzI1NlY2LjczOTQ0SDE1LjA2MDZWM0g4LjkyNTAyVjYuNzM5NDRINy42NTk5NlYzWiIgZmlsbD0iIzVDRDFGQSIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzEzNDk0XzY2MjU0Ij4KPHJlY3Qgd2lkdGg9IjIxIiBoZWlnaHQ9IjE4IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS41IDMpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
        },
        xverse: {
          id: "XverseProviders.BitcoinProvider",
          name: "Xverse",
          webUrl: "https://www.xverse.app/",
          googlePlayStoreUrl:
            "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse",
          iOSAppStoreUrl:
            "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513",
          chromeWebStoreUrl:
            "https://chromewebstore.google.com/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg",
          icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyIiBoZWlnaHQ9IjEwMiIgdmlld0JveD0iMCAwIDEwMiAxMDIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJJY29uX0FydCAoRWRpdCBNZSkiPgo8cmVjdCB3aWR0aD0iMTAyIiBoZWlnaHQ9IjEwMiIgZmlsbD0iIzE4MTgxOCIvPgo8ZyBpZD0iTG9nby9FbWJsZW0iIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8yMF8xMjIzKSI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik03NC42NTQyIDczLjg4ODNWNjUuMjMxMkM3NC42NTQyIDY0Ljg4OCA3NC41MTc3IDY0LjU2MDYgNzQuMjc0NSA2NC4zMTc0TDM3LjQzOTcgMjcuNDgyNUMzNy4xOTY1IDI3LjIzOTIgMzYuODY5MSAyNy4xMDI4IDM2LjUyNTggMjcuMTAyOEgyNy44NjlDMjcuNDQxNiAyNy4xMDI4IDI3LjA5MzggMjcuNDUwNiAyNy4wOTM4IDI3Ljg3OFYzNS45MjExQzI3LjA5MzggMzYuMjY0NCAyNy4yMzAyIDM2LjU5MTcgMjcuNDczNCAzNi44MzVMNDAuNjk1MiA1MC4wNTY3QzQwLjk5NzUgNTAuMzU5MSA0MC45OTc1IDUwLjg1MDEgNDAuNjk1MiA1MS4xNTI0TDI3LjMyMTEgNjQuNTI2NUMyNy4xNzU2IDY0LjY3MiAyNy4wOTM4IDY0Ljg2OTggMjcuMDkzOCA2NS4wNzQ0VjczLjg4ODNDMjcuMDkzOCA3NC4zMTUzIDI3LjQ0MTYgNzQuNjYzNSAyNy44NjkgNzQuNjYzNUg0Mi4zMzQyQzQyLjc2MTYgNzQuNjYzNSA0My4xMDk0IDc0LjMxNTMgNDMuMTA5NCA3My44ODgzVjY4LjY5NThDNDMuMTA5NCA2OC40OTEyIDQzLjE5MTIgNjguMjkzNSA0My4zMzY4IDY4LjE0NzlMNTAuNTExNCA2MC45NzMzQzUwLjgxMzggNjAuNjcwOSA1MS4zMDQ4IDYwLjY3MDkgNTEuNjA3MiA2MC45NzMzTDY0LjkxOTggNzQuMjg2MUM2NS4xNjMxIDc0LjUyOTMgNjUuNDkwNCA3NC42NjU4IDY1LjgzMzcgNzQuNjY1OEg3My44NzY3Qzc0LjMwNDIgNzQuNjY1OCA3NC42NTE5IDc0LjMxNzYgNzQuNjUxOSA3My44OTA2TDc0LjY1NDIgNzMuODg4M1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGlkPSJWZWN0b3JfMiIgZD0iTTU1LjM1OCAzOC41NjcySDYyLjYwMzFDNjMuMDMyOCAzOC41NjcyIDYzLjM4MjkgMzguOTE3MyA2My4zODI5IDM5LjM0NjlWNDYuNTkyMUM2My4zODI5IDQ3LjI4NzcgNjQuMjI0IDQ3LjYzNTUgNjQuNzE1MSA0Ny4xNDIyTDc0LjY1NDEgMzcuMTg3M0M3NC43OTk0IDM3LjA0MTggNzQuODgxNiAzNi44NDQgNzQuODgxNiAzNi42MzcxVjI3LjkxODlDNzQuODgxNiAyNy40ODkyIDc0LjUzMzQgMjcuMTM5MSA3NC4xMDE3IDI3LjEzOTFMNjUuMjUzOCAyNy4xMjc3QzY1LjA0NyAyNy4xMjc3IDY0Ljg0OTIgMjcuMjA5NiA2NC43MDE0IDI3LjM1NTFMNTQuODA1NiAzNy4yMzVDNTQuMzE0NSAzNy43MjYgNTQuNjYyMyAzOC41NjcyIDU1LjM1NTcgMzguNTY3Mkg1NS4zNThaIiBmaWxsPSIjRUU3QTMwIi8+CjwvZz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yMF8xMjIzIj4KPHJlY3Qgd2lkdGg9IjQ3LjgxMjUiIGhlaWdodD0iNDcuODEyNSIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI3LjA5MzggMjcuMDkzOCkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K",
        },
        unisat: {
          id: "unisat",
          name: "Unisat",
          webUrl: "https://unisat.io/",
          icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDE4MCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iMTgwIiBmaWxsPSJibGFjayIvPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMTAwNTBfNDE3MSkiPgo8cGF0aCBkPSJNMTEzLjY2IDI5LjI4OTdMMTQzLjk3IDU5LjMwOTdDMTQ2LjU1IDYxLjg1OTcgMTQ3LjgyIDY0LjQzOTcgMTQ3Ljc4IDY3LjAzOTdDMTQ3Ljc0IDY5LjYzOTcgMTQ2LjYzIDcyLjAwOTcgMTQ0LjQ2IDc0LjE1OTdDMTQyLjE5IDc2LjQwOTcgMTM5Ljc0IDc3LjU0OTcgMTM3LjEyIDc3LjU5OTdDMTM0LjUgNzcuNjM5NyAxMzEuOSA3Ni4zNzk3IDEyOS4zMiA3My44Mjk3TDk4LjMxOTkgNDMuMTI5N0M5NC43OTk5IDM5LjYzOTcgOTEuMzk5OSAzNy4xNjk3IDg4LjEyOTkgMzUuNzE5N0M4NC44NTk5IDM0LjI2OTcgODEuNDE5OSAzNC4wMzk3IDc3LjgxOTkgMzUuMDM5N0M3NC4yMDk5IDM2LjAyOTcgNzAuMzM5OSAzOC41Nzk3IDY2LjE4OTkgNDIuNjc5N0M2MC40Njk5IDQ4LjM0OTcgNTcuNzM5OSA1My42Njk3IDU4LjAxOTkgNTguNjM5N0M1OC4yOTk5IDYzLjYwOTcgNjEuMTM5OSA2OC43Njk3IDY2LjUyOTkgNzQuMDk5N0w5Ny43Nzk5IDEwNS4wNkMxMDAuMzkgMTA3LjY0IDEwMS42NyAxMTAuMjIgMTAxLjYzIDExMi43OEMxMDEuNTkgMTE1LjM1IDEwMC40NyAxMTcuNzIgOTguMjU5OSAxMTkuOTFDOTYuMDU5OSAxMjIuMDkgOTMuNjI5OSAxMjMuMjMgOTAuOTg5OSAxMjMuMzJDODguMzQ5OSAxMjMuNDEgODUuNzE5OSAxMjIuMTYgODMuMTE5OSAxMTkuNThMNTIuODA5OSA4OS41NTk3QzQ3Ljg3OTkgODQuNjc5NyA0NC4zMTk5IDgwLjA1OTcgNDIuMTI5OSA3NS42OTk3QzM5LjkzOTkgNzEuMzM5NyAzOS4xMTk5IDY2LjQwOTcgMzkuNjg5OSA2MC45MDk3QzQwLjE5OTkgNTYuMTk5NyA0MS43MDk5IDUxLjYzOTcgNDQuMjI5OSA0Ny4yMTk3QzQ2LjczOTkgNDIuNzk5NyA1MC4zMzk5IDM4LjI3OTcgNTUuMDA5OSAzMy42NDk3QzYwLjU2OTkgMjguMTM5NyA2NS44Nzk5IDIzLjkxOTcgNzAuOTM5OSAyMC45Nzk3Qzc1Ljk4OTkgMTguMDM5NyA4MC44Nzk5IDE2LjQwOTcgODUuNTk5OSAxNi4wNjk3QzkwLjMyOTkgMTUuNzI5NyA5NC45ODk5IDE2LjY2OTcgOTkuNTk5OSAxOC44ODk3QzEwNC4yMSAyMS4xMDk3IDEwOC44OSAyNC41Njk3IDExMy42NSAyOS4yODk3SDExMy42NloiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xMDA1MF80MTcxKSIvPgo8cGF0aCBkPSJNNjYuMTA5OSAxNTAuNDJMMzUuODA5OSAxMjAuNEMzMy4yMjk5IDExNy44NCAzMS45NTk5IDExNS4yNyAzMS45OTk5IDExMi42N0MzMi4wMzk5IDExMC4wNyAzMy4xNDk5IDEwNy43IDM1LjMxOTkgMTA1LjU1QzM3LjU4OTkgMTAzLjMgNDAuMDM5OSAxMDIuMTYgNDIuNjU5OSAxMDIuMTFDNDUuMjc5OSAxMDIuMDcgNDcuODc5OSAxMDMuMzIgNTAuNDU5OSAxMDUuODhMODEuNDQ5OSAxMzYuNThDODQuOTc5OSAxNDAuMDcgODguMzY5OSAxNDIuNTQgOTEuNjM5OSAxNDMuOTlDOTQuOTA5OSAxNDUuNDQgOTguMzQ5OSAxNDUuNjYgMTAxLjk2IDE0NC42N0MxMDUuNTcgMTQzLjY4IDEwOS40NCAxNDEuMTMgMTEzLjU5IDEzNy4wMkMxMTkuMzEgMTMxLjM1IDEyMi4wNCAxMjYuMDMgMTIxLjc2IDEyMS4wNkMxMjEuNDggMTE2LjA5IDExOC42NCAxMTAuOTMgMTEzLjI1IDEwNS41OUw5Ni41OTk5IDg5LjI0MDFDOTMuOTg5OSA4Ni42NjAxIDkyLjcwOTkgODQuMDgwMSA5Mi43NDk5IDgxLjUyMDFDOTIuNzg5OSA3OC45NTAxIDkzLjkwOTkgNzYuNTgwMSA5Ni4xMTk5IDc0LjM5MDFDOTguMzE5OSA3Mi4yMTAxIDEwMC43NSA3MS4wNzAxIDEwMy4zOSA3MC45ODAxQzEwNi4wMyA3MC44OTAxIDEwOC42NiA3Mi4xNDAxIDExMS4yNiA3NC43MjAxTDEyNi45NiA5MC4xMzAxQzEzMS44OSA5NS4wMTAxIDEzNS40NSA5OS42MzAxIDEzNy42NCAxMDMuOTlDMTM5LjgzIDEwOC4zNSAxNDAuNjUgMTEzLjI4IDE0MC4wOCAxMTguNzhDMTM5LjU3IDEyMy40OSAxMzguMDYgMTI4LjA1IDEzNS41NCAxMzIuNDdDMTMzLjAzIDEzNi44OSAxMjkuNDMgMTQxLjQxIDEyNC43NiAxNDYuMDRDMTE5LjIgMTUxLjU1IDExMy44OSAxNTUuNzcgMTA4LjgzIDE1OC43MUMxMDMuNzcgMTYxLjY1IDk4Ljg3OTkgMTYzLjI5IDk0LjE0OTkgMTYzLjYzQzg5LjQxOTkgMTYzLjk3IDg0Ljc1OTkgMTYzLjAzIDgwLjE0OTkgMTYwLjgxQzc1LjUzOTkgMTU4LjU5IDcwLjg1OTkgMTU1LjEzIDY2LjA5OTkgMTUwLjQxTDY2LjEwOTkgMTUwLjQyWiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzEwMDUwXzQxNzEpIi8+CjxwYXRoIGQ9Ik04NS4wMDk5IDcyLjk1OTJDOTEuMTU2OCA3Mi45NTkyIDk2LjEzOTkgNjcuOTc2MSA5Ni4xMzk5IDYxLjgyOTJDOTYuMTM5OSA1NS42ODIzIDkxLjE1NjggNTAuNjk5MiA4NS4wMDk5IDUwLjY5OTJDNzguODYzIDUwLjY5OTIgNzMuODc5OSA1NS42ODIzIDczLjg3OTkgNjEuODI5MkM3My44Nzk5IDY3Ljk3NjEgNzguODYzIDcyLjk1OTIgODUuMDA5OSA3Mi45NTkyWiIgZmlsbD0idXJsKCNwYWludDJfcmFkaWFsXzEwMDUwXzQxNzEpIi8+CjwvZz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8xMDA1MF80MTcxIiB4MT0iMTM4Ljk4NSIgeTE9IjQ2Ljc3OTUiIHgyPSI0NS4wNTI5IiB5Mj0iODguNTIzMyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMjAxQzFCIi8+CjxzdG9wIG9mZnNldD0iMC4zNiIgc3RvcC1jb2xvcj0iIzc3MzkwRCIvPgo8c3RvcCBvZmZzZXQ9IjAuNjciIHN0b3AtY29sb3I9IiNFQTgxMDEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRjRCODUyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xMDA1MF80MTcxIiB4MT0iNDMuMzgxMiIgeTE9IjEzNC4xNjciIHgyPSIxNTIuMjMxIiB5Mj0iMTAxLjc3MSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMUYxRDFDIi8+CjxzdG9wIG9mZnNldD0iMC4zNyIgc3RvcC1jb2xvcj0iIzc3MzkwRCIvPgo8c3RvcCBvZmZzZXQ9IjAuNjciIHN0b3AtY29sb3I9IiNFQTgxMDEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRjRGQjUyIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0icGFpbnQyX3JhZGlhbF8xMDA1MF80MTcxIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDg1LjAwOTkgNjEuODM5Mikgc2NhbGUoMTEuMTMpIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0Y0Qjg1MiIvPgo8c3RvcCBvZmZzZXQ9IjAuMzMiIHN0b3AtY29sb3I9IiNFQTgxMDEiLz4KPHN0b3Agb2Zmc2V0PSIwLjY0IiBzdG9wLWNvbG9yPSIjNzczOTBEIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzIxMUMxRCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzEwMDUwXzQxNzEiPgo8cmVjdCB3aWR0aD0iMTE1Ljc3IiBoZWlnaHQ9IjE0Ny43IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzIgMTYpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==",
        },
      };
      Bn.fordefi.id, Bn.xverse.id, Bn.unisat.id;
      var zn;
      !(function (e) {
        (e[(e.SMALLEST = 0)] = "SMALLEST"),
          (e[(e.SMALL = 1)] = "SMALL"),
          (e[(e.MEDIUM = 2)] = "MEDIUM"),
          (e[(e.LARGE = 3)] = "LARGE");
      })(zn || (zn = {}));
      var Un;
      !(function (e) {
        (e.authenticationRequest = "xverse_stx_authentication_request"),
          (e.signatureRequest = "xverse_stx_signature_request"),
          (e.structuredDataSignatureRequest =
            "xverse_stx_structured_data_signature_request"),
          (e.transactionRequest = "xverse_stx_transaction_request"),
          (e.getAddressRequest = "xverse_btc_address_request"),
          (e.signPsbtRequest = "xverse_btc_sats_psbt_request"),
          (e.signBatchPsbtRequest = "xverse_btc_batch_psbt_request"),
          (e.signMessageRequest = "xverse_btc_sign_message_request"),
          (e.sendBtcRequest = "xverse_btc_send_request"),
          (e.createInscriptionRequest =
            "xverse_btc_create_inscription_Request"),
          (e.createRepeatInscriptionsRequest =
            "xverse_btc_create_repeat_inscriptions_request"),
          (e.rpcRequest = "xverse_rpc_request");
      })(Un || (Un = {}));
      var _n, Pn, Fn, qn;
      !(function (e) {
        (e.transactionRequest = "transactionRequest"),
          (e.transactionResponse = "transactionResponse"),
          (e.authenticationRequest = "authenticationRequest"),
          (e.authenticationResponse = "authenticationResponse"),
          (e.signatureRequest = "signatureRequest"),
          (e.signatureResponse = "signatureResponse"),
          (e.structuredDataSignatureRequest = "structuredDataSignatureRequest");
      })(_n || (_n = {})),
        (function (e) {
          e.request = "request";
        })(Pn || (Pn = {})),
        (function (e) {
          e.OriginatingTabClosed = "OriginatingTabClosed";
        })(Fn || (Fn = {})),
        (function (e) {
          (e.getAddressRequest = "getAddressRequest"),
            (e.getAddressResponse = "getAddressResponse"),
            (e.signPsbtRequest = "signPsbtRequest"),
            (e.signBatchPsbtRequest = "signBatchPsbtRequest"),
            (e.signPsbtResponse = "signPsbtResponse"),
            (e.signBatchPsbtResponse = "signBatchPsbtResponse"),
            (e.signMessageRequest = "signMessageRequest"),
            (e.signMessageResponse = "signMessageResponse"),
            (e.sendBtcRequest = "sendBtcRequest"),
            (e.sendBtcResponse = "sendBtcResponse"),
            (e.createInscriptionRequest = "createInscriptionRequest"),
            (e.createInscriptionResponse = "createInscriptionResponse"),
            (e.createRepeatInscriptionsRequest =
              "createRepeatInscriptionsRequest"),
            (e.createRepeatInscriptionsResponse =
              "createRepeatInscriptionsResponse");
        })(qn || (qn = {}));
      var Hn;
      function Yn(e) {
        return {
          lang: e?.lang ?? Hn?.lang,
          message: e?.message,
          abortEarly: e?.abortEarly ?? Hn?.abortEarly,
          abortPipeEarly: e?.abortPipeEarly ?? Hn?.abortPipeEarly,
        };
      }
      Error;
      function Qn(e, t, r) {
        const n = e._run({ typed: !1, value: t }, Yn(r));
        return {
          typed: n.typed,
          success: !n.issues,
          output: n.value,
          issues: n.issues,
        };
      }
      const Gn = "xverse-wallet-event",
        Wn = new Map();
      let Zn;
      const $n = (e, t) => {
          const { data: r } = e,
            n = "xverse-wallet" === r.source,
            s = r.method === t;
          return n && s && !!r.payload;
        },
        Jn = {
          connect: async (e) => {
            const t = new CustomEvent(Un.getAddressRequest, {
              detail: { btcAddressRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, qn.getAddressResponse) &&
                    s.data.payload?.addressRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.addressResponse
                      ? "string" != typeof s.data.payload.addressResponse &&
                        t(s.data.payload.addressResponse)
                      : r(s.data.payload.addressResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          signTransaction: async (e) => {
            const t = new CustomEvent(Un.signPsbtRequest, {
              detail: { signPsbtRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, qn.signPsbtResponse) &&
                    s.data.payload?.signPsbtRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.signPsbtResponse
                      ? "string" != typeof s.data.payload.signPsbtResponse &&
                        t(s.data.payload.signPsbtResponse)
                      : r(s.data.payload.signPsbtResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          signMultipleTransactions: async (e) => {
            const t = new CustomEvent(Un.signBatchPsbtRequest, {
              detail: { signBatchPsbtRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, qn.signBatchPsbtResponse) &&
                    s.data.payload?.signBatchPsbtRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.signBatchPsbtResponse
                      ? "string" !=
                          typeof s.data.payload.signBatchPsbtResponse &&
                        t(s.data.payload.signBatchPsbtResponse)
                      : r(s.data.payload.signBatchPsbtResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          signMessage: async (e) => {
            const t = new CustomEvent(Un.signMessageRequest, {
              detail: { signMessageRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, qn.signMessageResponse) &&
                    s.data.payload?.signMessageRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.signMessageResponse
                      ? "string" == typeof s.data.payload.signMessageResponse &&
                        t(s.data.payload.signMessageResponse)
                      : r(s.data.payload.signMessageResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          sendBtcTransaction: async (e) => {
            const t = new CustomEvent(Un.sendBtcRequest, {
              detail: { sendBtcRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, qn.sendBtcResponse) &&
                    s.data.payload?.sendBtcRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.sendBtcResponse
                      ? "string" == typeof s.data.payload.sendBtcResponse &&
                        t(s.data.payload.sendBtcResponse)
                      : r(s.data.payload.sendBtcResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          createInscription: async (e) => {
            const t = new CustomEvent(Un.createInscriptionRequest, {
              detail: { createInscriptionRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, qn.createInscriptionResponse) &&
                    s.data.payload?.createInscriptionRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.createInscriptionResponse
                      ? "string" !=
                          typeof s.data.payload.createInscriptionResponse &&
                        t(s.data.payload.createInscriptionResponse)
                      : r(s.data.payload.createInscriptionResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          createRepeatInscriptions: async (e) => {
            const t = new CustomEvent(Un.createRepeatInscriptionsRequest, {
              detail: { createRepeatInscriptionsRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, qn.createRepeatInscriptionsResponse) &&
                    s.data.payload?.createRepeatInscriptionsRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.createRepeatInscriptionsResponse
                      ? "string" !=
                          typeof s.data.payload
                            .createRepeatInscriptionsResponse &&
                        t(s.data.payload.createRepeatInscriptionsResponse)
                      : r(s.data.payload.createRepeatInscriptionsResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          request: async (e, t) => {
            const r = ((e = 21) =>
                crypto
                  .getRandomValues(new Uint8Array(e))
                  .reduce(
                    (e, t) =>
                      e +
                      ((t &= 63) < 36
                        ? t.toString(36)
                        : t < 62
                          ? (t - 26).toString(36).toUpperCase()
                          : t > 62
                            ? "-"
                            : "_"),
                    "",
                  ))(),
              n = { jsonrpc: "2.0", id: r, method: e, params: t },
              s = new CustomEvent(Un.rpcRequest, { detail: n });
            return (
              document.dispatchEvent(s),
              new Promise((e) => {
                window.addEventListener("message", function t(n) {
                  const s = Qn(kr, n.data);
                  if (!s.success) return;
                  const i = s.output;
                  return i.id === r
                    ? (window.removeEventListener("message", t), e(i))
                    : void 0;
                });
              })
            );
          },
          addListener: (e, t) => (
            Zn ||
              ((Zn = (e) => {
                const { detail: t } = e;
                if (
                  !(function (e, t) {
                    return !e._run({ typed: !1, value: t }, { abortEarly: !0 })
                      .issues;
                  })(Cr, t)
                )
                  return void console.warn(
                    "Received an unrecognized wallet event:",
                    e,
                  );
                const r = Wn.get(t.type);
                r && r.forEach((e) => e(t));
              }),
              window.addEventListener(Gn, Zn)),
            (function (e, t) {
              const r = Wn.get(e) || new Set();
              r.add(t), Wn.set(e, r);
            })(e, t),
            function () {
              const r = Wn.get(e);
              if (
                r &&
                (r.delete(t), 0 === r.size && Wn.delete(e), 0 === Wn.size)
              ) {
                if (!Zn)
                  return void console.error(
                    "Expected `walletEventListener` to be defined.",
                  );
                window.removeEventListener(Gn, Zn), (Zn = void 0);
              }
            }
          ),
        },
        Vn = Jn,
        Kn = {
          getURL: async () => {
            const { url: e } = await (async (e, t = {}) =>
              new Promise((r, n) => {
                const s = setTimeout(() => {
                    n(
                      new Error("Unable to get response from xverse extension"),
                    );
                  }, 1e3),
                  i = (t) => {
                    "xverse-extension" === t.data.source &&
                      t.data.method === `${e}Response` &&
                      (clearTimeout(s),
                      window.removeEventListener("message", i),
                      r(t.data));
                  };
                window.addEventListener("message", i),
                  window.postMessage(
                    { method: e, source: "xverse-app", ...t },
                    window.location.origin,
                  );
              }))("getURL");
            return e;
          },
          structuredDataSignatureRequest: async (e) => {
            const t = new CustomEvent(Un.structuredDataSignatureRequest, {
              detail: { signatureRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, _n.signatureResponse) &&
                    s.data.payload?.signatureRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.signatureResponse
                      ? "string" != typeof s.data.payload.signatureResponse &&
                        t(s.data.payload.signatureResponse)
                      : r(s.data.payload.signatureResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          signatureRequest: async (e) => {
            const t = new CustomEvent(Un.signatureRequest, {
              detail: { signatureRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, _n.signatureResponse) &&
                    s.data.payload?.signatureRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.signatureResponse
                      ? "string" != typeof s.data.payload.signatureResponse &&
                        t(s.data.payload.signatureResponse)
                      : r(s.data.payload.signatureResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          authenticationRequest: async (e) => {
            const t = new CustomEvent(Un.authenticationRequest, {
              detail: { authenticationRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, _n.authenticationResponse) &&
                    s.data.payload?.authenticationRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.authenticationResponse
                      ? t(s.data.payload.authenticationResponse)
                      : r(s.data.payload.authenticationResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          transactionRequest: async (e) => {
            const t = new CustomEvent(Un.transactionRequest, {
              detail: { transactionRequest: e },
            });
            return (
              document.dispatchEvent(t),
              new Promise((t, r) => {
                const n = (s) => {
                  $n(s, _n.transactionResponse) &&
                    s.data.payload?.transactionRequest === e &&
                    (window.removeEventListener("message", n),
                    "cancel" !== s.data.payload.transactionResponse
                      ? "string" != typeof s.data.payload.transactionResponse &&
                        t(s.data.payload.transactionResponse)
                      : r(s.data.payload.transactionResponse));
                };
                window.addEventListener("message", n);
              })
            );
          },
          getProductInfo: () => ({ version: "0.52.0", name: "Xverse Wallet" }),
          request() {
            throw new Error("`request` function is not implemented");
          },
        },
        Xn = Kn;
      window.XverseProviders = { StacksProvider: Xn, BitcoinProvider: Vn };
      try {
        document.currentScript?.dataset.isPriority
          ? Object.defineProperties(window, {
              StacksProvider: { get: () => Xn, set: () => {} },
            })
          : (window.StacksProvider = Xn);
      } catch (tr) {
        console.log(
          "Failed setting Xverse Stacks default provider. Another wallet may have already set it in an immutable way.",
        ),
          console.error(tr);
      }
      try {
        document.currentScript?.dataset.isPriority
          ? Object.defineProperties(window, {
              BitcoinProvider: { get: () => Vn, set: () => {} },
            })
          : (window.BitcoinProvider = Vn);
      } catch (tr) {
        console.log(
          "Failed setting Xverse Bitcoin default provider. Another wallet may have already set it in an immutable way.",
        ),
          console.error(tr);
      }
      window.btc_providers || (window.btc_providers = []),
        window.btc_providers.push({
          id: "XverseProviders.BitcoinProvider",
          name: "Xverse Wallet",
          icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==",
          webUrl: "https://www.xverse.app/",
          chromeWebStoreUrl:
            "https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg?hl=en-GB&authuser=1",
          googlePlayStoreUrl:
            "https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse",
          iOSAppStoreUrl:
            "https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513",
          methods: [
            "getInfo",
            "getAddresses",
            "getAccounts",
            "signMessage",
            "sendTransfer",
            "signPsbt",
            "stx_callContract",
            "stx_deployContract",
            "stx_getAccounts",
            "stx_getAddresses",
            "stx_signMessage",
            "stx_signStructuredMessage",
            "stx_signTransaction",
            "stx_transferStx",
          ],
        });
    })();
})();
