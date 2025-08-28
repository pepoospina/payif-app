export async function streamToUint8Array(stream: ReadableStream): Promise<Uint8Array> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    if (value) {
      chunks.push(value)
    }
  }

  // Calculate total length for all chunks
  let totalLength = 0
  for (const chunk of chunks) {
    totalLength += chunk.length
  }

  // Create a new Uint8Array to store all the chunks
  const result = new Uint8Array(totalLength)

  // Copy chunks to the result Uint8Array
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }

  return result
}
