// image-compress.ts
import imageCompression from "browser-image-compression";

export type ProgressHandler = (progress: number) => void;

export interface CompressOptions {
  /** 目标最大体积（MB） */
  maxSizeMB?: number;
  /** 最大边（宽或高） */
  maxWidthOrHeight?: number;
  /** 是否使用 WebWorker */
  useWebWorker?: boolean;
  /** 初始质量（0~1） */
  initialQuality?: number;
  /** 最大迭代次数 */
  maxIteration?: number;
  /** 输出 MIME，例如 "image/jpeg" "image/webp" "image/png" */
  fileType?: string;
  /** 是否尽量保留 EXIF（并非所有格式都能完整保留） */
  preserveExif?: boolean;
  /** 进度回调 0~100 */
  onProgress?: ProgressHandler;
  /** 支持 AbortController 取消 */
  signal?: AbortSignal;
  /** 输出文件名（可选） */
  fileName?: string;
}

/**
 * 压缩图片（输入 File/Blob，输出 File）
 */
export async function compressImage(
  input: File | Blob,
  opts: CompressOptions = {}
): Promise<File> {
  if (!(input instanceof Blob)) {
    throw new TypeError("compressImage: input must be a File or Blob.");
  }

  const options = normalizeOptions(input, opts);

  if (options.signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  // browser-image-compression 支持传入这些参数
  const compressedBlob = await imageCompression(input as File, {
    maxSizeMB: options.maxSizeMB,
    maxWidthOrHeight: options.maxWidthOrHeight,
    useWebWorker: options.useWebWorker,
    initialQuality: options.initialQuality,
    maxIteration: options.maxIteration,
    fileType: options.fileType,
    preserveExif: options.preserveExif,
    onProgress: options.onProgress,
    signal: options.signal,
  });

  const outName =
    options.fileName || pickOutputName(input, options.fileType ?? compressedBlob.type);

  const outType = options.fileType || compressedBlob.type || "image/jpeg";
  return blobToFile(compressedBlob, outName, outType);
}

/**
 * 压缩并返回 DataURL（适合预览）
 */
export async function compressToDataURL(
  input: File | Blob,
  opts: CompressOptions = {}
): Promise<{ file: File; dataUrl: string }> {
  const file = await compressImage(input, opts);
  const dataUrl = await blobToDataURL(file);
  return { file, dataUrl };
}

/**
 * 压缩并返回 ObjectURL（适合预览；用完记得 revoke）
 */
export async function compressToObjectURL(
  input: File | Blob,
  opts: CompressOptions = {}
): Promise<{ file: File; objectUrl: string; revoke: () => void }> {
  const file = await compressImage(input, opts);
  const objectUrl = URL.createObjectURL(file);
  return {
    file,
    objectUrl,
    revoke: () => URL.revokeObjectURL(objectUrl),
  };
}

// ---------- helpers ----------

function normalizeOptions(input: File | Blob, opts: CompressOptions) {
  return {
    maxSizeMB: opts.maxSizeMB ?? 1,
    maxWidthOrHeight: opts.maxWidthOrHeight ?? 1920,
    useWebWorker: opts.useWebWorker ?? true,
    initialQuality: clamp01(opts.initialQuality ?? 0.92),
    maxIteration: opts.maxIteration ?? 10,
    fileType: opts.fileType,
    preserveExif: opts.preserveExif ?? false,
    onProgress: opts.onProgress,
    signal: opts.signal,
    fileName: opts.fileName,
  };
}

function clamp01(n: number): number {
  const v = Number(n);
  return Math.min(1, Math.max(0, v));
}

function pickOutputName(input: File | Blob, fileType?: string): string {
  const originName = input instanceof File ? input.name : "image";
  const base = originName.replace(/\.[^.]+$/, ""); // 去掉扩展名
  const ext = mimeToExt(fileType || (input instanceof File ? input.type : ""));
  return `${base}.compressed.${ext}`;
}

function mimeToExt(mime: string): string {
  const m = (mime || "").toLowerCase();
  if (m.includes("png")) return "png";
  if (m.includes("webp")) return "webp";
  if (m.includes("gif")) return "gif";
  if (m.includes("bmp")) return "bmp";
  if (m.includes("avif")) return "avif";
  return "jpg"; // 默认 jpeg
}

function blobToFile(blob: Blob, name: string, type?: string): File {
  return new File([blob], name, {
    type: type || blob.type,
    lastModified: Date.now(),
  });
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}
