import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have a fallback or a more user-friendly error.
  // For this context, we assume the key is always present.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = 'gemini-2.5-flash-preview-04-17';

const systemInstruction = `Eres un oponente de ajedrez de clase mundial, un gran maestro. Tu nombre es Gemini-Chess. Se te proporcionará la posición actual del tablero en formato FEN. Tu tarea es analizar la posición y responder únicamente con el mejor movimiento posible para el jugador actual en Notación Algebraica Estándar (SAN). No proporciones ninguna explicación, comentario ni ningún otro texto. Tu respuesta completa debe ser solo el movimiento. Por ejemplo: e4`;

export const makeAiMove = async (fen: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `FEN: ${fen}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Lower temperature for more deterministic, stronger moves
        topP: 0.9,
        topK: 10,
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking for the fastest possible response
        },
      },
    });

    const move = response.text?.trim();

    if (!move) {
      throw new Error('Gemini devolvió un movimiento vacío o inválido.');
    }

    // Basic validation of the move format
    if (move.includes(' ') || move.length > 6) {
      console.warn(
        `Gemini devolvió un formato de movimiento potencialmente inválido: "${move}". Intentando usarlo de todos modos.`,
      );
    }

    return move;
  } catch (error) {
    console.error('Error generating move from Gemini API:', error);
    // You could implement retry logic here
    throw new Error('No se pudo obtener el movimiento de la IA.');
  }
};
