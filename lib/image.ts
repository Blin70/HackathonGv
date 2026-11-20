import { MAX_REPAIR_IMAGE_BYTES } from "@/lib/schemas/repair-intake"

/** Longest edge, in pixels, of a repair photo sent to the model. */
export const REPAIR_PHOTO_MAX_DIMENSION = 1600
const REPAIR_PHOTO_QUALITY = 0.85

/**
 * Scales width × height down so the longest edge is at most `maxDimension`,
 * keeping the aspect ratio. Never scales up.
 */
export function fitWithin(width: number, height: number, maxDimension: number) {
  if (width <= 0 || height <= 0) return { width: 0, height: 0 }
  const scale = Math.min(1, maxDimension / Math.max(width, height))
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

/**
 * Browser-only. Re-encodes a photo (from the camera or a file picker) as a
 * JPEG no larger than REPAIR_PHOTO_MAX_DIMENSION on its longest edge.
 *
 * Phone cameras produce 3–10 MB images that would fail the 3 MB upload cap;
 * this brings them to a few hundred KB. Re-encoding through a canvas also drops
 * EXIF metadata, so a photo's GPS location never leaves the device.
 */
export async function prepareRepairPhoto(file: Blob): Promise<File> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    throw new Error("We couldn't read that photo. Try a JPEG, PNG, or WebP image.")
  }

  try {
    const { width, height } = fitWithin(bitmap.width, bitmap.height, REPAIR_PHOTO_MAX_DIMENSION)
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Your browser couldn't process that photo.")
    context.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", REPAIR_PHOTO_QUALITY)
    )
    if (!blob) throw new Error("Your browser couldn't process that photo.")
    if (blob.size > MAX_REPAIR_IMAGE_BYTES) throw new Error("Photos must be 3 MB or smaller.")

    return new File([blob], "repair-photo.jpg", { type: "image/jpeg" })
  } finally {
    bitmap.close()
  }
}
