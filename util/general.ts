export function delay(ms?: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms || 0 /* Default: 0ms */, nil);
    });
}

export const nil: undefined = undefined;
