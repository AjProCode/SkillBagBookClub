
export async function handler(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Skillbag Book Club API is running" }),
  };
}
