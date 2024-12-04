import { Result } from '../core/result';
import { Tag } from '../core/tag';
import tu from '../tu';

export type Status = {
    code: number,
    text: string,
};

export type Response<B> = {
    status: Status,
    body: B,
};

export type Res<B> = Result<Response<B>, unknown>;

export async function fetch<B>(
    input: RequestInfo | URL,
    middleware: (body: Body) => Promise<B>,
    init?: RequestInit,
): Promise<Res<B>> {
    const responseRes = await tu.std.global.fetch(input, init);
    if (Tag.is(responseRes, 'err')) {
        return responseRes;
    }

    const response = responseRes.ok;
    const status = { code: response.status, text: response.statusText };
    const body = await middleware(response);
    return Tag('ok', { status, body });
}

export async function postJson<B>(
    input: RequestInfo | URL,
    json: string,
    middleware: (body: Body) => Promise<B>,
): Promise<Res<B>> {
    return fetch(input, middleware, {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function get<B>(
    input: RequestInfo | URL,
    middleware: (body: Body) => Promise<B>,
): Promise<Res<B>> {
    return fetch(input, middleware);
}
