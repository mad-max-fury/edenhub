export async function getImage(src: string) {
  try {
    const response = await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ src }),
    });

    if (!response.ok) {
      throw new Error("Failed to process image");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting image:", error);
    // Return a fallback with the original image but no blur
    return {
      base64: "",
      img: { src, height: 0, width: 0 },
    };
  }
}
