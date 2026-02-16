import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface TestScoreExtraction {
  testName: string | null;
  correctAmount: number | null;
}

export async function extractTestScoreFromImage(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<TestScoreExtraction> {
  const base64Image = imageBuffer.toString('base64');
  const mediaType = mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `This is a test score screenshot. Extract the following information:
1. The test name (usually at the top)
2. The number of questions answered correctly (usually labeled "Correct" with a green checkmark)

IMPORTANT: The tests have been rebranded. Convert these names back to the original format:
- "The Preppy Response" → "The Public Response"
- "PrepyBook" → "NavyBook"

Example: "The Preppy Response - Digital SAT Prep Test 2 - Math - Module 2 - Hard" → "The Public Response - Digital SAT Prep Test 2 - Math - Module 2 - Hard"

Respond in JSON format only, like this:
{"testName": "The Public Response - Digital SAT Prep Test 2 - Math - Module 2 - Hard", "correctAmount": 21}

If you cannot determine a value, use null for that field. Return ONLY the JSON, no other text.`,
          },
        ],
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    return { testName: null, correctAmount: null };
  }

  try {
    const parsed = JSON.parse(textContent.text.trim());
    return {
      testName: parsed.testName || null,
      correctAmount: typeof parsed.correctAmount === 'number' ? parsed.correctAmount : null,
    };
  } catch {
    return { testName: null, correctAmount: null };
  }
}

export interface OfficialTestExtraction {
  totalScore: number;
  readingWritingScore: number;
  mathScore: number;
  testDate: string; // YYYY-MM-DD format

  // Reading and Writing skills (bar level 1-7)
  rwInformationAndIdeas: number;
  rwCraftAndStructure: number;
  rwExpressionOfIdeas: number;
  rwStandardEnglishConventions: number;

  // Math skills (bar level 1-7)
  mathAlgebra: number;
  mathAdvancedMath: number;
  mathProblemSolvingDataAnalysis: number;
  mathGeometryTrigonometry: number;
}

export async function extractOfficialTestFromPDF(
  pdfBuffer: Buffer,
): Promise<OfficialTestExtraction> {
  const base64PDF = pdfBuffer.toString('base64');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64PDF,
            },
          },
          {
            type: 'text',
            text: `This is an official SAT score report PDF. Extract the following information:

1. Total Score (number between 400-1600)
2. Reading and Writing Score (number between 200-800)
3. Math Score (number between 200-800)
4. Test Date (from "Tested on" field, in YYYY-MM-DD format)

5. Knowledge and Skills performance bar levels (1-7 scale based on the visual bar fill - 1 is lowest/shortest bar, 7 is highest/full bar):

   Reading and Writing:
   - Information and Ideas (rwInformationAndIdeas)
   - Craft and Structure (rwCraftAndStructure)
   - Expression of Ideas (rwExpressionOfIdeas)
   - Standard English Conventions (rwStandardEnglishConventions)

   Math:
   - Algebra (mathAlgebra)
   - Advanced Math (mathAdvancedMath)
   - Problem-Solving and Data Analysis (mathProblemSolvingDataAnalysis)
   - Geometry and Trigonometry (mathGeometryTrigonometry)

Return ONLY a JSON object with these exact keys:
{
  "totalScore": 1530,
  "readingWritingScore": 740,
  "mathScore": 790,
  "testDate": "2025-06-07",
  "rwInformationAndIdeas": 5,
  "rwCraftAndStructure": 7,
  "rwExpressionOfIdeas": 7,
  "rwStandardEnglishConventions": 7,
  "mathAlgebra": 7,
  "mathAdvancedMath": 7,
  "mathProblemSolvingDataAnalysis": 7,
  "mathGeometryTrigonometry": 7
}

Return ONLY the JSON, no other text.`,
          },
        ],
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('Failed to extract data from PDF');
  }

  try {
    const parsed = JSON.parse(textContent.text.trim());
    return {
      totalScore: parsed.totalScore,
      readingWritingScore: parsed.readingWritingScore,
      mathScore: parsed.mathScore,
      testDate: parsed.testDate,
      rwInformationAndIdeas: parsed.rwInformationAndIdeas,
      rwCraftAndStructure: parsed.rwCraftAndStructure,
      rwExpressionOfIdeas: parsed.rwExpressionOfIdeas,
      rwStandardEnglishConventions: parsed.rwStandardEnglishConventions,
      mathAlgebra: parsed.mathAlgebra,
      mathAdvancedMath: parsed.mathAdvancedMath,
      mathProblemSolvingDataAnalysis: parsed.mathProblemSolvingDataAnalysis,
      mathGeometryTrigonometry: parsed.mathGeometryTrigonometry,
    };
  } catch {
    throw new Error('Failed to parse PDF extraction response');
  }
}
