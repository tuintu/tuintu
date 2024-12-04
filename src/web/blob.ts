import { Result } from '../core/result';
import { Tag } from '../core/tag';

export function blobToUri(blob: Blob): Promise<Result<string, string>> {
    if (FileReader === undefined) {
        return Promise.resolve(Tag('err', "Web APIs not found"));
    }

    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
            const { result } = reader;
            if (typeof result === 'string') {
                resolve(Tag('ok', result));
            } else {
                resolve(Tag('err', "FileReader did not return string"));
            }
        };

        reader.onerror = () => {
            resolve(Tag('err', "Failed to read blob"));
        };

        reader.onabort = () => {
            resolve(Tag('err', "Blob reading was aborted"));
        };
    });
}

export async function tryDownloadFile(name: string, blob: Blob): Promise<Result<null, string>> {
    if (document === undefined) {
        return Tag('err', "Web APIs not found");
    }

    const a = document.createElement('a');
    const uriRes = await blobToUri(blob);
    if (Tag.is(uriRes, 'err')) {
        return uriRes;
    }

    const uri = uriRes.ok;
    a.href = uri;
    a.download = name;
    a.click();
    return Tag('ok', null);
}
