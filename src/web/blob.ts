import { Result, ResultType } from '../core/result';

export function blobToUri(blob: Blob): Promise<Result<string, string>> {
    if (FileReader === undefined) {
        return Promise.resolve({ type: ResultType.Err, err: "Web APIs not found" });
    }

    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const { result } = reader;
            if (typeof result === 'string') {
                resolve({ type: ResultType.Ok, ok: result });
            } else {
                resolve({ type: ResultType.Err, err: "FileReader did not return string" });
            }
        };

        reader.onerror = () => {
            resolve({ type: ResultType.Err, err: "Failed to read blob" });
        };

        reader.onabort = () => {
            resolve({ type: ResultType.Err, err: "Blob reading was aborted" });
        };
    });
}

export async function tryDownloadFile(name: string, blob: Blob): Promise<Result<null, string>> {
    if (document === undefined) {
        return { type: ResultType.Err, err: "Web APIs not found" };
    }

    const a = document.createElement('a');
    const uriRes = await blobToUri(blob);
    if (uriRes.type === ResultType.Err) {
        return uriRes;
    }

    const uri = uriRes.ok;
    a.href = uri;
    a.download = name;
    a.click();
    return { type: ResultType.Ok, ok: null };
}
