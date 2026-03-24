import Groq from "groq-sdk";

function getClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY! });
}

export interface GeneratedDevotional {
  verse: string;
  verse_reference: string;
  parent_explanation: string;
  children_story: string;
  questions: string[];
  prayer: string;
  theme: string;
}

export async function generateDevotional(
  theme?: string,
  childAge?: number
): Promise<GeneratedDevotional> {
  const groq = getClient();

  const themePrompt = theme
    ? `O tema do devocional deve ser: "${theme}".`
    : "Escolha um tema bíblico edificante (fé, amor, coragem, perdão, gratidão, oração, família, obediência, bondade ou esperança).";

  const ageContext = childAge
    ? `A história infantil deve ser adequada para uma criança de ${childAge} anos.`
    : "A história infantil deve ser adequada para crianças de 5 a 12 anos.";

  const prompt = `Você é um escritor de devocionais cristãos evangélicos para famílias brasileiras.

${themePrompt}
${ageContext}

Gere um devocional diário completo em JSON com EXATAMENTE este formato:
{
  "theme": "string (1-3 palavras, ex: Coragem, Amor de Deus)",
  "verse": "string (texto completo do versículo em português NVI ou ARA)",
  "verse_reference": "string (ex: João 3:16, Salmos 23:1)",
  "parent_explanation": "string (3-4 parágrafos explicando o versículo para adultos, com contexto bíblico e aplicação prática para a vida familiar)",
  "children_story": "string (uma história curta e envolvente de 2-3 parágrafos conectada ao versículo, com personagens infantis ou animais, linguagem simples)",
  "questions": ["pergunta1", "pergunta2", "pergunta3"],
  "prayer": "string (oração curta de 3-4 linhas para a família rezar juntos)"
}

Responda APENAS com o JSON válido, sem texto adicional.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Groq returned empty response");

  return JSON.parse(content) as GeneratedDevotional;
}
