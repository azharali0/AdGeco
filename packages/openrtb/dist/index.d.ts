import { z } from 'zod';
export declare const bidRequestSchema: z.ZodObject<{
    id: z.ZodString;
    imp: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        banner: z.ZodOptional<z.ZodObject<{
            w: z.ZodOptional<z.ZodNumber>;
            h: z.ZodOptional<z.ZodNumber>;
            format: z.ZodOptional<z.ZodArray<z.ZodObject<{
                w: z.ZodNumber;
                h: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                w: number;
                h: number;
            }, {
                w: number;
                h: number;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            w?: number | undefined;
            h?: number | undefined;
            format?: {
                w: number;
                h: number;
            }[] | undefined;
        }, {
            w?: number | undefined;
            h?: number | undefined;
            format?: {
                w: number;
                h: number;
            }[] | undefined;
        }>>;
        video: z.ZodOptional<z.ZodObject<{
            mimes: z.ZodArray<z.ZodString, "many">;
            minduration: z.ZodOptional<z.ZodNumber>;
            maxduration: z.ZodOptional<z.ZodNumber>;
            protocols: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
        }, "strip", z.ZodTypeAny, {
            mimes: string[];
            minduration?: number | undefined;
            maxduration?: number | undefined;
            protocols?: number[] | undefined;
        }, {
            mimes: string[];
            minduration?: number | undefined;
            maxduration?: number | undefined;
            protocols?: number[] | undefined;
        }>>;
        bidfloor: z.ZodOptional<z.ZodNumber>;
        bidfloorcur: z.ZodDefault<z.ZodString>;
        tagid: z.ZodOptional<z.ZodString>;
        secure: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<0>, z.ZodLiteral<1>]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        bidfloorcur: string;
        banner?: {
            w?: number | undefined;
            h?: number | undefined;
            format?: {
                w: number;
                h: number;
            }[] | undefined;
        } | undefined;
        video?: {
            mimes: string[];
            minduration?: number | undefined;
            maxduration?: number | undefined;
            protocols?: number[] | undefined;
        } | undefined;
        bidfloor?: number | undefined;
        tagid?: string | undefined;
        secure?: 0 | 1 | undefined;
    }, {
        id: string;
        banner?: {
            w?: number | undefined;
            h?: number | undefined;
            format?: {
                w: number;
                h: number;
            }[] | undefined;
        } | undefined;
        video?: {
            mimes: string[];
            minduration?: number | undefined;
            maxduration?: number | undefined;
            protocols?: number[] | undefined;
        } | undefined;
        bidfloor?: number | undefined;
        bidfloorcur?: string | undefined;
        tagid?: string | undefined;
        secure?: 0 | 1 | undefined;
    }>, "many">;
    site: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        domain: z.ZodOptional<z.ZodString>;
        page: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        domain?: string | undefined;
        page?: string | undefined;
    }, {
        id?: string | undefined;
        domain?: string | undefined;
        page?: string | undefined;
    }>>;
    app: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        bundle: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        bundle?: string | undefined;
        name?: string | undefined;
    }, {
        id?: string | undefined;
        bundle?: string | undefined;
        name?: string | undefined;
    }>>;
    device: z.ZodOptional<z.ZodObject<{
        ua: z.ZodOptional<z.ZodString>;
        ip: z.ZodOptional<z.ZodString>;
        ifa: z.ZodOptional<z.ZodString>;
        os: z.ZodOptional<z.ZodString>;
        devicetype: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        ua?: string | undefined;
        ip?: string | undefined;
        ifa?: string | undefined;
        os?: string | undefined;
        devicetype?: number | undefined;
    }, {
        ua?: string | undefined;
        ip?: string | undefined;
        ifa?: string | undefined;
        os?: string | undefined;
        devicetype?: number | undefined;
    }>>;
    user: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        buyeruid: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string | undefined;
        buyeruid?: string | undefined;
    }, {
        id?: string | undefined;
        buyeruid?: string | undefined;
    }>>;
    at: z.ZodDefault<z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>]>>;
    tmax: z.ZodDefault<z.ZodNumber>;
    cur: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    regs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    ext: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    at: 1 | 2;
    id: string;
    imp: {
        id: string;
        bidfloorcur: string;
        banner?: {
            w?: number | undefined;
            h?: number | undefined;
            format?: {
                w: number;
                h: number;
            }[] | undefined;
        } | undefined;
        video?: {
            mimes: string[];
            minduration?: number | undefined;
            maxduration?: number | undefined;
            protocols?: number[] | undefined;
        } | undefined;
        bidfloor?: number | undefined;
        tagid?: string | undefined;
        secure?: 0 | 1 | undefined;
    }[];
    tmax: number;
    cur: string[];
    site?: {
        id?: string | undefined;
        domain?: string | undefined;
        page?: string | undefined;
    } | undefined;
    app?: {
        id?: string | undefined;
        bundle?: string | undefined;
        name?: string | undefined;
    } | undefined;
    device?: {
        ua?: string | undefined;
        ip?: string | undefined;
        ifa?: string | undefined;
        os?: string | undefined;
        devicetype?: number | undefined;
    } | undefined;
    user?: {
        id?: string | undefined;
        buyeruid?: string | undefined;
    } | undefined;
    regs?: Record<string, unknown> | undefined;
    ext?: Record<string, unknown> | undefined;
}, {
    id: string;
    imp: {
        id: string;
        banner?: {
            w?: number | undefined;
            h?: number | undefined;
            format?: {
                w: number;
                h: number;
            }[] | undefined;
        } | undefined;
        video?: {
            mimes: string[];
            minduration?: number | undefined;
            maxduration?: number | undefined;
            protocols?: number[] | undefined;
        } | undefined;
        bidfloor?: number | undefined;
        bidfloorcur?: string | undefined;
        tagid?: string | undefined;
        secure?: 0 | 1 | undefined;
    }[];
    at?: 1 | 2 | undefined;
    site?: {
        id?: string | undefined;
        domain?: string | undefined;
        page?: string | undefined;
    } | undefined;
    app?: {
        id?: string | undefined;
        bundle?: string | undefined;
        name?: string | undefined;
    } | undefined;
    device?: {
        ua?: string | undefined;
        ip?: string | undefined;
        ifa?: string | undefined;
        os?: string | undefined;
        devicetype?: number | undefined;
    } | undefined;
    user?: {
        id?: string | undefined;
        buyeruid?: string | undefined;
    } | undefined;
    tmax?: number | undefined;
    cur?: string[] | undefined;
    regs?: Record<string, unknown> | undefined;
    ext?: Record<string, unknown> | undefined;
}>;
export type OpenRtbBidRequest = z.infer<typeof bidRequestSchema>;
export declare const bidResponseSchema: z.ZodObject<{
    id: z.ZodString;
    seatbid: z.ZodDefault<z.ZodArray<z.ZodObject<{
        seat: z.ZodOptional<z.ZodString>;
        bid: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            impid: z.ZodString;
            price: z.ZodNumber;
            adm: z.ZodOptional<z.ZodString>;
            adomain: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            crid: z.ZodOptional<z.ZodString>;
            w: z.ZodOptional<z.ZodNumber>;
            h: z.ZodOptional<z.ZodNumber>;
            ext: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            impid: string;
            price: number;
            w?: number | undefined;
            h?: number | undefined;
            ext?: Record<string, unknown> | undefined;
            adm?: string | undefined;
            adomain?: string[] | undefined;
            crid?: string | undefined;
        }, {
            id: string;
            impid: string;
            price: number;
            w?: number | undefined;
            h?: number | undefined;
            ext?: Record<string, unknown> | undefined;
            adm?: string | undefined;
            adomain?: string[] | undefined;
            crid?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        bid: {
            id: string;
            impid: string;
            price: number;
            w?: number | undefined;
            h?: number | undefined;
            ext?: Record<string, unknown> | undefined;
            adm?: string | undefined;
            adomain?: string[] | undefined;
            crid?: string | undefined;
        }[];
        seat?: string | undefined;
    }, {
        bid: {
            id: string;
            impid: string;
            price: number;
            w?: number | undefined;
            h?: number | undefined;
            ext?: Record<string, unknown> | undefined;
            adm?: string | undefined;
            adomain?: string[] | undefined;
            crid?: string | undefined;
        }[];
        seat?: string | undefined;
    }>, "many">>;
    bidid: z.ZodOptional<z.ZodString>;
    cur: z.ZodDefault<z.ZodString>;
    nbr: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    cur: string;
    seatbid: {
        bid: {
            id: string;
            impid: string;
            price: number;
            w?: number | undefined;
            h?: number | undefined;
            ext?: Record<string, unknown> | undefined;
            adm?: string | undefined;
            adomain?: string[] | undefined;
            crid?: string | undefined;
        }[];
        seat?: string | undefined;
    }[];
    bidid?: string | undefined;
    nbr?: number | undefined;
}, {
    id: string;
    cur?: string | undefined;
    seatbid?: {
        bid: {
            id: string;
            impid: string;
            price: number;
            w?: number | undefined;
            h?: number | undefined;
            ext?: Record<string, unknown> | undefined;
            adm?: string | undefined;
            adomain?: string[] | undefined;
            crid?: string | undefined;
        }[];
        seat?: string | undefined;
    }[] | undefined;
    bidid?: string | undefined;
    nbr?: number | undefined;
}>;
export type OpenRtbBidResponse = z.infer<typeof bidResponseSchema>;
export declare function noBid(id: string, reason?: number): OpenRtbBidResponse;
