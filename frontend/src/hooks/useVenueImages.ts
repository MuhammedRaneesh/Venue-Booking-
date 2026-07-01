import { useEffect, useRef, useState } from "react";

export function useVenueImages(initialPhotos: string[] = []) {
    const [existingPhotos, setExistingPhotos] = useState<string[]>(initialPhotos);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setExistingPhotos(initialPhotos);
    }, [initialPhotos.join(",")]); 

    useEffect(() => {
        return () => previewUrls.forEach(URL.revokeObjectURL);
    }, [previewUrls]);

    const onFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        onUpdate: (files: File[]) => void
    ) => {
        const picked = Array.from(e.target.files ?? []);
        const next = [...files, ...picked];
        previewUrls.forEach(URL.revokeObjectURL);
        setPreviewUrls(next.map((f) => URL.createObjectURL(f)));
        setFiles(next);
        onUpdate(next);
        if (inputRef.current) inputRef.current.value = "";
    };

    const removeNewFile = (index: number, onUpdate: (files: File[]) => void) => {
        const next = files.filter((_, i) => i !== index);
        previewUrls.forEach(URL.revokeObjectURL);
        setPreviewUrls(next.map((f) => URL.createObjectURL(f)));
        setFiles(next);
        onUpdate(next);
    };

    const removeExistingPhoto = (index: number) => {
        setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const reset = () => {
        previewUrls.forEach(URL.revokeObjectURL);
        setPreviewUrls([]);
        setFiles([]);
        setExistingPhotos([]);
    };

    return {
        existingPhotos,
        previewUrls,
        files,
        totalCount: existingPhotos.length + files.length,
        inputRef,
        onFileChange,
        removeNewFile,
        removeExistingPhoto,
        reset,
    };
}
