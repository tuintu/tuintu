import { err, ok, Result } from "../core/result.js";

export function blobToUri(blob: Blob): Promise<Result<string, string>> {
    if (FileReader === undefined) {
        return Promise.resolve(err("Web APIs not found"));
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const { result } = reader;
            if (typeof result === "string") {
                resolve(ok(result));
            } else {
                resolve(err("FileReader did not return string"));
            }
        };

        reader.onerror = () => {
            resolve(err("Failed to read blob"));
        };

        reader.onabort = () => {
            resolve(err("Blob reading was aborted"));
        };
    });
}

export async function tryDownloadFile(
    name: string,
    blob: Blob,
): Promise<Result<null, string>> {
    if (document === undefined) {
        return err("Web APIs not found");
    }

    const a = document.createElement("a");
    const uriRes = await blobToUri(blob);
    if (uriRes.type === "err") {
        return uriRes;
    }

    const uri = uriRes.ok;
    a.href = uri;
    a.download = name;
    a.click();
    return ok(null);
}
