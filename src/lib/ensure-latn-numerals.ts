/**
 * Global Latin Numerals Enforcer
 *
 * Ensures that ALL numbers across the entire dashboard are displayed in Western Arabic (Latin: 0-9)
 * digits regardless of the active language (Arabic or English), while words/letters adapt faithfully
 * to the selected locale.
 */

if (typeof globalThis !== "undefined") {
  const G = globalThis as unknown as { __LATN_NUMERALS_INITIALIZED__?: boolean };

  if (!G.__LATN_NUMERALS_INITIALIZED__) {
    G.__LATN_NUMERALS_INITIALIZED__ = true;

    const origNumberToLocale = Number.prototype.toLocaleString;
    const origDateToLocaleDate = Date.prototype.toLocaleDateString;
    const origDateToLocaleTime = Date.prototype.toLocaleTimeString;
    const origDateToLocale = Date.prototype.toLocaleString;
    const OrigNumberFormat = Intl.NumberFormat;
    const OrigDateTimeFormat = Intl.DateTimeFormat;

    function enforceLatnNumberFormat(
      locales?: string | string[],
      options?: Intl.NumberFormatOptions
    ): { loc: string | string[]; opts: Intl.NumberFormatOptions } {
      const opts: Intl.NumberFormatOptions = Object.assign({}, options, {
        numberingSystem: "latn",
      });
      let loc = locales;
      if (!loc) {
        loc = "en-US";
      } else if (typeof loc === "string") {
        if (loc.startsWith("ar") && !loc.includes("-u-nu-")) {
          loc = loc + "-u-nu-latn";
        }
      } else if (Array.isArray(loc)) {
        loc = loc.map((l) =>
          typeof l === "string" && l.startsWith("ar") && !l.includes("-u-nu-")
            ? l + "-u-nu-latn"
            : l
        );
      }
      return { loc, opts };
    }

    function enforceLatnDateTimeFormat(
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ): { loc: string | string[]; opts: Intl.DateTimeFormatOptions } {
      const opts: Intl.DateTimeFormatOptions = Object.assign({}, options, {
        numberingSystem: "latn",
      });
      let loc = locales;
      if (!loc) {
        loc = "ar-SA-u-nu-latn";
      } else if (typeof loc === "string") {
        if (loc.startsWith("ar") && !loc.includes("-u-nu-")) {
          loc = loc + "-u-nu-latn";
        }
      } else if (Array.isArray(loc)) {
        loc = loc.map((l) =>
          typeof l === "string" && l.startsWith("ar") && !l.includes("-u-nu-")
            ? l + "-u-nu-latn"
            : l
        );
      }
      return { loc, opts };
    }

    // Number.prototype.toLocaleString
    Number.prototype.toLocaleString = function (
      locales?: string | string[],
      options?: Intl.NumberFormatOptions
    ): string {
      const { loc, opts } = enforceLatnNumberFormat(locales, options);
      return origNumberToLocale.call(this, loc, opts);
    };

    // Date.prototype.toLocaleDateString
    Date.prototype.toLocaleDateString = function (
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ): string {
      const { loc, opts } = enforceLatnDateTimeFormat(locales, options);
      return origDateToLocaleDate.call(this, loc, opts);
    };

    // Date.prototype.toLocaleTimeString
    Date.prototype.toLocaleTimeString = function (
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ): string {
      const { loc, opts } = enforceLatnDateTimeFormat(locales, options);
      return origDateToLocaleTime.call(this, loc, opts);
    };

    // Date.prototype.toLocaleString
    Date.prototype.toLocaleString = function (
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ): string {
      const { loc, opts } = enforceLatnDateTimeFormat(locales, options);
      return origDateToLocale.call(this, loc, opts);
    };

    // Intl.NumberFormat proxy constructor
    const PatchedNumberFormat = function (
      locales?: string | string[],
      options?: Intl.NumberFormatOptions
    ): Intl.NumberFormat {
      const { loc, opts } = enforceLatnNumberFormat(locales, options);
      return new OrigNumberFormat(loc, opts);
    } as unknown as typeof Intl.NumberFormat;
    (PatchedNumberFormat as unknown as { prototype: unknown }).prototype = OrigNumberFormat.prototype;
    PatchedNumberFormat.supportedLocalesOf = OrigNumberFormat.supportedLocalesOf;
    Intl.NumberFormat = PatchedNumberFormat;

    // Intl.DateTimeFormat proxy constructor
    const PatchedDateTimeFormat = function (
      locales?: string | string[],
      options?: Intl.DateTimeFormatOptions
    ): Intl.DateTimeFormat {
      const { loc, opts } = enforceLatnDateTimeFormat(locales, options);
      return new OrigDateTimeFormat(loc, opts);
    } as unknown as typeof Intl.DateTimeFormat;
    (PatchedDateTimeFormat as unknown as { prototype: unknown }).prototype = OrigDateTimeFormat.prototype;
    PatchedDateTimeFormat.supportedLocalesOf = OrigDateTimeFormat.supportedLocalesOf;
    Intl.DateTimeFormat = PatchedDateTimeFormat;
  }
}

export {};
