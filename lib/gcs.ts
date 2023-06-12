export async function uploadToGcs( dataUri: RequestInfo | URL, signedUrl: RequestInfo | URL, filename: string) {
    // Convert the data URI to a Blob
    const response = await fetch(dataUri);
    const blob = await response.blob();

    // Upload the Blob to GCS using the signed URL
    const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/octet-stream",
        },
        body: blob,
    });
    if (!uploadResponse.ok) {
        throw new Error("Could not upload file.");
    }

    const bucketName = "window-objects";
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    return publicUrl;
}

export async function getSignedURL(filename: string) {
    const signedurlResponse = await fetch("/api/generateSignedUrl", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: filename }),
    });
    if (!signedurlResponse.ok) {
        throw new Error("Could not get signed URL.");
    }
    const signedUrlResponse = await signedurlResponse.json();
    return signedUrlResponse;
}
