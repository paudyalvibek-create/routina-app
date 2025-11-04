import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY!
const genAI = new GoogleGenerativeAI(apiKey)

export interface RoutineBlock {
  id: string
  startTime: string
  endTime: string
  activity: string
  description: string
  category: 'work' | 'study' | 'fitness' | 'personal' | 'break' | 'sleep'
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

export interface GenerateRoutineParams {
  role: string
  goals: string[]
  constraints: string[]
  focusAreas: string[]
  wakeTime: string
  sleepTime: string
  timezone: string
  currentTime?: string
  completedBlocks?: string[]
}

const ROLE_PROMPTS = {
  student: `You are an AI routine planner for students. Create a balanced daily schedule that includes:
- Study sessions with breaks (Pomodoro technique)
- Time for classes and assignments
- Physical activity and exercise
- Meals and rest periods
- Social and recreational activities
- Adequate sleep schedule`,

  professional: `You are an AI routine planner for working professionals. Create a productive schedule that includes:
- Focused work blocks with breaks
- Meeting slots and collaboration time
- Email and communication management
- Professional development
- Exercise and wellness activities
- Work-life balance with personal time`,

  creator: `You are an AI routine planner for creators and artists. Create an inspiring schedule that includes:
- Deep work sessions for creative projects
- Skill development and learning
- Content creation and publishing
- Marketing and audience engagement
- Rest and inspiration time
- Physical and mental wellness`,

  fitness: `You are an AI routine planner for fitness enthusiasts. Create an optimal schedule that includes:
- Workout sessions (strength, cardio, flexibility)
- Meal prep and nutrition planning
- Recovery and rest periods
- Active recovery activities
- Sleep optimization
- Hydration and wellness tracking`
}

export async function generateRoutineWithGemini(params: GenerateRoutineParams): Promise<RoutineBlock[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const rolePrompt = ROLE_PROMPTS[params.role as keyof typeof ROLE_PROMPTS] || ROLE_PROMPTS.professional

  const prompt = `${rolePrompt}

User Profile:
- Role: ${params.role}
- Goals: ${params.goals.join(', ')}
- Constraints: ${params.constraints.join(', ')}
- Focus Areas: ${params.focusAreas.join(', ')}
- Wake Time: ${params.wakeTime}
- Sleep Time: ${params.sleepTime}
- Timezone: ${params.timezone}
${params.currentTime ? `- Current Time: ${params.currentTime} (re-planning from this point)` : ''}
${params.completedBlocks?.length ? `- Already Completed: ${params.completedBlocks.join(', ')}` : ''}

Create a detailed daily routine with specific time blocks. Each block should have:
- Unique ID (use format: block-1, block-2, etc.)
- Start time (HH:MM format in 24-hour)
- End time (HH:MM format in 24-hour)
- Activity name (concise, actionable)
- Description (brief, 1-2 sentences explaining the activity)
- Category (one of: work, study, fitness, personal, break, sleep)
- Priority (one of: high, medium, low)

${params.currentTime ? 
  `Start from ${params.currentTime} and plan the rest of the day. Preserve completed activities and adjust remaining schedule.` :
  `Plan from ${params.wakeTime} to ${params.sleepTime}.`
}

IMPORTANT: Respond ONLY with valid JSON array of blocks. No explanations, no markdown formatting, just the JSON array.

Example format:
[
  {
    "id": "block-1",
    "startTime": "06:00",
    "endTime": "06:30",
    "activity": "Morning Routine",
    "description": "Wake up, freshen up, and prepare for the day",
    "category": "personal",
    "priority": "high",
    "completed": false
  }
]`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    // Clean up response - remove markdown code blocks if present
    let cleanedText = text.trim()
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '')
    }
    
    // Parse JSON
    const blocks: RoutineBlock[] = JSON.parse(cleanedText)
    
    // Validate structure
    if (!Array.isArray(blocks)) {
      throw new Error('Invalid response: not an array')
    }
    
    // Validate each block has required fields
    blocks.forEach((block, index) => {
      if (!block.id || !block.startTime || !block.endTime || !block.activity || !block.category) {
        throw new Error(`Invalid block at index ${index}: missing required fields`)
      }
    })
    
    return blocks
  } catch (error) {
    console.error('Gemini API Error:', error)
    
    // Return fallback routine on error
    return getFallbackRoutine(params)
  }
}

function getFallbackRoutine(params: GenerateRoutineParams): RoutineBlock[] {
  // Simple fallback routine based on wake/sleep times
  const blocks: RoutineBlock[] = [
    {
      id: 'block-1',
      startTime: params.wakeTime,
      endTime: incrementTime(params.wakeTime, 30),
      activity: 'Morning Routine',
      description: 'Wake up, freshen up, and prepare for the day',
      category: 'personal',
      priority: 'high',
      completed: false
    },
    {
      id: 'block-2',
      startTime: incrementTime(params.wakeTime, 30),
      endTime: incrementTime(params.wakeTime, 60),
      activity: 'Breakfast',
      description: 'Healthy breakfast to start the day',
      category: 'personal',
      priority: 'high',
      completed: false
    },
    {
      id: 'block-3',
      startTime: incrementTime(params.wakeTime, 60),
      endTime: incrementTime(params.wakeTime, 150),
      activity: 'Focused Work Block',
      description: 'Deep work on priority tasks',
      category: params.role === 'student' ? 'study' : 'work',
      priority: 'high',
      completed: false
    }
  ]
  
  return blocks
}

function incrementTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMins = totalMinutes % 60
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`
}

export async function testGeminiConnection(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    const result = await model.generateContent('Say "connection successful" if you can read this.')
    const text = result.response.text()
    return text.toLowerCase().includes('connection successful')
  } catch (error) {
    console.error('Gemini connection test failed:', error)
    return false
  }
}
